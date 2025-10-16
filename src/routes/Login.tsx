import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { useUsuarioStore } from "../context/UsuarioContext"

type Inputs = {
  email: string
  senha: string
  manter: boolean
}

const apiUrl = import.meta.env.VITE_API_URL

export default function Login() {
  const { register, handleSubmit } = useForm<Inputs>()
  const { logaUsuario } = useUsuarioStore()
  const navigate = useNavigate()


  async function verificaLogin(data: Inputs) {
    const response = await fetch(`${apiUrl}/login`, {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({ email: data.email, senha: data.senha }),
    })

        if (response.status == 200) {
            const dados = await response.json()

            // "coloca" os dados do usuário no contexto
            logaUsuario(dados)
            
            // Implementação do "Manter Conectado"
            if (data.manter) {
                // Marcou "Manter Conectado" → salva no localStorage (persiste)
                localStorage.setItem("usuarioKey", JSON.stringify(dados))
                sessionStorage.removeItem("usuarioKey") // Remove do session se existir
            } else {
                // NÃO marcou → salva no sessionStorage (expira ao fechar navegador)
                sessionStorage.setItem("usuarioKey", JSON.stringify(dados))
                localStorage.removeItem("usuarioKey") // Remove do local se existir
            }

            navigate("/")
        } else {
            toast.error("Erro... Login ou senha incorretos")
        }
   }

  return (
    <div className="relative flex items-center justify-center min-h-screen">
      <div className="finisher-header absolute inset-0 w-full h-full" />
      <div className="relative w-full max-w-sm p-6 bg-white rounded-2xl shadow-lg py-14 transition-colors z-10">
        <h1 className="text-2xl font-bold text-left mb-6">Dados de Acesso</h1>
        <form onSubmit={handleSubmit(verificaLogin)} className="space-y-4">
          <input
            type="email"
            placeholder="E-mail"
            id="email"
            className="w-full p-2 border-b-2 border-blue-500 focus:outline-none"
            required
            {...register("email")}
          />
          <input
            type="password"
            placeholder="Senha"
            id="password"
            className="w-full p-2 border-b-2 border-blue-500 focus:outline-none"
            required
            {...register("senha")}
          />
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                type="checkbox"
                id="remember"
                aria-describedby="remember"
                className="w-4 h-4 border rounded bg-gray-50"
                {...register("manter")}
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="remember" className="text-gray-500">Manter Conectado</label>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded transition-colors hover:bg-blue-700 tracking-widest my-7"
          >
            ENTRAR
          </button>
        </form>
        <button
          type="button"
          onClick={() => navigate("/cadastro")}
          className="flex justify-center text-gray-500 mb-7 transition-all hover:text-lg bg-transparent border-none cursor-pointer itemscenter mx-auto"
        >
          Não possui conta? Cadastre-se!
        </button>
      </div>
    </div>
  )
}
