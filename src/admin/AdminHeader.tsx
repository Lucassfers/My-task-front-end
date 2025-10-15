import { FaRegCalendarCheck } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAdminStore } from "./context/AdminContext";

export default function AdminHeader() {
  const { admin, deslogaAdmin } = useAdminStore()
  const navigate = useNavigate()

  function primeiroNome(nomeCompleto: string) {
    return nomeCompleto.split(" ")[0] ?? "";
  }

  function adminSair() {
    if (confirm("Confirma saída do sistema?")) {
      deslogaAdmin()
      if (localStorage.getItem("usuarioKey")) {
        localStorage.removeItem("usuarioKey")
      }
      navigate("/login")
    }
  }
  const logado = !!admin?.id

  return (
    <header className="bg-white d py-4">
      <div className="w-[80%] mx-auto px-6 flex items-center justify-between">

        <div className="flex items-center gap-2 ">
          <FaRegCalendarCheck size={24} className="text-black" />
          <h1 className="text-black text-[1.5rem] font-medium">MyTask</h1>
        </div>

        <div className="flex flex-1 justify-center">
          <h1>Administrador</h1>
        </div>

        <div className="flex items-center">
          {logado ? (
            <>
              <span className="text-black font-medium text-[1rem] cursor-pointer px-4 py-2 rounded-lg
            transition-colors duration-500 ">
                Olá, {primeiroNome(admin.nome)}!
              </span>
              <button
                onClick={adminSair}
                className="text-black font-medium text-[1rem] cursor-pointer px-4 py-2 rounded-lg
              transition-colors duration-500 "
              >
                Sair
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="text-black font-medium text-[1rem] cursor-pointer px-4 py-2 rounded-lg
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