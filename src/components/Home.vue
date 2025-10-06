<template>
<!-- Header fixo (só logo + avatar + sair) -->
<div class="fixed top-0 left-0 w-full z-50 bg-white shadow">
  <div class="flex items-center justify-between p-4">
    <!-- Logo -->
    <span class="inline-flex items-baseline space-x-0.5 font-sans font-semibold text-gray-800 text-2xl">
      <span>ar</span>
      <span class="text-3xl font-extrabold text-blue-500 leading-none">Q</span>
      <span>iv</span>
    </span>

    <!-- Botão + Avatar -->
    <div class="flex items-center space-x-4">
      <a href="#" @click.prevent="goToUser">
        <img :src="avatarUrl" alt="Avatar" class="w-10 h-10 rounded-full border-2 border-gray-300 hover:border-blue-500 transition" />
      </a>
      <button @click.prevent="logout" class="bg-white border-2 border-red-500 text-red-500 px-4 py-2 rounded-lg hover:bg-red-500 hover:text-white transition">
        Sair
      </button>
    </div>
  </div>
</div>

<!-- Estatísticas + Pesquisa/Filtros (não fixo) -->
<div class="mt-[72px]"> <!-- margin-top para compensar altura do header fixo -->
  <!-- Área de Estatísticas -->
  <div class="flex justify-around items-center bg-gray-50 shadow-inner py-2 px-4 text-sm sm:text-base">
    <div class="flex items-center space-x-1">
      <span class="material-icons text-gray-600">folder</span>
      <span class="text-xs sm:text-base font-medium">{{ totalItems }}</span>
      <span class="hidden sm:inline"> Ficheiros</span>
    </div>
    <div class="flex items-center space-x-1">
      <span class="material-icons text-gray-600">download</span>
      <span class="text-xs sm:text-base font-medium">{{downloads_count}}</span>
      <span class="hidden sm:inline"> Downloads</span>
    </div>
    <div class="flex items-center space-x-1">
      <span class="material-icons text-gray-600">share</span>
      <span class="text-xs sm:text-base font-medium">{{partilhas_count}}</span>
      <span class="hidden sm:inline"> Partilhas</span>
    </div>
  </div>

<!-- Pesquisa e Filtros -->
<div class="flex flex-col sm:flex-row items-center justify-between bg-white p-4 space-y-3 sm:space-y-0 sm:space-x-4 shadow-sm w-full">

  <!-- Campo de Pesquisa com Botão -->
  <div class="flex w-full sm:flex-1">
    <input
      type="text"
      placeholder="Pesquisar ficheiros..."
      v-model="termoBusca"
      class="w-[70%] border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
    <button
      @click.prevent="pesquisar"
      class="w-[30%] bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 transition text-center"
    >
      Pesquisar
    </button>
  </div>

  <!-- Botão enviar -->
  <button
    @click.prevent="goToUpload"
    class="w-full sm:w-[30%] bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition flex items-center justify-center space-x-2"
  >
    <span class="material-icons text-base">upload</span>
    <span>Enviar ficheiro</span>
  </button>

</div>

</div>


<!-- Feedback de carregamento -->
<div v-if="loading" class="text-center py-6 text-gray-500 bg-black-600 h-mx">
  <span class="animate-spin inline-block border-4 border-blue-500 border-t-transparent rounded-full w-6 h-6"></span>
  <p>Carregando ficheiros...</p>
</div>

<!-- Conteúdo scrollable -->
<main v-else class="pt-[10px] sm:pt-[10px] px-4 pb-4 bg-gray-100 min-h-screen">
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    <div
      v-for="f in ficheiros"
      :key="f.id"
      @click.prevent="goToFile(f.id)"
      class="bg-gray-50 space-y-6 break-text rounded-lg shadow-lg border-2 p-4 flex flex-col items-start"
    >
      <!-- Thumbnail -->
      <img
        v-if="f.url.match(/\.(jpg|jpeg|png|webp|jfif)$/i)"
        :src="f.url"
        alt="Thumb Ficheiro"
        class="w-full h-24 object-cover rounded-md mb-2"
      />

<video
  v-else-if="f.url.match(/\.(mp4|avi|webm|vid|m4a)$/i)"
  :src="f.url"
  class="w-full h-24 object-cover rounded-md mb-2"
  controls
  preload="none"
  poster="/video.png"
/>
      
      <img
        v-else
        src="/file.png"
        alt="Thumb Ficheiro"
        class="w-full h-24 object-cover rounded-md mb-2"
      />

      <!-- Nome do ficheiro -->
      <span class="truncate max-w-[200px] text-sm font-semibold mb-1">{{ f.filename }}</span>
      <span class="p-1 rounded-md bg-gray-100">{{ f.ext || ""}}</span>
      <!-- Autor e Data -->
      <div class="flex justify-between w-full text-xs text-gray-500 mb-2">
        <span>Publicado por: {{ f.autor }}</span>
        <span>{{ f.data_upload }}</span>
      </div>

      <!-- Estatísticas -->
      <div class="flex justify-between w-full text-gray-600 text-xs mb-2">
        <div class="flex items-center space-x-1">
          <span class="material-icons text-sm">chat_bubble</span>
          <span>{{ f.comentarios }}</span>
        </div>
        <div class="flex items-center space-x-1">
          <span class="material-icons text-sm">download</span>
          <span>{{ f.downloads }}</span>
        </div>
        <div class="flex items-center space-x-1">
          <span class="material-icons text-sm">share</span>
          <span>{{ f.partilhas }}</span>
        </div>
      </div>
    </div>
  </div>
</main>

<div class="pagination flex justify-center items-center space-x-4 my-8">
  <!-- Botão Anterior -->
  <button
    :disabled="page === 1"
    @click="goToPage(page - 1)"
    class="px-4 py-2 rounded-lg transition 
           bg-gray-200 text-gray-700 
           hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400"
  >
    ← Anterior
  </button>

  <!-- Info da Página -->
  <span class="text-sm font-medium text-gray-600">
    Página <span class="font-semibold">{{ page }}</span> de <span class="font-semibold">{{ Math.ceil(totalItems / perPage) }}</span>
  </span>

  <!-- Botão Próxima -->
  <button
    :disabled="page >= Math.ceil(totalItems / perPage)"
    @click="goToPage(page + 1)"
    class="px-4 py-2 rounded-lg transition 
           bg-gray-200 text-gray-700 
           hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400"
  >
    Próxima →
  </button>
</div>


</template>

<script setup>
import { useRouter, useRoute } from "vue-router"
import { ref, onMounted, watch } from "vue"

const route = useRoute();
const router = useRouter()
const token = ref(localStorage.getItem("token"))
const ficheiros = ref([])
const ficheiros_count = ref(0)
const downloads_count = ref(0)
const partilhas_count = ref(0)
const avatarUrl = ref("avatar.png"); // estado inicial

const loading = ref(false)   // ✅ estado de carregamento
const erro = ref(null)       // opcional: feedback se a API falhar

const perPage = ref(12);
const totalItems = ref(0);

onMounted(async () => {
  if (!token.value) {
    router.push("/entry")
    return
  }
  fetchFicheiros()

})


// página vem da URL, default 1
const page = ref(Number(route.query.page) || 1);

async function fetchFicheiros(p=1){
    loading.value = true
    erro.value = null

  try {
    const res = await fetch(`https://sgnid.pythonanywhere.com/ficheiros?page=${page.value}&per_page=${perPage.value}`, {
      headers: { Authorization: "Bearer " + token.value },
    })

    if (res.ok) {
      
      const data = await res.json()
      ficheiros.value = data.ficheiros || [];
      ficheiros_count.value = data.totais.ficheiros || 0;
      downloads_count.value = data.totais.downloads || 0;
      partilhas_count.value = data.totais.partilhas || 0;
      totalItems.value = data.total_items || 0;
      avatarUrl.value = data.avatarUrl

    } else {
      console.error("Erro ao carregar ficheiros:", res.status)

    }
  } catch (e) {
    console.error("Erro ao buscar ficheiros:", e)

  } finally {
    loading.value = false
  }
}

// Atualiza a página ao clicar nos botões
function goToPage(newPage) {
  page.value = newPage;
  // Atualiza a URL sem recarregar a página
  router.replace({ query: { ...route.query, page: newPage } });
  fetchFicheiros();
}


// Observa mudanças na query para atualizar a lista
watch(() => route.query.page, (qPage) => {
  if (qPage) {
    page.value = Number(qPage);
    fetchFicheiros();
  }
});


const termoBusca = ref("");

async function pesquisar() {
  if (!termoBusca.value) return fetchFicheiros();

  loading.value = true;
  erro.value = null;

  try {
    const res = await fetch(`https://sgnid.pythonanywhere.com/pesquisar?q=${encodeURIComponent(termoBusca.value)}`, {
      headers: { Authorization: "Bearer " + localStorage.getItem("token") }
    });

    if (res.ok) {
      ficheiros.value = await res.json();
    } else {
      erro.value = "Erro na pesquisa";
      ficheiros.value = [];
    }
  } catch (err) {
    erro.value = "Falha de rede na pesquisa";
    ficheiros.value = [];
  } finally {
    loading.value = false;
  }
}



function goToUser() {
  router.push("/userprofile")
}

function goToFile(id) {
  router.push({ name: "file", params: { id } })
}

function goToUpload() {
  router.push("/publish")
}



function logout() {
  token.value = null
  localStorage.removeItem("token")
  router.push("/entry")
}





</script>

<style>
.break-text {
  word-break: break-word; /* quebra palavras longas */
  overflow-wrap: break-word; /* garante compatibilidade */
}
@import url("https://fonts.googleapis.com/icon?family=Material+Icons");
</style>











