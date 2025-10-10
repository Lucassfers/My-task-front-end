export type TaskType = {
    id: number
    titulo: string
    descricao: string
    prazo: string
    listaId: number,
    usuarioId: string
    comentarios?: {
        id: number
        conteudo: string
        taskId: number
        usuarioId: string
    }
}