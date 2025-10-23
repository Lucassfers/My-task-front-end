import type { BoardType } from "./utils/BoardType"
import { useEffect, useState } from "react"
import { CardBoard } from "./components/CardBoard"
import NewBoard from "./components/NewBoard"

const apiUrl = import.meta.env.VITE_API_URL

type AppProps = {
  termoPesquisa?: string
}

export default function App({ termoPesquisa }: AppProps) {
  const [boards, setBoards] = useState<BoardType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function buscaBoardsPessoais() {
      try{
        const dados = localStorage.getItem("usuarioKey") || sessionStorage.getItem("usuarioKey")
        const usuario = dados ? JSON.parse(dados) as { token?: string } : null
        const token = usuario?.token ?? ""

        const response = await fetch(`${apiUrl}/boards`, {
          headers: token ? { Authorization: `Bearer ${token}`} : {},
        })

        if (!response.ok) throw new Error(`HTTP ${response.status}`)

          const dados2 = await response.json()

          setBoards(Array.isArray(dados2) ? dados2 : [])
      } catch (error) {
        console.error("Erro ao buscar boards:", error)
        setBoards([])
      } finally {
        setLoading(false)
      }
    }
    buscaBoardsPessoais()
  }, [])

  const boardsFiltrados = termoPesquisa && termoPesquisa.trim().length > 0
    ? boards.filter(board => 
        board.titulo.toLowerCase().includes(termoPesquisa.toLowerCase()) ||
        board.motivo.toLowerCase().includes(termoPesquisa.toLowerCase())
      )
    : boards

  const listaBoards = boardsFiltrados.map((board) => 
  <CardBoard data={board} key={board.id} />
)

  const criarBoard = () => {
    console.log("Criando novo board...")
  }

  if (loading) return <div>Carregando...</div>

  return (
    <div className="min-h-screen bg-[#0E1014] bg-opacity-80 w-[80vw] mx-auto ">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {listaBoards}
          <NewBoard onClick={criarBoard} />
        </div>
      </div>
    </div>
  )
}
