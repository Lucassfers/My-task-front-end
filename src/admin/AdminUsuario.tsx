import { useEffect, useState } from "react";
import ItemUsuario from "./components/ItemUsuario";
import type { UsuarioType } from "../utils/UsuarioType";

const apiUrl = import.meta.env.VITE_API_URL

export default function AdminAlterUsuario(){
    const [usuarios, setUsuarios] = useState<UsuarioType[]>([])

    useEffect(() => {
        async function getUsuarios(){
            const response = await fetch(`${apiUrl}/usuarios`)
            const dados = await response.json()
            setUsuarios(dados)
        }
        getUsuarios()
    }, [])

    const listaUsuarios = usuarios.map(u => (
        <ItemUsuario key={u.id} usuarioLinha={u} usuarios={usuarios} setUsuario={setUsuarios} />
    ))

    return (
         <div className='m-4 mt-24'>
      <div className='flex justify-between'>
        <h1 className="mb-4 text-2xl font-bold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-4xl dark:text-white">
          Gerenciamento de usuários do Sistema
        </h1>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Nome do Usuário
              </th>
              <th scope="col" className="px-6 py-3">
                E-mail
              </th>
            </tr>
          </thead>
          <tbody>
            {listaUsuarios}
          </tbody>
        </table>
      </div>
    </div>
    )
}


