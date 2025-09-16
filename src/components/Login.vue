<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <div class="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
      <h1 class="text-2xl font-bold text-blue-600 mb-6 text-center">
        <img src="/logo.jpeg" alt="Logo" class="w-40 h-auto mx-auto" />
      </h1>

      <p class="text-center mt-2 text-red-500" v-if="mensagem">{{ mensagem }}</p>

      <form @submit.prevent="cadastrarUsuario" class="flex flex-col space-y-4 text-left">
        <!-- Nome -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Nome
          </label>
          <input
            v-model="nome"
            type="text"
            placeholder="João Badjia"
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <!-- Número de celular -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Número de celular
          </label>
          <input
            v-model="celular"
            type="text"
            placeholder="87/94XXXXXXX"
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <!-- Senha -->
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
          Cadastrar
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"

const nome = ref("")
const celular = ref("")
const senha = ref("")
const mensagem = ref("")
const router = useRouter()

const cadastrarUsuario = async () => {
  // Validação básica
  if (!nome.value || !celular.value || !senha.value) {
    mensagem.value = "Preencha todos os campos."
    return
  }

  // Remove caracteres não numéricos
  const celularNumeros = celular.value.replace(/\D/g, "")

  // Verifica entre 9 e 12 dígitos (ajuste conforme regra do backend)
  if (!/^\d{9,12}$/.test(celularNumeros)) {
    mensagem.value = "Número de celular inválido."
    return
  }

  try {
    const resposta = await fetch("https://sgnid.pythonanywhere.com//register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome: nome.value,
        numero: celularNumeros, // 👈 coerente com backend
        senha: senha.value,
      }),
    })

    const dados = await resposta.json()

    if (resposta.ok && dados.mensagem === "success") {
      router.push("/login")
    } else {
      mensagem.value = dados.mensagem || "Erro ao cadastrar."
    }
  } catch (erro) {
    mensagem.value = "Erro ao conectar com o servidor."
    console.error("Cadastro error:", erro)
  }
}
</script>
