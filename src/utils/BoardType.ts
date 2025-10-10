export type BoardType = {
    id: number
    titulo: string
    motivo: string
    usuarioId: string
    createdAt?: string;
    updatedAt?: string;
    listas?: {
    id: number;
    titulo: string;
    tarefasTotal?: number;
    tarefasConcluidas?: number;
  }[];
  progresso?: number; 
};