<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <div class="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
      <h1 class="text-2xl font-bold text-blue-600 mb-6 text-center">
        <img src="/logo.jpeg" alt="Logo" class="w-40 h-auto mx-auto" />
      </h1>

      <p class="text-center mt-2 text-red-500" v-if="mensagem">{{ mensagem }}</p>

      <form @submit.prevent="verificarUsuario" class="flex flex-col space-y-4 text-left">
        <!-- Campo celular -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Número de celular
          </label>
          <input
            v-model="numero"
            type="text"
            placeholder="87/94XXXXXXX"
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <!-- Campo senha -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Senha
          </label>
          <input
            v-model="senha"
            type="password"
            placeholder="Digite sua senha"
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <!-- Botão -->
        <button
          type="submit"
          class="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Entrar
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"

const numero = ref("")
const senha = ref("")
const mensagem = ref("")
const router = useRouter()

const verificarUsuario = async () => {
  if (!numero.value || !senha.value) {
    mensagem.value = "Preencha todos os campos."
    return
  }

  // Remove caracteres não numéricos
  const celularNumeros = numero.value.replace(/\D/g, "")

  // Verifica 9 a 12 dígitos (ajuste conforme regra do backend)
  if (!/^\d{9,12}$/.test(celularNumeros)) {
    mensagem.value = "Número de celular inválido."
    return
  }

  mensagem.value = "Aguarde..."
  try {
    const resposta = await fetch("https://sgnid.pythonanywhere.com/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        numero: celularNumeros,
        senha: senha.value
      }),
    })

    if (!resposta.ok) {
      throw new Error("Erro ao autenticar")
    }

    const dados = await resposta.json()

    if (dados.token) {
      localStorage.setItem("token", dados.token)
      router.push("/home")
    } else {
      mensagem.value = dados.mensagem || "Falha no login."
    }
  } catch (e) {
    console.error("Erro no login:", e)
    mensagem.value = "Erro ao conectar ao servidor."
  }
}
</script>
