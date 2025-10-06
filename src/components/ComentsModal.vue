<template>
  <!-- Overlay -->
  <div
    v-if="show"
    class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
  >
    <!-- Modal -->
    <div
      class="bg-white w-full max-w-md sm:max-w-lg md:max-w-xl max-h-[80vh] rounded-2xl shadow-xl p-5 flex flex-col overflow-hidden relative animate-fade-in"
    >
      <!-- Botão fechar -->
      <button
        class="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition"
        @click="$emit('close')"
      >
        ✕
      </button>

      <!-- Título -->
      <h2 class="text-xl font-semibold mb-4 text-gray-800 text-center border-b pb-2">
        Comentários
      </h2>

      <!-- Lista de comentários -->
      <div class="flex-1 overflow-y-auto pr-1 space-y-3 mb-4 custom-scroll">
        <div
          v-for="c in comentarios"
          :key="c.id"
          class="p-3 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 transition"
        >
          <p class="font-medium text-sm text-gray-800">{{ c.autor }}</p>
          <p class="text-gray-700 text-sm leading-snug mt-1">{{ c.conteudo }}</p>
          <p class="text-gray-400 text-xs text-right mt-2">{{ c.data_criacao }}</p>
        </div>
      </div>

      <!-- Campo adicionar comentário -->
      <div class="flex mt-auto">
        <input
          v-model="novoComentario"
          type="text"
          placeholder="Escreva um comentário..."
          class="flex-1 border border-gray-300 rounded-l-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          @keyup.enter="adicionarComentario"
        />
        <button
          class="bg-blue-500 text-white px-4 rounded-r-lg hover:bg-blue-600 transition flex items-center justify-center"
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

defineProps({
  show: Boolean,
  fileId: Number
})
defineEmits(["close"])

const comentarios = ref([])
const novoComentario = ref("")
const token = localStorage.getItem("token")

async function carregarComentarios() {
  if (!fileId) return
  try {
    const res = await fetch(`https://sgnid.pythonanywhere.com/comentarios/${fileId}`)
    comentarios.value = await res.json()
  } catch (e) {
    console.error("Erro ao carregar comentários:", e)
  }
}

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
      await carregarComentarios()
    } else {
      console.error("Erro ao adicionar comentário")
    }
  } catch (e) {
    console.error("Erro:", e)
  }
}

watch(() => fileId, () => carregarComentarios())
onMounted(() => carregarComentarios())
</script>

<style scoped>
/* Animação de entrada */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
.animate-fade-in {
  animation: fade-in 0.25s ease-out;
}

/* Scrollbar personalizada */
.custom-scroll::-webkit-scrollbar {
  width: 6px;
}
.custom-scroll::-webkit-scrollbar-thumb {
  background-color: #d1d5db;
  border-radius: 4px;
}
</style>
