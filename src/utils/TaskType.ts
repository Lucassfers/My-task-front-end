export type TaskType = {
    id: number
    titulo: string
    descricao: string
    prazo: string
    listaId: number
    destaque: boolean
    concluida?: boolean
    usuarioId: string
    comentarios?: {
        id: number
        conteudo: string
        taskId: number
        usuarioId: string
        usuario?: {
            id: string
            nome: string
        }
    }[]
}