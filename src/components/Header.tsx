import { InputPesquisa } from "./InputPesquisa";
import { IoSearchSharp } from "react-icons/io5";
import { FaRegCalendarCheck } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useUsuarioStore } from "../context/UsuarioContext";

type HeaderProps = {
  onPesquisa?: (termo: string) => void
}

export default function Header({ onPesquisa }: HeaderProps) {
  const { usuario, deslogaUsuario } = useUsuarioStore()
  const navigate = useNavigate()
  const armazenado = (() => {
  try { 
    const dados = localStorage.getItem("usuarioKey") || sessionStorage.getItem("usuarioKey")
    return JSON.parse(dados || "null") 
  } catch { return null }
})()
  const usuarioAtual = usuario ?? armazenado
  const logado = !!usuarioAtual?.id
  const nome = usuarioAtual?.nome ?? ""

  function primeiroNome(nomeCompleto: string) {
    return nomeCompleto.split(" ")[0] ?? "";
  }

  function usuarioSair() {
    if (confirm("Confirma saída do sistema?")) {
      deslogaUsuario()
      localStorage.removeItem("usuarioKey")
      sessionStorage.removeItem("usuarioKey")
      navigate("/login")
    }
  }

  return (
    <header className="bg-[#0B0E13] d py-4">
      <div className="w-[80%] mx-auto px-6 flex items-center justify-between">

        <div className="flex items-center gap-2 ">
          <FaRegCalendarCheck size={24} className="text-white" />
          <h1 className="text-white text-[1.5rem] font-medium">MyTask</h1>
        </div>

        <div className="flex flex-1 justify-center">
          <div className="flex items-center gap-4">
            <Link
              to="/boards"
              className="text-white font-medium text-[1rem] cursor-pointer px-4 py-2 rounded-lg
            transition-colors duration-500 hover:text-shadow-md"
            >
              Boards
            </Link>
            <div className="relative ">
              <IoSearchSharp className="ml-2 pointer-events-none absolute top-1/2 -translate-y-1/2 left-2 h-4 text-white " />
              <InputPesquisa onPesquisa={onPesquisa || (() => {})}/>
            </div> 

          </div>
        </div>

        <div className="flex items-center">
          {logado ? (
            <>
              <span className="text-white font-medium text-[1rem] cursor-pointer px-4 py-2 rounded-lg
            transition-colors duration-500 ">
                Olá, {primeiroNome(nome)}!
              </span>
              <button
                onClick={usuarioSair}
                className="text-white font-medium text-[1rem] cursor-pointer px-4 py-2 rounded-lg
              transition-colors duration-500 "
              >
                Sair
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="text-white font-medium text-[1rem] cursor-pointer px-4 py-2 rounded-lg
            transition-colors duration-500 hover:text-shadow-md"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>

  );

}