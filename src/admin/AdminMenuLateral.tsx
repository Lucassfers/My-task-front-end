import { IoExitOutline } from "react-icons/io5"
import { useAdminStore } from "./context/AdminContext"
import { Link, useNavigate } from "react-router-dom"

export function MenuLateralAdmin() {
  const navigate = useNavigate()
  const { deslogaAdmin } = useAdminStore()

  function adminSair() {
    if (confirm("Confirma Saída?")) {
      deslogaAdmin()
      navigate("/", { replace: true })
    }
  }

  return (
    <aside id="default-sidebar" className="fixed mt-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
      <div className="h-full px-3 py-4 overflow-y-auto bg-white dark:bg-gray-800">
        <ul className="space-y-2 font-medium">
          <li>
            <Link to="/admin" className="flex items-center p-2">
              <span className="h-5 text-gray-600 text-2xl">
              </span>
              <span className="ms-2 mt-1">Estatísticas Gerais</span>
            </Link>
          </li>
          <li>
              <Link to="/admin/adminCadAdmin" className="flex items-center p-2 cursor-pointer">
                <span className="h-5 text-gray-600 text-2xl">
                </span>
                <span className="ms-2 mt-1">Cadastro de Admins</span>
              </Link>
          </li>
          <li>
              <Link to="/admin/AdminUsuario" className="flex items-center p-2 cursor-pointer">
                <span className="h-5 text-gray-600 text-2xl">
                </span>
                <span className="ms-2 mt-1">Gerenciamento de Usuarios</span>
              </Link>
          </li>
             <li>
            <span className="flex items-center p-2 cursor-pointer">
              <span className="h-5 text-gray-600 text-2xl">
                <IoExitOutline />
              </span>
              <span className="ms-2 mt-1" onClick={adminSair}>Sair do Sistema</span>
            </span>
          </li>
        </ul>
      </div>
    </aside>
  )
}