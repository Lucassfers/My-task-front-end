import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'

import App from './App.tsx'
import Layout from './Layout.tsx'
import Login from './routes/Login.tsx'
import Cadastro from './routes/Cadastro.tsx'
import CardLista from './components/CardLista.tsx'

import './index.css'
import AdminLogin from './admin/AdminLogin.tsx'
import AdminDashboard from './admin/AdminDashBoard.tsx'
import AdminLayout from './admin/AdminLayout.tsx'
import AdminCadAdmin from './admin/AdminCadAdmin.tsx'
import AdminAlterUsuario from './admin/AdminUsuario.tsx'
// import AdminBoardsUsuario from './admin/'

const rotas = createBrowserRouter([
  {
    path: "/admin/login",
    element: <AdminLogin/>,
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "adminCadAdmin", element: <AdminCadAdmin/> },
      { path: "AdminUsuario", element: <AdminAlterUsuario/>}
    ],
  },
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/boards" replace /> }, 
      { path: 'login', element: <Login /> },                       
      { path: 'cadastro', element: <Cadastro /> }, 
      { path: 'boards', element: <App /> },                        
      { path: 'boards/:boardId/listas/tasks/comentarios', element: <CardLista /> },
      { path: '*', element: <Navigate to="/boards" replace /> },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={rotas} />
  </StrictMode>,
)