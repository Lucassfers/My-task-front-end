import { TiDeleteOutline } from "react-icons/ti"
import { useAdminStore } from "../context/AdminContext"
import { toast } from "sonner"
import type { AdminType } from "../../utils/AdminType"

type listaAdminsProps = {
  adminLinha: AdminType;
  admins: AdminType[];
  setAdmins: React.Dispatch<React.SetStateAction<AdminType[]>>;
}

const apiUrl = import.meta.env.VITE_API_URL

export default function ItemAdmin({ adminLinha, admins, setAdmins }: listaAdminsProps) {
  const { admin } = useAdminStore()

  async function excluirAdmin() {
    if (!admin) {
      toast.error("Você não tem permissão para excluir admins");
      return;
    }

    if (confirm(`Confirma a exclusão de ${adminLinha.nome}?`)) {
      console.log("Enviando DELETE para:", `${apiUrl}/admin/${adminLinha.id}`)
      const response = await fetch(`${apiUrl}/admin/${adminLinha.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${admin.token}`
          },
        },
      )
      console.log("Status:", response.status)
      console.log("Content-Type:", response.headers.get("content-type"))
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        const textoResposta = await response.text()
        console.error("Resposta não é JSON:", textoResposta)
        toast.error("Erro: O servidor retornou HTML em vez de JSON. Verifique se a rota está correta.")
        return
      }
      if (response.status == 200) {
        const admins2 = admins.filter(x => x.id != adminLinha.id)
        setAdmins(admins2)
        toast.success("Admin excluído com sucesso")
      } else {
        const erro = await response.json()
        console.error("Erro do servidor:", erro)
        toast.error(erro.error || erro.message || "Erro... Admin não foi excluído")
      }
    }
  }

  return (
    <tr key={adminLinha.id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
      <td className={`px-6 py-4`}>
        {adminLinha.nome}
      </td>
      <td className={`px-6 py-4`}>
        {adminLinha.email}
      </td>
      <td className="px-6 py-4">
        <TiDeleteOutline className="text-3xl text-red-600 inline-block cursor-pointer" title="Excluir"
          onClick={excluirAdmin} />
      </td>
    </tr>
  )
}
