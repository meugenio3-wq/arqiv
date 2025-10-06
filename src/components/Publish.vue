<template>
  <!-- Feedback de carregamento -->
  <div v-if="loading" class="text-center py-6 text-gray-500">
    <span class="animate-spin inline-block border-4 border-blue-500 border-t-transparent rounded-full w-6 h-6"></span>
    <p>Carregando...</p>
  </div>

  <!-- Conteúdo normal só aparece quando não está carregando -->
  <div v-else>
    <div class="flex items-center shadow-lg justify-between p-4">
      <span @click.prevent="goHome" class="inline-flex items-baseline space-x-0.5 font-sans font-semibold text-gray-800 text-2xl">
        <span>ar</span>
        <span class="text-3xl font-extrabold text-blue-500 leading-none">Q</span>
        <span>iv</span>
      </span>
    </div>

    <div class="min-h-screen bg-gray-100 flex justify-center p-4">
      <div class="w-full max-w-md bg-white rounded-lg shadow p-6 space-y-6">

        <h1 class="text-2xl font-bold text-blue-500 text-center">Publicar Ficheiro</h1>

        <!-- 1. Escolha de ficheiro -->
        <div class="flex flex-col space-y-2">
          <label class="font-medium text-gray-700">Escolher Ficheiro</label>
          <input @change="selecionarFicheiro" type="file" class="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
        </div>

        <!-- 2. Descrição -->
        <div class="flex flex-col space-y-2">
          <label class="font-medium text-gray-700">Descrição</label>
          <textarea 
            v-model="descricao"
            rows="4" 
            placeholder="Descreva o ficheiro..." 
            class="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
          ></textarea>
        </div>

        <!-- Público / Privado -->
        <div class="flex items-center space-x-4">
          <label>
            <input type="radio" value="true" v-model="publico" /> Público
          </label>
          <label>
            <input type="radio" value="false" v-model="publico" /> Privado
          </label>
        </div>

        <!-- 5. Botão de enviar -->
        <div class="flex justify-center">
          <button
            @click="enviarFicheiro"
            class="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Publicar
          </button>
        </div>

      </div>
    </div>
  </div>
</template>


<script setup>
import { ref } from "vue"
import {useRouter} from "vue-router"
const loading = ref(false)   // ✅ estado de carregamento
const erro = ref(null)       // opcional: feedback se a API falhar

const ficheiro = ref(null)
const descricao = ref("")
const publico = ref("true")  // padrão público
const pago = ref("false")    // padrão grátis
const token = localStorage.getItem("token");
const router = useRouter()

const selecionarFicheiro = (event) => {
  ficheiro.value = event.target.files[0]
}


const enviarFicheiro = async () => {
  
  loading.value = true
    erro.value = null

  if (!ficheiro.value) {
    alert("Escolha um ficheiro primeiro")
    return
  }

  const confirma = confirm("Deseja realmente publicar este ficheiro?")
  if (!confirma) return

  const formData = new FormData()
  formData.append("ficheiro", ficheiro.value)
  formData.append("descricao", descricao.value)
  formData.append("publico", publico.value)
  formData.append("pago", pago.value)

  try {
    const resposta = await fetch("https://sgnid.pythonanywhere.com//ficheiros", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token
      },
      body: formData
    })

    const dados = await resposta.json()
    router.push("/home")
  } catch (erro) {
    console.error("Erro ao enviar:", erro)
    alert("Erro ao enviar ficheiro"+erro)
  } finally {
    loading.value = false
  }
}

  const goHome = () => {
    router.push('/home'); // Rota definida no Vue Router
  }
</script>

