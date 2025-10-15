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

  // useEffect(() => {
  //   const script = document.createElement("script")
  //   script.src = "/finisher-header.es5.min.js"
  //   script.onload = () => {
  //     // @ts-ignore
  //     if (window.FinisherHeader) {
  //       // @ts-ignore
  //       new window.FinisherHeader({
  //         count: 12,
  //         size: { min: 1300, max: 1500, pulse: 0 },
  //         speed: { x: { min: 0.6, max: 1 }, y: { min: 0.6, max: 3 } },
  //         colors: { background: "#fff", particles: ["#1cffb3", "#87ddfe", "#231efe", "#5f0aff"] },
  //         blending: "lighten",
  //         opacity: { center: 0.6, edge: 0 },
  //         skew: 0,
  //         shapes: ["c"],
  //       })
  //     }
  //   }
  //   document.body.appendChild(script)
  // }, [])

  async function verificaLogin(data: Inputs) {
    const response = await fetch(`${apiUrl}/login`, {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({ email: data.email, senha: data.senha }),
    })
    if(!response.ok){
      toast.error("Erro... Login ou senha incorretos")
      return
    }

    const dados = await response.json()
    logaUsuario(dados)

    if(data.manter){
      localStorage.setItem("usuarioKey", JSON.stringify(dados))
    } else {
      localStorage.removeItem("usuarioKey")
    }
    navigate("/")
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
