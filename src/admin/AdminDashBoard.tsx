import './AdminDashboard.css'
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
  boards: number
  listas: number
  tasks: number
  comentarios: number
  usuarios: number
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
    <div className="container mt-24">
      <h2 className="text-3xl mb-4 font-bold">Visão Geral do Sistema</h2>

      <div className="w-2/3 flex justify-between mx-auto mb-5">
        <div className="border-blue-600 border rounded p-6 w-1/3 me-3">
          <span className="bg-blue-100 text-blue-800 text-xl text-center font-bold mx-auto block px-2.5 py-5 rounded dark:bg-blue-900 dark:text-blue-300">
            {dados.boards}</span>
          <p className="font-bold mt-2 text-center">Nº Boards por Motivo</p>
        </div>
        <div className="border-red-600 border rounded p-6 w-1/3 me-3">
          <span className="bg-red-100 text-red-800 text-xl text-center font-bold mx-auto block px-2.5 py-5 rounded dark:bg-red-900 dark:text-red-300">
            {dados.comentarios}</span>
          <p className="font-bold mt-2 text-center">Nº Boards</p>
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
            style={{
              labels: {
                fontSize: 10,
                fill: "#f0f0",
                fontFamily: "Arial",
                fontWeight: "bold"
              }
            }}
          />
          <VictoryLabel
            textAnchor="middle"
            style={{
              fontSize: 12,
              fill: "#f00",
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
            innerRadius={50}
            labelRadius={80}
            theme={VictoryTheme.clean}
            style={{
              labels: {
                fontSize: 10,
                fill: "#f0f0",
                fontFamily: "Arial",
                fontWeight: "bold"
              }
            }}
          />
          <VictoryLabel
            textAnchor="middle"
            style={{
              fontSize: 12,
              fill: "#f00",
              fontFamily: "Arial",
              fontWeight: "bold"
            }}
            x={200}
            y={200}
            text={["Comentários", "por Marca"]}
          />
        </svg>

        <svg viewBox="30 55 400 400">
          <VictoryPie
            standalone={false}
            width={400}
            height={400}
            data={listaBoardUsuario}
            innerRadius={50}
            labelRadius={80}
            theme={VictoryTheme.clean}
            style={{
              labels: {
                fontSize: 10,
                fill: "#fff",
                fontFamily: "Arial",
                fontWeight: "bold"
              }
            }}
          />
          <VictoryLabel
            textAnchor="middle"
            style={{
              fontSize: 12,
              fill: "#f00",
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