import type { BoardType } from "./utils/BoardType"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { CardBoard } from "./components/CardBoard"
import NewBoard from "./components/NewBoard"
import { useUsuarioStore } from "./context/UsuarioContext"

const apiUrl = import.meta.env.VITE_API_URL

type AppProps = {
  termoPesquisa?: string
}

export default function App({ termoPesquisa }: AppProps) {
  const [boards, setBoards] = useState<BoardType[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { usuario } = useUsuarioStore()

  useEffect(() => {

  async function buscaBoards() {
    try {
      const raw = localStorage.getItem('usuarioKey'); 
      let parsed = null;
      try {
        parsed = raw ? JSON.parse(raw) : null;
      } catch (error) {
        localStorage.removeItem('usuarioKey');
      }
      const token: string | null = parsed?.token ?? null;

      if (!token) {
        setBoards([]);
        setLoading(false);
        return;
      }

      const response = await fetch(`${apiUrl}/boards`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        if (response.status === 401) {
          setBoards([]);
          setLoading(false);
          return;
        }
        const err = await response.json().catch(() => ({}));
        throw new Error(err?.erro || `HTTP ${response.status}`);
      }

      const dados = await response.json();
      setBoards(Array.isArray(dados) ? dados : []);
    } catch (e) {
      console.error('Falha ao buscar boards:', e);
      setBoards([]);
    } finally {
      setLoading(false);
    }
  }
  buscaBoards();
}, []);

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
    <div className="min-h-screen bg-[#F5F7FA] rounded-lg w-[80vw] mx-auto mt-[1rem]">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {listaBoards}
          <NewBoard onClick={criarBoard} />
        </div>
      </div>
    </div>
  )
}
