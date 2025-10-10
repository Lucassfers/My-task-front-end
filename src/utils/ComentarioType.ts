export type ComentarioType = {
    id: number
    conteudo: string
    taskId: number
    usuarioId: string
    usuario?: {
        id: string
        nome: string
    }
}