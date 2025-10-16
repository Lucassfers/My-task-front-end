import { useForm } from "react-hook-form";
import { toast } from "sonner";

const apiUrl = import.meta.env.VITE_API_URL;

type BoardForm = {
  titulo: string;
  motivo: "TRABALHO" | "ESTUDO" | "PESSOAL" | "OUTRO";
  usuarioId: string;
};

export async function AddBoard(data: BoardForm) {
  const { register, handleSubmit} = useForm<BoardForm>()

  const token = localStorage.getItem("token");
  const response = await fetch(`${apiUrl}/boards`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    method: "POST",
    body: JSON.stringify({
      titulo: data.titulo,
      motivo: data.motivo,
      usuarioId: data.usuarioId
    })
  })

  if(response.status == 201){
    toast.success("Board adicionado.")
  } else {
    toast.error("Não foi possível adicionar o Board.")
  }
  

  return (
    <form onSubmit={handleSubmit(AddBoard)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Título</label>
        <input
          type="text"
          {...register("titulo", {
            required: "Informe um título",
            minLength: { value: 3, message: "Mínimo de 3 caracteres" },
          })}
          className="w-full rounded-lg border px-3 py-2"
          placeholder="Ex.: Projeto X"
        />

      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Motivo</label>
        <select
          {...register("motivo", { required: "Selecione um motivo" })}
          className="w-full rounded-lg border px-3 py-2"
        >
          <option value="TRABALHO">TRABALHO</option>
          <option value="ESTUDO">ESTUDO</option>
          <option value="PESSOAL">PESSOAL</option>
          <option value="OUTRO">OUTRO</option>
        </select>
      </div>

      <input type="hidden" {...register("usuarioId")} />

      <button type="submit"
        className="rounded-lg bg-blue-600 text-white px-4 py-2 disabled:opacity-60">
      </button>
    </form>
  );
}
