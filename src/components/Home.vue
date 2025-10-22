<template>
  <!-- Header fixo -->
  <div class="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-blue-600 to-blue-500 shadow-lg text-white">
    <div class="flex items-center justify-between p-4">
      <span class="inline-flex items-baseline space-x-0.5 font-sans font-semibold text-2xl select-none">
        <span>ar</span>
        <span class="text-3xl font-extrabold text-yellow-300 leading-none">Q</span>
        <span>iv</span>
      </span>
      <div class="flex items-center space-x-4">
        <a href="#" @click.prevent="goToUser">
          <img
            :src="avatarUrl"
            @error="e => e.target.src = '/avatar.png'"
            alt="Avatar"
            class="w-10 h-10 rounded-full border-2 border-white hover:scale-105 transition-transform duration-200"
          />
        </a>
        <button
          @click.prevent="logout"
          class="bg-white/20 border border-white/30 text-white px-4 py-2 rounded-lg hover:bg-white hover:text-blue-600 transition"
        >
          Sair
        </button>
      </div>
    </div>
  </div>

  <!-- Estatísticas -->
  <div class="mt-[72px]">
    <div class="flex justify-around items-center py-2 px-4 text-sm sm:text-base bg-gradient-to-r from-blue-100 via-blue-50 to-indigo-100 text-gray-800 shadow-inner backdrop-blur-md">
      <div class="flex items-center space-x-1">
        <span class="material-icons text-blue-600">folder</span>
        <span class="font-medium">{{ totalItems }}</span>
        <span class="hidden sm:inline"> Ficheiros</span>
      </div>
      <div class="flex items-center space-x-1">
        <span class="material-icons text-green-600">download</span>
        <span class="font-medium">{{downloads_count}}</span>
        <span class="hidden sm:inline"> Downloads</span>
      </div>
      <div class="flex items-center space-x-1">
        <span class="material-icons text-purple-600">share</span>
        <span class="font-medium">{{partilhas_count}}</span>
        <span class="hidden sm:inline"> Partilhas</span>
      </div>
    </div>

    <!-- Pesquisa e Filtros -->
    <div class="flex flex-col sm:flex-row items-center justify-between bg-white/70 backdrop-blur-md p-4 space-y-3 sm:space-y-0 sm:space-x-4 shadow-md border-b border-gray-200 w-full">
      <div class="flex w-full sm:flex-1">
        <input
          type="text"
          placeholder="Pesquisar ficheiros..."
          v-model="termoBusca"
          class="w-[70%] border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/80 placeholder-gray-500"
        />
        <button
          @click.prevent="pesquisar"
          class="w-[30%] bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 transition text-center font-medium"
        >
          Pesquisar
        </button>
      </div>

      <button
        @click.prevent="goToUpload"
        class="w-full sm:w-[30%] bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
      >
        <span class="material-icons text-base">upload</span>
        <span>Enviar ficheiro</span>
      </button>
    </div>
  </div>

  <!-- Feedback de carregamento -->
  <div v-if="loading" class="text-center py-6 text-gray-500 bg-gray-100">
    <span class="animate-spin inline-block border-4 border-blue-500 border-t-transparent rounded-full w-6 h-6"></span>
    <p>Carregando ficheiros...</p>
  </div>

  <!-- Conteúdo scrollable -->
  <main v-else class="pt-[10px] sm:pt-[10px] px-4 pb-4 bg-gradient-to-br from-blue-50 via-gray-50 to-blue-100 min-h-screen">
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div
        v-for="f in ficheiros"
        :key="f.id"
        @click.prevent="goToFile(f.id)"
        class="bg-white/70 backdrop-blur-md rounded-xl shadow-md hover:shadow-xl border border-gray-200 p-4 flex flex-col space-y-3 transition-transform hover:-translate-y-1"
      >
        <div class="relative">
          <img
            v-if="f.url.match(/\.(jpg|jpeg|png|webp|jfif)$/i)"
            :src="f.url"
            alt="Thumb Ficheiro"
            class="w-full h-30 object-cover rounded-md mb-2"
          />
          <video
            v-else-if="f.url.match(/\.(mp3|m4a)$/i)"
            :src="f.url"
            class="w-full h-30 object-cover rounded-md mb-2"
            controls
            preload="none"
            poster="/musica.jpg"
            playsinline
          ></video>
          <video
            v-else-if="f.url.match(/\.(mp4|avi|webm|vid|m4v)$/i)"
            :src="f.url"
            class="w-full h-30 object-cover rounded-md mb-2"
            controls
            preload="none"
            poster="/video.png"
          ></video>
          <img
            v-else
            src="/file.png"
            alt="Thumb Ficheiro"
            class="w-full h-30 object-cover rounded-md mb-2"
          />
        </div>

        <span class="truncate max-w-[200px] text-sm font-semibold mb-1 text-gray-800">{{ f.filename }}</span>
        <span class="px-2 py-1 rounded-md bg-blue-50 text-blue-600 text-xs font-medium">{{ f.ext || ""}}</span>

        <div class="flex justify-between w-full text-xs text-gray-500 mb-2">
          <span>Publicado por: {{ f.autor }}</span>
          <span>{{ f.data_upload }}</span>
        </div>

        <div class="flex justify-between w-full text-gray-600 text-xs">
          <div class="flex items-center space-x-1">
            <span class="material-icons text-sm text-blue-500">chat_bubble</span>
            <span>{{ f.comentarios }}</span>
          </div>
          <div class="flex items-center space-x-1">
            <span class="material-icons text-sm text-green-500">download</span>
            <span>{{ f.downloads }}</span>
          </div>
          <div class="flex items-center space-x-1">
            <span class="material-icons text-sm text-purple-500">share</span>
            <span>{{ f.partilhas }}</span>
          </div>
        </div>
      </div>
    </div>
  </main>

  <!-- Paginação -->
  <div class="pagination flex justify-center items-center space-x-4 my-8">
    <button
      :disabled="page === 1"
      @click="goToPage(page - 1)"
      class="px-4 py-2 rounded-lg transition bg-white/60 border border-gray-300 text-gray-700 hover:bg-blue-100 disabled:opacity-50"
    >
      ← Anterior
    </button>
    <span class="text-sm font-medium text-gray-700">Página <span class="font-semibold">{{ page }}</span> de <span class="font-semibold">{{ totalPages }}</span></span>
    <button
      :disabled="page >= totalPages"
      @click="goToPage(page + 1)"
      class="px-4 py-2 rounded-lg transition bg-white/60 border border-gray-300 text-gray-700 hover:bg-blue-100 disabled:opacity-50"
    >
      Próxima →
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();
const token = ref(localStorage.getItem("token"));
const ficheiros = ref([]);
const downloads_count = ref(0);
const partilhas_count = ref(0);
const avatarUrl = ref("/avatar.png");
const loading = ref(false);
const erro = ref(null);

const perPage = ref(12);
const totalItems = ref(0);
const page = ref(Number(route.query.page) || 1);
const termoBusca = ref("");

const totalPages = computed(() => Math.ceil(totalItems.value / perPage.value));

async function fetchFicheiros() {
  loading.value = true;
  erro.value = null;
  try {
    const res = await fetch(`https://sgnid.pythonanywhere.com/ficheiros?page=${page.value}&per_page=${perPage.value}`, {
      headers: { Authorization: "Bearer " + token.value },
    });
    if (!res.ok) throw new Error(res.status);
    const data = await res.json();
    ficheiros.value = data.ficheiros || [];
    totalItems.value = data.total_items || 0;
    downloads_count.value = data.totais.downloads || 0;
    partilhas_count.value = data.totais.partilhas || 0;
    avatarUrl.value = data.avatarUrl || "/avatar.png";
  } catch (e) {
    erro.value = "Erro ao carregar ficheiros";
    ficheiros.value = [];
  } finally {
    loading.value = false;
  }
}

function goToPage(newPage) {
  router.push({ query: { ...route.query, page: newPage } });
}

watch(() => route.query.page, (qPage) => {
  const newPage = Number(qPage) || 1;
  if (newPage !== page.value) {
    page.value = newPage;
    fetchFicheiros();
  }
});

onMounted(() => {
  if (!token.value) router.push("/landing");
  fetchFicheiros();
});

async function pesquisar() {
  if (!termoBusca.value) return fetchFicheiros();
  loading.value = true;
  erro.value = null;
  try {
    const res = await fetch(`https://sgnid.pythonanywhere.com/pesquisar?q=${encodeURIComponent(termoBusca.value)}`, {
      headers: { Authorization: "Bearer " + token.value }
    });
    ficheiros.value = res.ok ? await res.json() : [];
    if (!res.ok) erro.value = "Erro na pesquisa";
  } catch {
    erro.value = "Falha de rede na pesquisa";
    ficheiros.value = [];
  } finally {
    loading.value = false;
  }
}

function goToUser() { router.push("/userprofile"); }
function goToFile(id) { router.push({ name: "file", params: { id } }); }
function goToUpload() { router.push("/publish"); }
function logout() {
  token.value = null;
  localStorage.removeItem("token");
  router.push("/landing");
}
</script>

<style>
.break-text { word-break: break-word; overflow-wrap: break-word; }
@import url("https://fonts.googleapis.com/icon?family=Material+Icons");
</style>
