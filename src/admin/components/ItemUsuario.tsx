import { TiDeleteOutline } from "react-icons/ti"
import { useAdminStore } from "../context/AdminContext"
import type { UsuarioType } from "../../utils/UsuarioType";
import { useUsuarioStore } from "../../context/UsuarioContext";

type listaUsuariosProps = {
    usuarioLinha: UsuarioType;
    usuarios: UsuarioType[];
    setUsuario: React.Dispatch<React.SetStateAction<UsuarioType[]>>;
}

const apiUrl = import.meta.env.VITE_API_URL;

export default function itemUsuario({ usuarioLinha, usuarios, setUsuario }: listaUsuariosProps) {
    const { usuario } = useUsuarioStore()
    const { admin } = useAdminStore()

    async function excluirUsuario() {
        if (!admin){
            alert("Você não tem permissão para excluir usuários")
            return
        }

        if (confirm(`Confirma a exclusão`)){
            const response = await fetch(`${apiUrl}/admin/${usuarioLinha.id}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${admin.token}`
                    },
                },
            )

        if (response.status == 200) {
            const usuarios2 = usuarios.filter(x => x.id != usuarioLinha.id)
            setUsuario(usuarios2)
            alert("Usuário excluido com sucesso.")
        } else {
            alert("Erro... Usuário não foi excluído.")
        }
        }
    }
     return (
    <tr key={usuarioLinha.id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
      <td className={`px-6 py-4`}>
        {usuarioLinha.nome}
      </td>
      <td className={`px-6 py-4`}>
        {usuarioLinha.email}
      </td>
      <td className="px-6 py-4">
        <TiDeleteOutline className="text-3xl text-red-600 inline-block cursor-pointer" title="Excluir"
          onClick={excluirUsuario} />&nbsp;
      </td>
    </tr>
  )

}