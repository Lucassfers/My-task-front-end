import { FaPencil } from "react-icons/fa6";
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import type { BoardType } from "../utils/BoardType";
import type { ListaType } from "../utils/ListaType";
import type { TaskType } from "../utils/TaskType";
import type { ComentarioType } from "../utils/ComentarioType";
import { useUsuarioStore } from "../context/UsuarioContext";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import ItemTask from "./ItemTask";

const apiUrl = import.meta.env.VITE_API_URL;
type Inputs = { conteudo: string };

export default function CardLista() {
    const { boardId } = useParams<{ boardId: string }>();
    const [board, setBoard] = useState<BoardType | null>(null);
    const [listas, setListas] = useState<ListaType[]>([]);
    const [tasks, setTasks] = useState<TaskType[]>([]);
    const { usuario } = useUsuarioStore();
    const [comentarios, setComentarios] = useState<ComentarioType[]>([]);
    const [loading, setLoading] = useState(true);
    const { register, handleSubmit, reset } = useForm<Inputs>();
    const [openTaskId, setOpenTaskId] = useState<number | null>(null);
    const listaComentariosRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!boardId) return;
        (async () => {
            try {
                setLoading(true);
                const dados = localStorage.getItem("usuarioKey") || sessionStorage.getItem("usuarioKey");
                const usuarioData = dados ? JSON.parse(dados) as { token?: string } : null;
                const token = usuarioData?.token ?? "";
                
                const response = await fetch(`${apiUrl}/boards/${boardId}/listas/tasks/comentarios`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                const dados2 = await response.json();
                setBoard(dados2);
                
                // Ordena as tasks para que as destacadas fiquem no topo
                const listasOrdenadas = (dados2.listas ?? []).map((lista: ListaType) => ({
                    ...lista,
                    tasks: lista.tasks?.sort((a, b) => {
                        if (a.destaque && !b.destaque) return -1;
                        if (!a.destaque && b.destaque) return 1;
                        return 0;
                    })
                }));
                
                setListas(listasOrdenadas);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        })();
        
    }, [boardId]);

    useEffect(() => {
        if (openTaskId == null) {
            setComentarios([]);
            return;
        }
        (async () => {
            try {
                let taskAberta = null;
                for (const lista of listas) {
                    taskAberta = lista.tasks?.find((t) => t.id === openTaskId);
                    if (taskAberta) break;
                }
                if (taskAberta && taskAberta.comentarios) setComentarios(taskAberta.comentarios);
                else setComentarios([]);
            } catch (err) {
                console.error("Erro ao carregar comentários:", err);
                setComentarios([]);
            }
        })();
    }, [openTaskId, listas]);


    useEffect(() => {
        if (openTaskId != null) {
            requestAnimationFrame(() => {
                const el = listaComentariosRef.current;
                if (el) el.scrollTop = el.scrollHeight;
            });
        }
    }, [openTaskId]);

    useEffect(() => {
        const el = listaComentariosRef.current;
        if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }, [comentarios]);

    if (loading) return <div>Carregando…</div>;
    if (!board) return <div>Board não encontrado</div>;

    async function enviarComentario(data: Inputs) {
        if (!openTaskId) return;
        const dados = localStorage.getItem("usuarioKey") || sessionStorage.getItem("usuarioKey");
        const usuarioData = dados ? JSON.parse(dados) as { token?: string } : null;
        const token = usuarioData?.token ?? "";
        
        const response = await fetch(`${apiUrl}/comentarios`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                conteudo: data.conteudo,
                usuarioId: usuario.id,
                taskId: openTaskId,
            }),
        });
        if (response.status === 201) {
            toast.success("Comentário adicionado!");
            const novoComentario = await response.json();
            const comentarioComUsuario = {
                ...novoComentario,
                usuario: { id: usuario.id, nome: usuario.nome },
            } as ComentarioType;
            setComentarios((prev) => [...prev, comentarioComUsuario]);
            reset();
        } else {
            toast.error("Erro ao adicionar comentário.");
        }
    }

    

    return (
        <div className=" pt-6 w-[75vw] h-[80vh] m-auto group  bg-blue rounded-sm mt-[1rem]">
            <h1 className="text-2xl font-bold mb-6 text-[#3B82F6] border-[#3B82F6] border-b-2">
                {board.titulo}
            </h1>
            {listas.length ? (
                <div className="flex gap-4">
                    {listas.map((lista) => (
                        <div
                            key={lista.id}
                            className="text-[#3B82F6] bg-[#FFFFFF] p-4 rounded-[8px] shadow-xl w-[15rem] hover:shadow-2xl
                            flex flex-col h-[50vh] min-h-0">
                            <div className="flex justify-between">
                                <h2 className="text-lg font-bold mb-3">{lista.titulo}</h2>
                                <button>
                                    <FaPencil className="cursor-pointer hover:text-blue-300" />
                                </button>
                            </div>
                            {lista.tasks?.length ? (
                                <ul className="mt-2 flex-1 overflow-y-auto overflow-x-hidden pr-1 space-y-2">
                                    {lista.tasks.map((task) => (
                                        <ItemTask 
                                            key={task.id}
                                            task={{
                                                ...task,
                                                listaId: lista.id,
                                            } as TaskType}
                                            tasks={lista.tasks?.map(t => ({
                                                ...t,
                                                listaId: lista.id,
                                            } as TaskType)) || []}
                                            setTasks={(novasTasks) => {
                                                if (typeof novasTasks === 'function') return;
                                                const tasksAtualizadas = novasTasks.map(t => ({
                                                    usuarioId: t.usuarioId,
                                                    id: t.id,
                                                    titulo: t.titulo,
                                                    descricao: t.descricao,
                                                    prazo: t.prazo,
                                                    comentarios: t.comentarios,
                                                    destaque: t.destaque,
                                                }));
                                                setListas(listas.map(l => 
                                                    l.id === lista.id 
                                                        ? { ...l, tasks: tasksAtualizadas }
                                                        : l
                                                ));
                                            }}
                                            lista={lista}
                                        />
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500">Sem tasks</p>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <>
                    <h1>Sem listas adicionadas</h1>
                </>
            )}
        </div>
    );
}
