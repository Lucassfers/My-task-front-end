import { Link } from "react-router-dom"

export function MenuLateral() {

  return (
    <aside id="default-sidebar" className="fixed mt-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
      <div className="h-full px-3 py-4 overflow-y-auto bg-white dark:bg-gray-800">
        <ul className="space-y-2 font-medium">
          <li>
            <Link to="/" className="flex items-center p-2">
              <span className="h-5 text-gray-600 text-2xl">
              </span>
              <span className="ms-2 mt-1">Inicio</span>
            </Link>
          </li>
          <li>
            <Link to="/boards" className="flex items-center p-2">
              <span className="h-5 text-gray-600 text-2xl">
              </span>
              <span className="ms-2 mt-1">Boards</span>
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  )
}