import { FaRegStar } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import type { TaskType } from "../utils/TaskType";
import { useUsuarioStore } from "../context/UsuarioContext";
import { toast } from "sonner";
import Modal from "../utils/Modal";
import { useState, useEffect, useRef } from "react";
import type { ListaType } from "../utils/ListaType";
import { useForm } from "react-hook-form";
import { FaRegCalendarCheck } from "react-icons/fa6";
import { MdOutlineInsertComment } from "react-icons/md";
import type { ComentarioType } from "../utils/ComentarioType";


type listaTaskProps = {
    task: TaskType;
    tasks: TaskType[];
    setTasks: React.Dispatch<React.SetStateAction<TaskType[]>>;
    lista: ListaType;
}
type Inputs = { conteudo:string }

const apiUrl = import.meta.env.VITE_API_URL

export default function ItemTask({ task, tasks, setTasks, lista }: listaTaskProps) {
    const { usuario } = useUsuarioStore()
    const [loading, setLoading] = useState(true);
    const [comentarios, setComentarios] = useState<ComentarioType[]>([])
    const [isOpen, setIsOpen] = useState(false);
    const { register, handleSubmit, reset }= useForm<Inputs>();
    const listaComentariosRef = useRef<HTMLDivElement | null>(null);


    useEffect(() => {
        if (task.comentarios) {
            setComentarios(task.comentarios);
        }
        setLoading(false);
    }, [task.id, task.comentarios]);

    async function enviarComentario(data: Inputs) {
        if (!usuario?.token) {
            toast.error("Você precisa estar logado para comentar");
            return;
        }

        try {
            const response = await fetch(`${apiUrl}/comentarios`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${usuario.token}`
                },
                body: JSON.stringify({ 
                    conteudo: data.conteudo,
                    usuarioId: usuario.id,
                    taskId: task.id
                 })
            });

            if (response.status === 201) {
                const novoComentario = await response.json();
                const comentarioComUsuario = {
                    ...novoComentario,
                    usuario: { id: usuario.id, nome: usuario.nome }
                };
                setComentarios([...comentarios, comentarioComUsuario]);
                reset();
                toast.success("Comentário enviado!");
                if (listaComentariosRef.current) {
                    listaComentariosRef.current.scrollTop = listaComentariosRef.current.scrollHeight;
                }
            } else {
                toast.error("Erro ao enviar comentário");
            }
        } catch (error) {
            console.error("Erro ao enviar comentário:", error);
            toast.error("Erro ao enviar comentário");
        }
    }
    
    async function alterarDestaque() {
        if (!usuario?.token) {
            toast.error("Você precisa estar logado para destacar uma task");
            return;
        }
        
        try {
            const response = await fetch(`${apiUrl}/tasks/destacar/${task.id}`, {
                method: "PATCH",
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${usuario.token}`
                },
            });

            if (response.status === 200) {
                const taskAtualizada = await response.json();
                const tasks2 = tasks.map(x => {
                    if (x.id === task.id) {
                        return { ...x, destaque: taskAtualizada.destaque }
                    }
                    return x
                }).sort((a, b) => {
                    if (a.destaque && !b.destaque) return -1;
                    if (!a.destaque && b.destaque) return 1;
                    return 0;
                });
                setTasks(tasks2);
                toast.success(taskAtualizada.destaque ? "Task destacada!" : "Destaque removido!");
            } else {
                const error = await response.json();
                console.error("Erro do servidor:", error);
                toast.error("Erro ao alterar destaque da task");
            }
        } catch (error) {
            console.error("Erro ao alterar destaque:", error);
            toast.error("Erro ao alterar destaque da task");
        }
    }

    async function toggleConcluirTask() {
        if (!usuario?.token) {
            toast.error("Você precisa estar logado para marcar como concluída");
            return;
        }

        try {
            const response = await fetch(`${apiUrl}/tasks/concluir/${task.id}`, {
                method: "PATCH",
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${usuario.token}`
                }
            });

            if (response.status === 200) {
                const taskAtualizada = await response.json();
                const novasTasks = tasks.map(t => 
                    t.id === task.id ? { ...t, concluida: taskAtualizada.concluida } : t
                );
                setTasks(novasTasks);
                toast.success(taskAtualizada.concluida ? "Task concluída!" : "Task reaberta!");
            } else {
                toast.error("Não foi possível atualizar a task");
            }
        } catch (error) {
            console.error("Erro ao concluir task:", error);
            toast.error("Erro ao atualizar task");
        }
    }
    

    return (
        <>
            <li
                className="text-[#3B82F6] rounded-[8px] border p-2 hover:bg-blue-300 hover:text-white ">
                <div className="flex items-center">
                    <input 
                        type="checkbox" 
                        className="cursor-pointer ml-[0.4rem]"
                        checked={task.concluida || false}
                        onChange={toggleConcluirTask}
                    />
                    <button
                        onClick={() => setIsOpen(true)}
                        className={`font-medium ml-[1rem] w-[8.5rem] cursor-pointer text-start transition-all ${
                            task.concluida ? 'line-through opacity-60' : ''
                        }`}
                    >
                        {task.titulo}
                    </button>
                    <button 
                        className="cursor-pointer" 
                        onClick={alterarDestaque}
                    >
                        {task.destaque ? <FaStar /> : <FaRegStar />}
                    </button>
                    
                </div>
                <Modal open={isOpen} onClose={() => setIsOpen(false)}>
                    <div className="max-w-[90vw] h-[27rem] mr-[2rem]">
                        <h1 className="text-2xl font-black leading-snug mb-2 w-[54.9vw] pl-[1rem] text-[#3B82F6]">
                            {lista.titulo}
                        </h1>
                        <div className="flex items-center justify-between py-3 ">
                            <h1 className="text-l font-bold pl-[1rem] text-[#3B82F6]">{task.titulo}</h1>
                        </div>
                        <div className="flex gap-6 pl-[1rem]">
                            <div className="bg-gray-100 rounded-2xl p-5 w-[27rem] h-[20rem] shadow-md shadow-blue-400">
                                <div className="flex items-center gap-2 mb-2">
                                    <FaRegCalendarCheck className="text-[#3B82F6]" />
                                    <h3 className="font-bold  text-[#3B82F6]">Descrição</h3>
                                    <div className="ml-[14rem] text-[#3B82F6] cursor-pointer">
                                        <button className="rounded-md border px-3 py-1.5 text-sm bg-[#3B82F6] text-white font-bold hover:shadow-2xl ">
                                            Editar
                                        </button>
                                    </div>
                                </div>
                                <p className="text-sm leading-relaxed whitespace-pre-wrap break-words text-[#3B82F6] bg-white py-2 px-3 rounded-md min-h-[4rem] font-medium  ">
                                    {task?.descricao?.trim() ? task.descricao : "Sem descrição"}
                                </p>
                                {task.prazo && (
                                    <div className="mt-4 flex items-center gap-2 text-sm text-[#3B82F6]">
                                        <span className="font-bold ">Prazo para:</span>
                                        <span className="opacity-90">
                                            {new Date(task.prazo).toLocaleDateString("pt-BR", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <form
                                onSubmit={handleSubmit(enviarComentario)}
                                className="bg-gray-100 rounded-2xl p-5 w-[28rem] h-[20rem] ml-[1rem] shadow-md shadow-blue-400 text-[#3B82F6] flex flex-col min-h-0 overflow-hidden">
                                <div className="flex items-center gap-3 mb-3">
                                    <MdOutlineInsertComment className="mt-1" />
                                    <h2 className="font-semibold">Comentários e atividade</h2>
                                </div>

                                <div className="flex items-start gap-3 mb-4">
                                    <div className="flex-1">
                                        <input
                                            {...register("conteudo", { required: true })}
                                            type="text"
                                            placeholder="Escreva um comentário…"
                                            className="w-full rounded-md border px-3 py-1.5 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-600"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="rounded-md  px-3 py-1.5 text-sm bg-[#3B82F6] text-white font-bold cursor-pointer"
                                    >
                                        Enviar
                                    </button>
                                </div>
                                <div ref={listaComentariosRef}
                                    className="flex-1 overflow-y-auto pr-2 space-y-2">
                                    {(comentarios ?? []).length > 0 ? (
                                        comentarios.map((c) => (
                                            <div key={c.id} className="py-1">
                                                <p
                                                    className="w-full max-w-full bg-white rounded-sm px-4 py-2 text-sm text-gray-600 
                                             whitespace-pre-wrap break-words drop-shadow-md"
                                                >
                                                    <span className="font-semibold text-blue-600">
                                                        {c.usuario?.nome || "Usuário desconhecido"}:
                                                    </span>{" "}
                                                    {c.conteudo}
                                                </p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-400">Sem comentários</p>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                </Modal>
            </li>
        </>
    )
}