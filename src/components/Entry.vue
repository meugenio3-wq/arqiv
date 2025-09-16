<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <div class="bg-white p-6 space-y-6 rounded-2xl shadow-lg w-full max-w-md">
      <h1 class="text-2xl font-bold text-blue-600 mb-6 text-center">
        <img src="/logo.jpeg" alt="Logo" class="w-40 h-auto mx-auto" />
      </h1>

      <!-- Botão login -->
      <button
        type="button"
        @click.prevent="goToLogin"
        class="w-full py-3 rounded-lg border-2 shadow-md text-blue-600 border-blue-600 transition"
      >
        Iniciar sessão
      </button>

      <!-- Botão cadastro -->
      <button
        type="button"
        @click.prevent="goToSignUp"
        class="w-full py-3 bg-blue-500 text-white shadow-md rounded-lg hover:bg-blue-600 transition"
      >
        Criar conta
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router"

const router = useRouter()

const goToLogin = () => {
  router.push("/login") // Rota definida no Vue Router
}

const goToSignUp = () => {
  router.push("/cadastrar") // Rota definida no Vue Router
}
</script>
