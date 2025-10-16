import './AdminDashBoard.css'
import { useEffect, useState } from "react";
import { VictoryPie, VictoryLabel, VictoryTheme } from "victory";
const apiUrl = import.meta.env.VITE_API_URL

type graficoBoardsUsuarioType = {
  nome: string
  boards: number
}

type graficoUsuarioComentarioType = {
  nome: string
  comentarios: number
}

type graficoBoardsMotivoType = {
  motivo: string
  num: number
}

type geralDadosType = {
  totalBoards: number
  totalListas: number
  totalTasks: number
  totalComentarios: number
  totalUsuarios: number
}

export default function AdminDashboard() {
  const [boardUsuario, setBoardUsuario] = useState<graficoBoardsUsuarioType[]>([])
  const [comentarioUsuario, setComentarioUsuario] = useState<graficoUsuarioComentarioType[]>([])
  const [boardMotivo, setBoardMotivo] = useState<graficoBoardsMotivoType[]>([])
  const [dados, setDados] = useState<geralDadosType>({} as geralDadosType)

  useEffect(() => {
    async function getDadosGerais() {
      const response = await fetch(`${apiUrl}/dashboard/gerais`)
      const dados = await response.json()
      setDados(dados)
    }
    getDadosGerais()

    async function getDadosBoardsUsuario() {
      const response = await fetch(`${apiUrl}/dashboard/boardsUsuario`)
      const dados = await response.json()
      setBoardUsuario(dados)
    }
    getDadosBoardsUsuario()

    async function getDadosBoardMotivo() {
      const response = await fetch(`${apiUrl}/dashboard/boardsMotivo`)
      const dados = await response.json()
      setBoardMotivo(dados)
    }
    getDadosBoardMotivo()

    async function getDadosComentarioUsuario() {
      const response = await fetch(`${apiUrl}/dashboard/comentariosUsuario`)
      const dados = await response.json()
      setComentarioUsuario(dados)
    }
    getDadosComentarioUsuario()


  }, [])


  const listaBoardMotivo = boardMotivo.map(item => (
    { x: item.motivo, y: item.num }
  ))

  const listaBoardUsuario = boardUsuario.map(item => (
    { x: item.nome, y: item.boards}
  ))

  const listaComentarioUsuario = comentarioUsuario.map(item => (
    { x: item.nome, y: item.comentarios}
  ))

  return (
    <div className="container mt-12">
      <h2 className="text-3xl mb-4 font-bold pl-12 pb-15">Visão Geral do Sistema</h2>

      <div className="w-2/3 flex justify-between mx-auto mb-5">
        <div className="border-blue-600 border rounded p-6 w-1/3 me-3">
          <span className="bg-blue-500 text-black text-xl text-center font-bold mx-auto block px-2.5 py-5 rounded">
            {dados.totalUsuarios}</span>
          <p className="font-bold mt-2 text-center">Nº Usuarios </p>
        </div>
        <div className="border-amber-500 border rounded p-6 w-1/3 me-3">
          <span className="bg-amber-500 text-black text-xl text-center font-bold mx-auto block px-2.5 py-5 rounded">
            {dados.totalBoards}</span>
          <p className="font-bold mt-2 text-center">Nº Boards</p>
        </div>
        <div className="border-amber-600 border rounded p-6 w-1/3 me-3">
          <span className="bg-amber-500 text-black text-xl text-center font-bold mx-auto block px-2.5 py-5 rounded">
            {dados.totalListas}</span>
          <p className="font-bold mt-2 text-center">Nº Listas</p>
        </div>
        <div className="border-amber-600 border rounded p-6 w-1/3 me-3">
          <span className="bg-amber-500 text-black text-xl text-center font-bold mx-auto block px-2.5 py-5 rounded">
            {dados.totalTasks}</span>
          <p className="font-bold mt-2 text-center">Nº Tarefas</p>
        </div>
        <div className="border-amber-600 border rounded p-6 w-1/3 me-3">
          <span className="bg-amber-500 text-black text-xl text-center font-bold mx-auto block px-2.5 py-5 rounded">
            {dados.totalComentarios}</span>
          <p className="font-bold mt-2 text-center">Nº Comentários</p>
        </div>
        
      </div>

      <div className="div-graficos">
        <svg viewBox="30 55 400 400">
          <VictoryPie
            standalone={false}
            width={400}
            height={400}
            data={listaBoardMotivo}
            innerRadius={50}
            labelRadius={80}
            theme={VictoryTheme.clean}
            labels={({ datum }: any) => `${datum.y} ${datum.x}`}
            style={{
              labels: {
                fontSize: 8,
                fill: "#000",
                fontFamily: "Arial",
                fontWeight: "bold"
              }
            }}
          />
          <VictoryLabel
            textAnchor="middle"
            style={{
              fontSize: 12,
              fill: "#000000",
              fontFamily: "Arial",
              fontWeight: "bold"
            }}
            x={200}
            y={200}
            text={["Boards", "por Motivo"]}
          />
        </svg>
      
        <svg viewBox="30 55 400 400">
          <VictoryPie
            standalone={false}
            width={400}
            height={400}
            data={listaComentarioUsuario}
            innerRadius={60}
            labelRadius={70}
            theme={VictoryTheme.clean}
            labels={({ datum }: any) => `${datum.y} ${datum.x}`}
            style={{
              labels: {
                fontSize: 8,
                fill: "#000000",
                fontFamily: "Arial",
                fontWeight: "bold"
              }
            }}
          />
          <VictoryLabel
            textAnchor="middle"
            style={{
              fontSize: 12,
              fill: "#000000",
              fontFamily: "Arial",
              fontWeight: "bold"
            }}
            x={200}
            y={200}
            text={["Comentários", "por Usuário"]}
          />
        </svg>

        <svg viewBox="30 55 400 400">
          <VictoryPie
            standalone={false}
            width={400}
            height={400}
            data={listaBoardUsuario}
            innerRadius={50}
            labelRadius={70}
            theme={VictoryTheme.clean}
            labels={({ datum }: any) => `${datum.y} ${datum.x}`}
            style={{
              labels: {
                fontSize: 8,
                fill: "#000000",
                fontFamily: "Arial",
                fontWeight: "bold"
              }
            }}
          />
          <VictoryLabel
            textAnchor="middle"
            style={{
              fontSize: 12,
              fill: "#000000",
              fontFamily: "Arial",
              fontWeight: "bold"
            }}
            x={200}
            y={200}
            text={["Boards", "por Usuario"]}
          />
        </svg>

      </div>
    </div>
  )
}
