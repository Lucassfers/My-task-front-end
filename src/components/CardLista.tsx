import { MdOutlineInsertComment } from "react-icons/md";
import { FaRegCalendarCheck } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import type { BoardType } from "../utils/BoardType";
import type { ListaType } from "../utils/ListaType";
import { Modal } from "./Modal";
import type { ComentarioType } from "../utils/ComentarioType";
import { useUsuarioStore } from "../context/UsuarioContext";
import { toast } from "sonner";
import { useForm } from "react-hook-form";

const apiUrl = import.meta.env.VITE_API_URL;
type Inputs = { conteudo: string };

export default function CardLista() {
    const { boardId } = useParams<{ boardId: string }>();
    const [board, setBoard] = useState<BoardType | null>(null);
    const [listas, setListas] = useState<ListaType[]>([]);
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
                const dados = localStorage.getItem("usuarioKey");
                const usuarioData = dados ? JSON.parse(dados) as { token?: string } : null;
                const token = usuarioData?.token ?? "";
                
                const response = await fetch(`${apiUrl}/boards/${boardId}/listas/tasks/comentarios`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                const dados2 = await response.json();
                setBoard(dados2);
                setListas(dados2.listas ?? []);
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
        const dados = localStorage.getItem("usuarioKey");
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
        <div className="pl-34 pt-6 w-[80vw] h-[80vh] m-auto group  bg-blue rounded-sm mt-[1rem]">
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
                                    {lista.tasks.map((t) => (
                                        <li
                                            key={t.id}
                                            className="text-[#3B82F6] rounded-[8px] border p-2 hover:bg-blue-300 hover:text-white ">
                                            <div className="flex items-center">
                                                <input type="checkbox" className="cursor-pointer ml-[0.4rem]" />
                                                <button
                                                    onClick={() => setOpenTaskId(t.id)}
                                                    className="font-medium ml-[1rem] w-[8.5rem] cursor-pointer text-start transition-all "
                                                >
                                                    {t.titulo}
                                                </button>
                                            </div>
                                            <Modal isOpen={openTaskId === t.id} onClose={() => setOpenTaskId(null)}>
                                                <div className="max-w-[90vw] h-[27rem] mr-[2rem]">
                                                    <h1 className="text-2xl font-black leading-snug mb-2 w-[54.9vw] pl-[1rem] text-[#3B82F6]">
                                                        {lista.titulo}
                                                    </h1>
                                                    <div className="flex items-center justify-between py-3 ">
                                                        <h1 className="text-l font-bold pl-[1rem] text-[#3B82F6]">{t.titulo}</h1>
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
                                                                {t?.descricao?.trim() ? t.descricao : "Sem descrição"}
                                                            </p>
                                                            {t.prazo && (
                                                                <div className="mt-4 flex items-center gap-2 text-sm text-[#3B82F6]">
                                                                    <span className="font-bold ">Prazo para:</span>
                                                                    <span className="opacity-90">
                                                                        {new Date(t.prazo).toLocaleDateString("pt-BR", {
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
