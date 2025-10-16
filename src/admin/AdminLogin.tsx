import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { Toaster, toast } from 'sonner'
import { useAdminStore } from "./context/AdminContext"

import { FaRegCalendarCheck } from "react-icons/fa"

const apiUrl = import.meta.env.VITE_API_URL

type Inputs = {
  email: string
  senha: string
}

export default function AdminLogin() {
  const { register, handleSubmit, setFocus } = useForm<Inputs>()
  const navigate = useNavigate()
  const { logaAdmin } = useAdminStore()

  useEffect(() => {
    setFocus("email")
  }, [])

  async function verificaLogin(data: Inputs) {
    const response = await fetch(`${apiUrl}/adminLogin`, {
      method: "POST",
      headers: { "Content-type": "Application/json" },
      body: JSON.stringify({ email: data.email, senha: data.senha })
    })

    if (response.status == 200) {
      const dados = await response.json()
      logaAdmin(dados)
      navigate("/admin")
    }
  }

  return (
    <main className="max-w-screen-xl flex flex-col items-center mx-auto p-6 my-22">
      <div className="flex items-center gap-2 pb-15">
                <FaRegCalendarCheck size={54} className="text-black" />
                <h1 className="text-black text-[3.5rem] font-medium">MyTask</h1>
    </div>
      <div className="relative w-full max-w-sm p-6 bg-white rounded-2xl shadow-lg py-14 transition-colors z-10 pt-0">
        <h1 className="text-3xl font-bold my-8 text-center ">Admin</h1>
        <form className="max-w-sm mx-auto"
          onSubmit={handleSubmit(verificaLogin)} >
          <div className="mb-5">
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">E-mail:</label>
            <input type="email" id="email" className="w-full p-2 border-b-2 border-blue-500 focus:outline-none"
              {...register("email")}
              required />
          </div>
          <div className="mb-5">
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Senha:</label>
            <input type="password" id="password" className="w-full p-2 border-b-2 border-blue-500 focus:outline-none"
              {...register("senha")}
              required />
          </div>
          <div className="flex items-start">
            
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded transition-colors hover:bg-blue-700 tracking-widest my-7">Entrar</button>
        </form>
      </div>
      <Toaster richColors position="top-right" />
    </main>
  );
}
