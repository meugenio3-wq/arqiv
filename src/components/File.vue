<template>
  <div class="min-h-screen bg-gray-100 flex flex-col items-center">
    <!-- Cabeçalho -->
    <header class="w-full bg-white shadow-sm">
      <div class="flex items-center justify-between max-w-4xl mx-auto p-4">
        <span
          @click.prevent="goHome"
          class="inline-flex items-baseline space-x-0.5 font-sans font-semibold text-gray-800 text-2xl cursor-pointer select-none"
        >
          <span>ar</span>
          <span class="text-3xl font-extrabold text-blue-500 leading-none">Q</span>
          <span>iv</span>
        </span>
      </div>
    </header>

    <!-- Conteúdo principal -->
    <main class="flex flex-col items-center w-full p-4 space-y-4">
      <!-- Área da mídia -->
      <div
        class="w-full max-w-2xl bg-white rounded-xl shadow-lg overflow-hidden transition hover:shadow-xl"
      >
        <!-- Imagem -->
        <img
          v-if="file?.url && isImage(file.url)"
          :src="file.url"
          alt="Ficheiro"
          class="w-full h-72 object-cover"
        />

        <!-- Vídeo -->
        <video
          v-else-if="file?.url && isVideo(file.url)"
          :src="file.url"
          class="w-full h-72 object-cover"
          controls
        />

        <!-- Arquivo genérico -->
        <div
          v-else
          class="flex items-center justify-center w-full h-72 bg-gray-200"
        >
          <img
            src="../../public/file.png"
            alt="Ficheiro"
            class="w-24 opacity-70"
          />
        </div>
      </div>

      <!-- Informações do ficheiro -->
      <div
        class="w-full max-w-2xl bg-white rounded-xl shadow p-5 flex flex-col space-y-5"
      >
        <!-- Autor e Data -->
        <div class="flex items-center justify-between text-sm text-gray-500 border-b pb-2">
          <span>👤 Autor: {{ file?.autor || 'Carregando...' }}</span>
          <span>📅 {{ file?.data_upload || 'Carregando...' }}</span>
        </div>

        <!-- Nome e descrição -->
        <div class="space-y-2">
          <p class="font-semibold text-gray-800 truncate">
            🗂 Nome: {{ file?.filename || '' }}
          </p>
          <div
            class="max-h-48 overflow-y-auto p-3 border border-gray-200 rounded-lg text-sm leading-relaxed text-gray-700 bg-gray-50"
          >
            {{ file?.descricao || 'Sem descrição disponível.' }}
          </div>
        </div>

        <!-- Estatísticas e ações -->
        <div class="grid grid-cols-3 gap-3 text-center">
          <!-- Comentar -->
          <button
            @click.prevent="abrirModal = true; carregarComentarios()"
            class="flex flex-col items-center justify-center bg-gray-50 border border-gray-200 rounded-xl p-3 hover:bg-gray-100 transition"
          >
            <span class="material-icons text-gray-600">chat_bubble</span>
            <span class="text-xs font-medium mt-1">
              {{ file?.comentarios || 0 }} Comentar
            </span>
          </button>

          <!-- Partilhar -->
          <button
            @click="partilhar(file.file_id)"
            class="flex flex-col items-center justify-center bg-gray-50 border border-gray-200 rounded-xl p-3 hover:bg-gray-100 transition"
          >
            <span class="material-icons text-gray-600">share</span>
            <span class="text-xs font-medium mt-1">
              {{ file?.partilhas || 0 }} Partilhar
            </span>
          </button>

          <!-- Baixar -->
          <a
            @click.prevent="baixarArquivo(file.file_id)"
            class="flex flex-col items-center justify-center bg-gray-50 border border-gray-200 rounded-xl p-3 hover:bg-gray-100 transition cursor-pointer"
          >
            <span class="material-icons text-gray-600">download</span>
            <span class="text-xs font-medium mt-1">
              {{ file?.downloads || 0 }} Baixar
            </span>
          </a>
        </div>
      </div>
    </main>

    <!-- Modal de Comentários (INALTERADO) -->
    <div
      v-if="abrirModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start sm:items-center pt-20 sm:pt-0 z-50 overflow-y-auto"
    >
      <div
        class="bg-white rounded-2xl w-[90%] sm:w-[500px] max-h-[85vh] p-5 shadow-xl flex flex-col animate-fade-in"
      >
        <div class="flex justify-between items-center border-b pb-2 mb-3">
          <h2 class="text-lg font-semibold text-gray-800">💬 Comentários</h2>
          <button
            @click="abrirModal = false"
            class="text-gray-500 hover:text-red-500 transition"
          >
            &times;
          </button>
        </div>

        <div class="flex flex-wrap gap-2 mb-4">
          <input
            v-model="novoComentario"
            placeholder="Escreva um comentário..."
            class="flex-1 min-w-[60%] border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            @click="enviarComentario"
            class="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition w-auto sm:w-[30%] max-w-[140px]"
          >
            Enviar
          </button>
        </div>

        <div class="flex-1 overflow-y-auto space-y-2 pr-1 scroll-smooth">
          <div
            v-for="c in comentarios"
            :key="c.id"
            class="p-3 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
          >
            <div class="flex justify-between items-center">
              <span class="font-semibold text-gray-800"
                >Publicado por: {{ c.autor }}</span
              >
              <span class="text-xs text-gray-400">{{ c.data_criacao }}</span>
            </div>
            <p class="text-gray-700 text-sm mt-1">{{ c.conteudo }}</p>
          </div>

          <div v-if="!comentarios.length" class="text-center text-gray-400 py-6">
            Nenhum comentário ainda 😔
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@import url("https://fonts.googleapis.com/icon?family=Material+Icons");

/* animação suave de entrada do modal */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.25s ease-in-out;
}
</style>
