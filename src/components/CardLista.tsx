import { FaPencil } from "react-icons/fa6";
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import type { BoardType } from "../utils/BoardType";
import type { ListaType } from "../utils/ListaType";
import type { TaskType } from "../utils/TaskType";
import type { ComentarioType } from "../utils/ComentarioType";
import { useUsuarioStore } from "../context/UsuarioContext";
import { useDroppable } from "@dnd-kit/core";
import { toast } from "sonner";
import ItemTask from "./ItemTask";
import NewLista from "./NewLista";
import NewTask from "./NewTask";
const apiUrl = import.meta.env.VITE_API_URL;


// dnd-kit imports
import { DndContext, closestCorners, PointerSensor, KeyboardSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";


export default function CardLista() {
    const { boardId } = useParams<{ boardId: string }>();
    const [board, setBoard] = useState<BoardType | null>(null);
    const [listas, setListas] = useState<ListaType[]>([]);
    const { usuario } = useUsuarioStore();
    const [comentarios, setComentarios] = useState<ComentarioType[]>([]);
    const [loading, setLoading] = useState(true);
    const [openTaskId] = useState<number | null>(null);
    const listaComentariosRef = useRef<HTMLDivElement | null>(null);
    const [editandoListaId, setEditandoListaId] = useState<number | null>(null);
    const [novoTituloLista, setNovoTituloLista] = useState("");
    

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor)
    );
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
        try {
            let taskAberta = null as any;
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

    async function criarNovaLista() {
        if (!boardId || !usuario.id) {
            toast.error("Erro: dados do board ou usuário não encontrados");
            return;
        }

        const numeroLista = listas.length + 1;
        const tituloLista = `Lista ${numeroLista}`;

        const dados = localStorage.getItem("usuarioKey") || sessionStorage.getItem("usuarioKey");
        const usuarioData = dados ? JSON.parse(dados) as { token?: string } : null;
        const token = usuarioData?.token ?? "";

        try {
            const response = await fetch(`${apiUrl}/listas`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    titulo: tituloLista,
                    boardId: Number(boardId),
                    usuarioId: usuario.id
                })
            });

            if (response.status === 201) {
                const novaLista = await response.json();
                setListas([...listas, { ...novaLista, tasks: [] }]);
                toast.success(`${tituloLista} criada com sucesso!`);
            } else {
                const erro = await response.json();
                toast.error(`Erro ao criar lista: ${erro.erro || 'Erro desconhecido'}`);
            }
        } catch (error) {
            console.error("Erro ao criar lista:", error);
            toast.error("Erro ao criar lista");
        }
    }

    function iniciarEdicaoLista(listaId: number, tituloAtual: string) {
        setEditandoListaId(listaId);
        setNovoTituloLista(tituloAtual);
    }

    async function salvarEdicaoLista(listaId: number) {
        if (!novoTituloLista.trim()) {
            toast.warning("O título da lista não pode estar vazio");
            return;
        }

        if (!boardId || !usuario.id) {
            toast.error("Erro: dados do board ou usuário não encontrados");
            return;
        }

        const dados = localStorage.getItem("usuarioKey") || sessionStorage.getItem("usuarioKey");
        const usuarioData = dados ? JSON.parse(dados) as { token?: string } : null;
        const token = usuarioData?.token ?? "";

        try {
            const response = await fetch(`${apiUrl}/listas/${listaId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    titulo: novoTituloLista,
                    boardId: Number(boardId),
                    usuarioId: usuario.id
                })
            });

            if (response.status === 200) {
                setListas(listas.map(l =>
                    l.id === listaId ? { ...l, titulo: novoTituloLista } : l
                ));
                toast.success("Título da lista atualizado!");
                setEditandoListaId(null);
                setNovoTituloLista("");
            } else {
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    const erro = await response.json();
                    toast.error(erro.erro || "Erro ao atualizar lista");
                } else {
                    toast.error("Erro: Resposta inválida do servidor");
                }
            }
        } catch (error) {
            console.error("Erro ao atualizar lista:", error);
            toast.error("Erro ao atualizar lista");
        }
    }

    function cancelarEdicaoLista() {
        setEditandoListaId(null);
        setNovoTituloLista("");
    }

    async function criarNovaTask(listaId: number, titulo: string) {
        if (!usuario.id) {
            toast.error("Erro: dados do usuário não encontrados");
            return;
        }

        const dados = localStorage.getItem("usuarioKey") || sessionStorage.getItem("usuarioKey");
        const usuarioData = dados ? JSON.parse(dados) as { token?: string } : null;
        const token = usuarioData?.token ?? "";

        const prazo = new Date();
        prazo.setDate(prazo.getDate() + 7);

        try {
            const response = await fetch(`${apiUrl}/tasks`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    titulo,
                    descricao: "",
                    prazo: prazo.toISOString(),
                    usuarioId: usuario.id,
                    listaId: listaId,
                    destaque: false,
                    concluida: false
                })
            });

            if (response.status === 201) {
                const novaTask = await response.json();
                const taskCompleta = {
                    ...novaTask,
                    comentarios: [],
                    concluida: false
                };

                setListas(listas.map(l =>
                    l.id === listaId
                        ? { ...l, tasks: [...(l.tasks || []), taskCompleta] }
                        : l
                ));
                toast.success("Task criada com sucesso!");
            } else {
                const erro = await response.json();
                toast.error(`Erro ao criar task: ${erro.erro || 'Erro desconhecido'}`);
            }
        } catch (error) {
            console.error("Erro ao criar task:", error);
            toast.error("Erro ao criar task");
        }
    }

    // dnd-kit

    const getTaskPos = (id: number) => {
        const lista = listas.find(l => l.tasks?.some(t => t.id === id));
        if (!lista || !lista.tasks) return -1;
        return lista.tasks.findIndex(task => task.id === id);
    }


    const handleDragEnd = (event: { active: any; over: any; }) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;


        const activeId = Number(active.id);
        const overId = Number(over.id);

        const listaComTask: any = listas.find(lista =>
            lista.tasks?.some(task => task.id === activeId)
        );

        const originalPos = getTaskPos(activeId);
        const newPos = getTaskPos(overId);

        const tasksReordenadas: any = arrayMove(listaComTask.tasks, originalPos, newPos);

        setListas(listas.map(lista =>
            lista.id === listaComTask.id
                ? { ...lista, tasks: tasksReordenadas }
                : lista
        ));
        if (active.id === over.id) return;
        if (!listaComTask) return;
        if (originalPos < 0 || newPos < 0) return;
    };
    return (
        <div className=" pt-6 w-[75vw] h-[80vh] m-auto group  bg-blue rounded-sm mt-[1rem] bg-[#1A1D26] px-[2rem] border-[#2A2D3A] border-2">
            <h1 className="text-2xl font-bold mb-6 text-gray-200 border-gray-200 border-b-2">
                {board.titulo}
            </h1>
            {listas.length ? (
                <div className="flex gap-4 overflow-x-auto">

                    <DndContext sensors={sensors} onDragEnd={handleDragEnd} collisionDetection={closestCorners}>

                        {listas.map((lista) => (
                            <div
                                key={lista.id}
                                className="text-gray-200 bg-[#0B0E13] p-4 rounded-[8px] shadow-xl w-[15rem] hover:shadow-2xl
                            flex flex-col h-[50vh] min-h-0 flex-shrink-0 border-[#2A2D3A] border-2">

                                <SortableContext items={(lista.tasks ?? []).map(task => task.id.toString())} strategy={verticalListSortingStrategy}>
                                    <div className="flex justify-between items-center mb-3">
                                        {editandoListaId === lista.id ? (
                                            <input
                                                type="text"
                                                value={novoTituloLista}
                                                onChange={(e) => setNovoTituloLista(e.target.value)}
                                                className="flex-1 border-none  bg-transparent px-2 py-1 text-lg font-bold focus:outline-none"
                                                autoFocus
                                                onBlur={() => salvarEdicaoLista(lista.id)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') salvarEdicaoLista(lista.id);
                                                    if (e.key === 'Escape') cancelarEdicaoLista();
                                                }}
                                            />
                                        ) : (
                                            <>
                                                <h2 className="text-lg font-bold">{lista.titulo}</h2>
                                                <button onClick={() => iniciarEdicaoLista(lista.id, lista.titulo)}>
                                                    <FaPencil className="cursor-pointer hover:text-[#5633F0]" />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                    <ul className="mt-2 flex-1 overflow-y-auto overflow-x-hidden pr-1 space-y-2">
                                        {lista.tasks?.length ? (
                                            <>
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
                                                                concluida: t.concluida,
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
                                            </>
                                        ) : null}
                                        <NewTask onCreateTask={(titulo) => criarNovaTask(lista.id, titulo)} />
                                    </ul>

                                </SortableContext>
                            </div>
                        ))}
                    </DndContext>
                    <NewLista onClick={criarNovaLista} />
                </div>
            ) : (
                <div className="flex gap-4">
                    <NewLista onClick={criarNovaLista} />
                </div>
            )}
        </div>
    );
}
