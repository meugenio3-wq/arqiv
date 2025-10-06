<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 px-4">
    <div
      class="bg-white/95 backdrop-blur-md p-8 rounded-3xl shadow-2xl w-full max-w-sm text-center animate-fade-in"
    >
      <!-- Logo -->
      <img
        src="/logo.jpeg"
        alt="Logo"
        class="w-32 h-auto mx-auto mb-6 drop-shadow-md"
      />

      <!-- Título -->
      <h1 class="text-2xl font-extrabold text-gray-800 mb-8 tracking-tight">
        Bem-vindo ao <span class="text-blue-600">SGNID</span>
      </h1>

      <!-- Botão login -->
      <button
        type="button"
        @click.prevent="goToLogin"
        class="w-full py-3 rounded-xl border-2 border-blue-600 text-blue-600 font-semibold hover:bg-blue-600 hover:text-white transition-all duration-200 shadow-md"
      >
        Iniciar sessão
      </button>

      <!-- Divisor -->
      <div class="flex items-center my-6">
        <hr class="flex-grow border-gray-300" />
        <span class="px-3 text-gray-400 text-sm">ou</span>
        <hr class="flex-grow border-gray-300" />
      </div>

      <!-- Botão cadastro -->
      <button
        type="button"
        @click.prevent="goToSignUp"
        class="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-md"
      >
        Criar conta
      </button>

      <!-- Rodapé -->
      <p class="text-xs text-gray-500 mt-6">
        © {{ new Date().getFullYear() }} SGNID — Todos os direitos reservados
      </p>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router"

const router = useRouter()

const goToLogin = () => router.push("/login")
const goToSignUp = () => router.push("/cadastrar")
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in {
  animation: fade-in 0.8s ease-out;
}
</style>
