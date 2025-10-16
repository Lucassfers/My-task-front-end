import { useEffect, useState } from "react"
import { useAdminStore } from "./context/AdminContext"
import ItemAdmin from "./components/ItemAdmin"
import type { AdminType } from "../utils/AdminType"
import { toast } from "sonner"

const apiUrl = import.meta.env.VITE_API_URL

export default function AdminCadAdmin() {
  const [admins, setAdmins] = useState<AdminType[]>([])
  const [mostrarForm, setMostrarForm] = useState(false)
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const { admin } = useAdminStore()

  useEffect(() => {
    
    async function getAdmins() {
      const response = await fetch(`${apiUrl}/admin`)
      const dados = await response.json()
      setAdmins(dados)
    }
    getAdmins()
  }, [])

  async function incluirAdmin(e: React.FormEvent) {
    e.preventDefault()
   

    try {
      console.log("Enviando requisição para:", `${apiUrl}/admin`)
      console.log("Body:", JSON.stringify({ nome, email, senha }))
      
      const response = await fetch(`${apiUrl}/admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${admin.token}`
        },
        body: JSON.stringify({
          nome: nome,
          email: email,
          senha: senha
        })
      })

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        const textoResposta = await response.text()
        console.error("Resposta não é JSON:", textoResposta)
        toast.error("Erro: O servidor retornou HTML em vez de JSON. Verifique se a rota está correta.")
        return
      }

      if (response.status === 201 || response.status === 200) {
        const novoAdmin = await response.json()
        console.log("Admin criado:", novoAdmin)
        setAdmins([...admins, novoAdmin])
        setNome("")
        setEmail("")
        setSenha("")
        setMostrarForm(false)
        toast.success("Admin cadastrado com sucesso!")
      } else {
        const erro = await response.json()
        console.error("Erro do servidor:", erro)
        toast.error(erro.error || erro.message || "Não foi possível cadastrar o admin")
      }
    } catch (error) {
      console.error("Erro na requisição:", error)
      toast.error("Erro ao cadastrar admin. Verifique se a API está rodando.")
    }
  }

  const listaAdmins = admins.map(admin => (
    <ItemAdmin key={admin.id} adminLinha={admin} admins={admins} setAdmins={setAdmins} />
  ))

  return (
    <div className='m-4 mt-24'>
      <div className='flex justify-between'>
        <h1 className="mb-4 text-2xl font-bold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-4xl dark:text-white">
          Cadastro de Administradores do Sistema
        </h1>
        <button 
          onClick={() => setMostrarForm(!mostrarForm)}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-bold rounded-lg text-md px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
          {mostrarForm ? "Cancelar" : "Novo Admin"}
        </button>
      </div>

      {mostrarForm && (
        <div className="mb-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
            Cadastrar Novo Administrador
          </h2>
          <form onSubmit={incluirAdmin} className="space-y-4">
            <div>
              <label htmlFor="nome" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Nome Completo
              </label>
              <input
                type="text"
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="Digite o nome completo"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                E-mail
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="admin@exemplo.com"
                required
              />
            </div>

            <div>
              <label htmlFor="senha" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Senha
              </label>
              <input
                type="password"
                id="senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800"
              >
                Cadastrar
              </button>
              <button
                type="button"
                onClick={() => {
                  setMostrarForm(false)
                  setNome("")
                  setEmail("")
                  setSenha("")
                }}
                className="text-gray-700 bg-gray-200 hover:bg-gray-300 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-600 dark:hover:bg-gray-700 dark:text-white focus:outline-none dark:focus:ring-gray-800"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Nome do Admin
              </th>
              <th scope="col" className="px-6 py-3">
                E-mail
              </th>
              <th scope="col" className="px-6 py-3">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {listaAdmins}
          </tbody>
        </table>
      </div>
    </div>
  )
}