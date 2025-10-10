export type ListaType = {
    id: number
    titulo: string
    ordem: number
    boardId: number
    tasks?: {
        usuarioId: any
        id: number
        titulo: string
        descricao: string
        prazo: string
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
    }[]
}