import { TiDeleteOutline } from "react-icons/ti"
import { useAdminStore } from "../context/AdminContext"
import type { UsuarioType } from "../../utils/UsuarioType";

type listaUsuariosProps = {
    usuarioLinha: UsuarioType;
    usuarios: UsuarioType[];
    setUsuario: React.Dispatch<React.SetStateAction<UsuarioType[]>>;
}

const apiUrl = import.meta.env.VITE_API_URL;

export default function itemUsuario({ usuarioLinha, usuarios, setUsuario }: listaUsuariosProps) {
    const { admin } = useAdminStore()

    async function excluirUsuario() {
        if (!admin){
            alert("Você não tem permissão para excluir usuários")
            return
        }

        if (confirm(`Confirma a exclusão do usuário ${usuarioLinha.nome}?`)){
            const response = await fetch(`${apiUrl}/usuarios/${usuarioLinha.id}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${admin.token}`
                    },
                },
            )

        if (response.status == 200) {
            const dados = await response.json()
            const usuarios2 = usuarios.filter(x => x.id != usuarioLinha.id)
            setUsuario(usuarios2)
            const counts = dados.afetados
            alert(`Usuário excluído com sucesso!\n\nRegistros afetados:\n- Boards: ${counts.boards}\n- Listas: ${counts.listas}\n- Tasks: ${counts.tasksBoards + counts.tasksAtribuidas}\n- Comentários: ${counts.comentariosAnonimizados + counts.comentariosTasksAtribuidas + counts.comentariosTasksBoards}\n- Logs desvinculados: ${counts.logsDesvinculados}`)
        } else {
            const erro = await response.json()
            alert(`Erro... Usuário não foi excluído.\n\n${erro.erro || erro.detalhe || JSON.stringify(erro)}`)
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