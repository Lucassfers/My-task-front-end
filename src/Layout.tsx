
import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./components/Header";
import { useUsuarioStore } from "./context/UsuarioContext";
import App from "./App";
import { MenuLateral } from "./components/MenuLateral";

const apiUrl = import.meta.env.VITE_API_URL;

export default function Layout() {
  const { logaUsuario, deslogaUsuario } = useUsuarioStore();
  const [termoPesquisa, setTermoPesquisa] = useState<string>("");
  const location = useLocation();

  useEffect(() => {
    async function buscaUsuario(id: string) {
      const response = await fetch(`${apiUrl}/usuarios/${id}`);
      if (!response.ok) {
        deslogaUsuario();
        return;
      }
      const dados = await response.json();
      logaUsuario(dados);
    }

    if (localStorage.getItem("usuarioKey")) {
      const idUsuario = localStorage.getItem("usuarioKey") as string;
      buscaUsuario(idUsuario); 
    } else {
      deslogaUsuario();
    }
  }, []);


  useEffect(() => {
    if (location.pathname !== '/boards') {
      setTermoPesquisa("");
    }
  }, [location.pathname]);

  function handlePesquisa(termo: string) {
    setTermoPesquisa(termo);
  }

  if (location.pathname === '/boards') {
    return (
      <div className="bg-[#F5F7FA] min-h-screen">
        <Header onPesquisa={handlePesquisa} />
        <MenuLateral/>
        <App termoPesquisa={termoPesquisa} />
      </div>
    );
  }

  return (
    <div className="bg-[#F5F7FA] min-h-screen">
      <Header />
      <MenuLateral/>
      <Outlet />
    </div>
  );
}
