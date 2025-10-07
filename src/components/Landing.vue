<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center text-center px-6">
    <!-- Logo -->
    <img src="/logo.jpeg" alt="Logo arQiv" class="w-32 h-auto mb-6 rounded-lg shadow-md" />

    <!-- Nome -->
    <h1 class="text-4xl font-bold text-blue-700 mb-3 tracking-tight">
      Bem-vindo ao <span class="text-blue-500">arQiv</span>
    </h1>

    <!-- Descrição -->
    <p class="text-gray-600 max-w-md mb-8 leading-relaxed text-lg">
      O <strong>arQiv</strong> é um espaço digital aberto para partilhar e descobrir ficheiros de forma livre, rápida e anónima.  
      Aqui, cada utilizador pode guardar, publicar e distribuir os seus conteúdos com apenas um link — sem registos complicados e sem limitações desnecessárias.
    </p>

    <!-- Frase de destaque -->
    <p class="text-gray-700 italic mb-10">
      Simples. Seguro. Para todos.
    </p>

    <!-- Botão principal -->
    <button
      @click="continuar"
      class="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-10 rounded-xl shadow-lg transition transform hover:scale-105"
    >
      Continuar
    </button>

    <!-- Rodapé -->
    <div class="mt-10 text-xs text-gray-400">
      © 2025 arQiv — Partilhe o que é seu, de forma livre.
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router"

const router = useRouter()

const continuar = () => {
  router.push("/entry")
}
</script>
