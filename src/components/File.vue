<template>
  <div>
    <!-- Cabeçalho -->
    <div class="flex items-center justify-between p-4">
      <span @click.prevent="goHome" class="inline-flex items-baseline space-x-0.5 font-sans font-semibold text-gray-800 text-2xl">
        <span>ar</span>
        <span class="text-3xl font-extrabold text-blue-500 leading-none">Q</span>
        <span>iv</span>
      </span>
    </div>

    <div class="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <!-- Área da mídia -->
      <div class="w-full max-w-2xl rounded-lg overflow-hidden shadow mb-4">


        

  <!-- Imagem -->
<img v-if="file?.url && isImage(file.url)" :src="file.url" alt="Ficheiro" class="w-full h-64 object-cover" />


  <!-- Vídeo/Áudio -->
  <video 
    v-else-if="file?.url && isVideo(file.url)" 
    :src="file.url" 
    class="w-full h-64 object-cover" 
    controls
  />

  <!-- Arquivo genérico -->
  <img 
    v-else 
    src="../../public/file.png" 
    alt="Ficheiro" 
    class="w-full h-64 object-cover" 
  />
</div>

      <!-- Informações do ficheiro -->
      <div class="w-full max-w-2xl bg-white rounded-lg shadow p-4 flex flex-col space-y-4">
        <!-- Autor e data -->
        <div class="flex items-center justify-between text-sm text-gray-500">
          
          <span>Autor: {{ file?.autor || 'Carregando...' }}</span>
          <span>Data: {{ file?.data_upload || 'Carregando...' }}</span>
        </div>

        <!-- Descrição scrollable -->
         <span class="truncate max-w-[200px]">Nome: {{ file?.filename || '' }}</span>
        <div class="max-h-60 overflow-y-auto p-2 border border-gray-200 rounded text-md text-gray-700">
          <p>{{ file?.descricao || 'Sem descricao' }}</p>
        </div>

        <!-- Estatísticas + botões -->
        <div class="flex justify-around items-center space-x-2 mt-2">
          <!-- Comentar -->
          <button @click.prevent="abrirModal = true; carregarComentarios()" class="flex flex-col items-center bg-gray-100 p-2 rounded-lg hover:bg-gray-200 transition w-24">
            <span class="material-icons text-gray-600">chat_bubble</span>
            <span class="text-xs font-medium">{{ file?.comentarios || 0 }} Comentar</span>
          </button>

          <!-- Partilhar -->
          <button @click="partilhar(file.file_id)" class="flex flex-col items-center bg-gray-100 p-2 rounded-lg hover:bg-gray-200 transition w-24">
            <span class="material-icons text-gray-600">share</span>
            <span class="text-xs font-medium">{{ file?.partilhas || 0 }} Partilhar</span>
          </button>

          <!-- Baixar -->
          <a @click.prevent="baixarArquivo(file.file_id)" download class="flex flex-col items-center bg-gray-100 p-2 rounded-lg hover:bg-gray-200 transition w-24">
            <span class="material-icons text-gray-600">download</span>
            <span class="text-xs font-medium">{{ file?.downloads || 0 }} Baixar</span>
          </a>
        </div>
      </div>
    </div>
  </div>




<!-- Modal de Comentários -->
<div v-if="abrirModal" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-20 z-50">
  <div class="bg-white rounded-lg  max-w-[90%] p-4 shadow-lg">
    <div class="flex justify-between items-center mb-2">
      <h2 class="text-lg font-semibold">Comentários</h2>
      <button @click="abrirModal = false" class="text-gray-500 hover:text-gray-700">&times;</button>
    </div>

    <!-- Campo de adicionar comentário -->
    <div class="flex mb-4 space-x-2">
      <input v-model="novoComentario" placeholder="Escreva um comentário..." class="flex-1 border rounded px-2 py-1"/>
      <button @click="enviarComentario" class="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600">Enviar</button>
    </div>

    <!-- Lista de comentários -->
    <div class="max-h-64 overflow-y-auto space-y-2">
      <div v-for="c in comentarios" :key="c.id" class="p-2 border rounded">
        <span class="font-semibold">{{ c.autor }}:</span> {{ c.conteudo }}
        <div class="text-xs text-gray-400">{{ c.data_criacao }}</div>
      </div>
    </div>
  </div>
</div>



</template>










<script setup>
import { ref, watch, onMounted, defineProps } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const route = useRoute();
const router = useRouter();
const id = ref(route.params.id);
const file = ref(null);
const token = ref(localStorage.getItem('token'));

// Função para buscar dados da API
async function fetchDados(novoId) {
  try {
    const res = await fetch(`https://sgnid.pythonanywhere.com/file/${novoId}`, {
      headers: {
        "Authorization": "Bearer " + token.value
      }
    });
    if (!res.ok) {
      router.push("/")
    };
    file.value = await res.json();
    
  } catch (err) {
    console.error(err);
    file.value = null;
  }
}



const props = defineProps({
  id: String
});


// Busca inicial quando o componente monta
onMounted(() => fetchDados(id.value));

// Observa mudanças no id da rota
watch(() => route.params.id, (novoId) => {
  id.value = novoId;
  fetchDados(novoId);
});


// Download file
async function baixarArquivo(fileId) {
  let headers = {};
  
    const token = localStorage.getItem("token");

    headers["Authorization"] = "Bearer " + token;
  

  try {
    const res = await fetch(`https://sgnid.pythonanywhere.com/download/${fileId}`, { headers });
    if (!res.ok) {
      const err = await res.json();
      alert(err.mensagem || "Erro ao baixar arquivo");
      return;
    }

    const blob = await res.blob();
    file.value.downloads++;
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.value.filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (e) {
    console.error(e);
    alert("Erro ao conectar com o servidor.");
  }
}


//Partilhar

// Função de partilha
async function partilhar(fileId) {
  if (!file.value) return;
  let headers = {};

    const token = localStorage.getItem("token");

    headers["Authorization"] = "Bearer " + token;
  

   try {
    const res = await fetch(`https://sgnid.pythonanywhere.com/partilhar/${fileId}`, { headers });
    if (!res.ok) {
      const err = await res.json();
      alert(err.mensagem || "Erro ao partilhar arquivo");
      return;
    }

  // Incrementa localmente a contagem de partilhas
  file.value.partilhas++;

  // Monta o link completo da página do arquivo

  const url = `${window.location.origin}/file/${file.value.file_id}`;

  // Copia para a área de transferência
  await navigator.clipboard.writeText(url)
  alert("Link copiado");
   }catch(err) {
      console.error("Erro ao copiar o link:", err);
      alert("Não foi possível copiar o link.");
    };



  
}




const abrirModal = ref(false);
const comentarios = ref([]);
const novoComentario = ref("");

async function carregarComentarios() {
  try {
    const res = await fetch(`https://sgnid.pythonanywhere.com/comments/${id.value}`, {
      headers: { "Authorization": "Bearer " + token.value }
    });
    comentarios.value = (await res.json()).reverse();
  } catch (err) {
    console.error("Erro ao carregar comentários:", err);
  }
}

async function enviarComentario() {
  if (!novoComentario.value.trim()) return;

  try {
    const res = await fetch(`https://sgnid.pythonanywhere.com/comments/${id.value}`, {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + token.value,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ conteudo: novoComentario.value })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      alert(err.mensagem || "Erro ao enviar comentário");
      return;
    }

    const data = await res.json(); // { comment: { ... }, comentarios_count: N }
    const comentarioNovo = data.comment;

    // adiciona no topo (Facebook-style)
    comentarios.value.unshift(comentarioNovo);

    // atualiza contador no objecto file (se existir)
    if (file.value) {
      file.value.comentarios += 1;
    }

    novoComentario.value = "";
  } catch (err) {
    console.error("Erro ao enviar comentário:", err);
    alert("Erro ao conectar com o servidor.");
  }
}





//Helpers
const isImage = (url) => /\.(jpg|jpeg|png|gif|webp|jfif)$/i.test(url)
const isVideo = (url) => /\.(mp4|m4a|webm|avi)$/i.test(url)



  const goHome = () => {
    router.push('/home'); // Rota definida no Vue Router
  }
</script>

<style>
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');
</style>
