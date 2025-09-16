<template>
  <!-- Overlay -->
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <!-- Modal -->
    <div class="bg-white w-96 max-h-[80vh] rounded-lg p-4 overflow-y-auto relative">
      <!-- Botão fechar -->
      <button
        class="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        @click="$emit('close')"
      >
        ✕
      </button>

      <h2 class="text-lg font-semibold mb-2">Comentários</h2>

      <!-- Lista de comentários -->
      <div class="space-y-2 mb-4">
        <div
          v-for="c in comentarios"
          :key="c.id"
          class="p-2 border rounded-md bg-gray-50"
        >
          <p class="font-medium text-sm">{{ c.autor }}</p>
          <p class="text-gray-700 text-sm">{{ c.conteudo }}</p>
          <p class="text-gray-400 text-xs text-right">{{ c.data_criacao }}</p>
        </div>
      </div>

      <!-- Campo para adicionar comentário -->
      <div class="flex">
        <input
          v-model="novoComentario"
          type="text"
          placeholder="Escreva um comentário..."
          class="flex-1 border rounded-l-md p-2 text-sm"
          @keyup.enter="adicionarComentario"
        />
        <button
          class="bg-blue-500 text-white px-4 rounded-r-md hover:bg-blue-600"
          @click="adicionarComentario"
        >
          Enviar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue"

// Props
defineProps({
  show: Boolean,
  fileId: Number
})

defineEmits(["close"])

const comentarios = ref([])
const novoComentario = ref("")

// Simula token de login
const token = localStorage.getItem("token")

// Função para carregar comentários da API
async function carregarComentarios() {
  if (!fileId) return
  try {
    const res = await fetch(`https://sgnid.pythonanywhere.com/comentarios/${fileId}`)
    comentarios.value = await res.json()
  } catch (e) {
    console.error("Erro ao carregar comentários:", e)
  }
}

// Adicionar comentário
async function adicionarComentario() {
  if (!novoComentario.value.trim()) return

  try {
    const res = await fetch(`https://sgnid.pythonanywhere.com/comentarios/${fileId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify({ conteudo: novoComentario.value })
    })

    if (res.ok) {
      novoComentario.value = ""
      await carregarComentarios() // recarrega lista
    } else {
      console.error("Erro ao adicionar comentário")
    }
  } catch (e) {
    console.error("Erro:", e)
  }
}

// Recarrega comentários quando o modal abre
watch(
  () => fileId,
  () => {
    carregarComentarios()
  }
)

onMounted(() => {
  carregarComentarios()
})
</script>
