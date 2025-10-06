<template>
  <div class="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
    <!-- Logo / Nome -->
    <div class="text-center">
      <h1 class="text-3xl font-bold mb-4 tracking-wide">SGNID</h1>
      <p class="text-sm opacity-80">A verificar sessão...</p>
    </div>

    <!-- Loader animado -->
    <div class="mt-8 w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>

    <!-- Mensagem opcional de progresso -->
    <p v-if="mensagem" class="mt-4 text-xs opacity-70">{{ mensagem }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()
const mensagem = ref("Por favor, aguarde...")

onMounted(async () => {
  const token = localStorage.getItem("token")

  if (!token) {
    mensagem.value = "Nenhum token encontrado. Redirecionando..."
    return setTimeout(() => router.replace("/entry"), 800)
  }

  try {
    mensagem.value = "A verificar token..."
    const resposta = await fetch("https://sgnid.pythonanywhere.com/verificar", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    })

    if (!resposta.ok) {
      throw new Error("Token inválido ou expirado")
    }

    const dados = await resposta.json()

    mensagem.value = "Sessão válida. Entrando..."
    setTimeout(() => {
      if (dados.valido || dados.user) router.replace("/home")
      else {
        localStorage.removeItem("token")
        router.replace("/entry")
      }
    }, 800)
  } catch (e) {
    console.error("Erro ao verificar token:", e.message)
    mensagem.value = "Erro de verificação. Redirecionando..."
    localStorage.removeItem("token")
    setTimeout(() => router.replace("/entry"), 1200)
  }
})
</script>

<style>
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
