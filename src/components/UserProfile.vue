<template>
    <div class="flex items-center shadow-lg justify-between p-4">
      <span @click.prevent="goHome" class="inline-flex items-baseline space-x-0.5 font-sans font-semibold text-gray-800 text-2xl">
        <span>ar</span>
        <span class="text-3xl font-extrabold text-blue-500 leading-none">Q</span>
        <span>iv</span>
      </span>

    </div>

  <div class="p-4 space-y-6">
    <!-- Seção de edição de perfil -->
    <div class="bg-white rounded-lg shadow p-6 space-y-4">
      <h2 class="text-lg font-semibold text-gray-800 mb-4">Perfil</h2>

      <!-- Foto de perfil -->
      <div class="flex items-center space-x-4">
    <div class="relative">
      <img
        :src="avatarUrl"
        alt="Avatar"
        class="w-20 h-20 rounded-full border border-gray-300 object-cover"
      />

      <!-- Loader sobre a imagem -->
      <div
        v-if="loading"
        class="absolute inset-0 bg-white/50 flex items-center justify-center rounded-full"
      >
        <span class="animate-spin inline-block border-4 border-blue-500 border-t-transparent rounded-full w-6 h-6"></span>
      </div>
    </div>
        <button
          @click.prevent="abrirExplorador"
          class="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition text-sm"
        >
          Alterar Foto
        </button>
      <!-- Input file oculto -->
      <input
        ref="inputFile"
        type="file"
        accept="image/*"
        class="hidden"
        @change="selecionarFoto"
      />        
      </div>

      <!-- Nome -->
      <div>
        <label class="block text-sm text-gray-600 mb-1">Nome</label>
        <input
          disabled
          v-model="nome"
          type="text"
          class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Seu nome"
        />
      </div>

      <!-- Número -->
      <div>
        <label class="block text-sm text-gray-600 mb-1">Número</label>
        <input
          disabled
          v-model="numero"
          type="text"
          class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Seu número"
        />
      </div>

    </div>

    <!-- Lista de ficheiros do usuário -->
    <div>
      <h2 class="text-lg font-semibold text-gray-800 mb-4">Meus Ficheiros</h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <!-- Card de ficheiro -->
        <div
          v-for="f in ficheiros"
          :key="f.id"
          @click.prevent="goToFile(f.id)"
          class="bg-gray-50 break-text space-y-6 rounded-lg shadow-lg border-2 p-4 flex flex-col items-start"
        >
          <!-- Thumbnail -->
          <img
            v-if="f.url.endsWith('.jpg') || f.url.endsWith('.png') || f.url.endsWith('.jpeg') || f.url.endsWith('.webm') || f.url.endsWith('.jfif')" 
         :src="f.url"
            alt="Thumb Ficheiro"
            class="w-full h-24 object-cover rounded-md mb-2"
          />


          <img
            v-else-if="f.url.endsWith('.pdf') || f.url.endsWith('.docx') || f.url.endsWith('.ppx') || f.url.endsWith('.txt') || f.url.endsWith('.html')" 
         src="../../public/file.png"
            alt="Thumb Ficheiro"
            class="w-full h-24 object-cover rounded-md mb-2"
          />

          <img
            v-else src="../../public/file.png"
            alt="Thumb Ficheiro"
            class="w-full h-24 object-cover rounded-md mb-2"
          />

          <!-- Nome do ficheiro -->
          <span class="text-sm font-semibold mb-1">{{ f.filename }}</span>
          <div class="flex items-center space-x-1 text-gray-600 text-sm">
          <span class="material-icons">
              {{ f?.publico ? 'lock_open' : 'lock' }}
            </span>
            <span>{{ f?.publico ? 'Público' : 'Privado' }}</span>
        </div>
          <!-- Autor e Data -->
          <div class="flex justify-between w-full text-xs text-gray-500 mb-2">
            <span> {{ f.autor }}</span>
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
              <span> {{ f.downloads }} </span>
            </div>
            <div class="flex items-center space-x-1">
              <span class="material-icons text-sm">share</span>
              <span> {{ f.partilhas }} </span>
            </div>
          </div>

          <!-- Botões -->
          <div class="flex space-x-2 mt-2">
            <button
              @click.stop="apagarFicheiro(f.id)"
              class="px-3 py-1 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600 transition"
            >
              Eliminar
            </button>
            <button
              v-if="f?.publico"
              class="px-3 py-1 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600 transition"
            >
              Partilhar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
const userData = ref({})
const nome = ref("")
const numero = ref("")
const ficheiros = ref([])
const token = localStorage.getItem("token");


const avatarUrl = ref("../../public/avatar.png"); // estado inicial
const inputFile = ref(null);
const loading = ref(false); // estado de upload

onMounted(async () => {
  userData.value = await buscarPerfil()
  
  try {
    const res = await fetch("https://sgnid.pythonanywhere.com//meus_ficheiros",
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    ficheiros.value = await res.json()
  } catch (e) {
    console.error("Erro ao buscar ficheiros:", e)
  }
})

const buscarPerfil = async () => {
  
  const resposta = await fetch("https://sgnid.pythonanywhere.com//profile", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  const dados = await resposta.json()
  nome.value = dados.nome
  numero.value = dados.numero
  avatarUrl.value = dados.avatarUrl
}


const apagarFicheiro = async (file_id) => {


  const confirma = confirm("Deseja realmente apagar este ficheiro?")
  if (!confirma) return


  try {
    const resposta = await fetch(`https://sgnid.pythonanywhere.com//ficheiros/${file_id}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token
      }})

    ficheiros.value = ficheiros.value.filter(f => f.id !== file_id);
  } catch (erro) {
    console.error("Erro ao apagar:", erro)
    alert("Erro ao apagar ficheiro"+erro)
  }
}

const router = useRouter()

  const goHome = () => {
    router.push('/home'); // Rota definida no Vue Router
  }

  function goToFile(id) {
  router.push({ name: "file", params: { id } })
}









// Abrir explorador de arquivos ao clicar no botão
function abrirExplorador() {
  inputFile.value.click();
}

// Função chamada ao selecionar a foto
async function selecionarFoto(event) {
  
  const file = event.target.files[0];
  if (!file) return;

  loading.value = true;

  const formData = new FormData();
  formData.append("avatar", file);

  try {
    // Substitua pela sua API de upload
    const res = await fetch("https://sgnid.pythonanywhere.com//upload/avatar", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: formData,
    });

    if (!res.ok) throw new Error("Falha no upload");

    const data = await res.json();

    // Atualiza o preview com a nova foto
    avatarUrl.value = data.url;
  } catch (err) {
    console.error(err);
    alert("Não foi possível atualizar a foto");
  } finally {
    loading.value = false;
  }
}
</script>







<style>
.break-text {
  word-break: break-word; /* quebra palavras longas */
  overflow-wrap: break-word; /* garante compatibilidade */
}
@import url("https://fonts.googleapis.com/icon?family=Material+Icons");
</style>
