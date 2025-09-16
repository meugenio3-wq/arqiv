<script setup>
import { onMounted } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()

onMounted(async () => {
  const token = localStorage.getItem("token")

  if (!token) {
    return router.replace("/entry") // replace evita histórico duplicado
  }

  try {
    const resposta = await fetch("https://sgnid.pythonanywhere.com/verificar", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    })

    if (!resposta.ok) {
      throw new Error("Token inválido ou expirado")
    }

    const dados = await resposta.json()

    if (dados.valido) {
      router.replace("/home")
    } else {
      localStorage.removeItem("token")
      router.replace("/entry")
    }
  } catch (e) {
    console.error("Erro ao verificar token:", e.message)
    localStorage.removeItem("token")
    router.replace("/entry")
  }
})
</script>
