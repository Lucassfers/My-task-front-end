import { Link } from "react-router-dom";
import type { BoardType } from "../utils/BoardType";


export function CardBoard({ data }: { data: BoardType }) {
  if (!data) return null;
  let corBarra = "#5633F0"; 
  if (data.motivo) {
    const motivoUpper = data.motivo.toUpperCase();
    if (motivoUpper === "TRABALHO") corBarra = "#2563EB";
    else if (motivoUpper === "ESTUDO") corBarra = "#5633F0";
    else if (motivoUpper === "PESSOAL") corBarra = "#D97706";
    else if (motivoUpper === "OUTRO") corBarra = "#19B205";
  }

  return (
    <Link to={`/boards/${data?.id}/listas/tasks/comentarios`} className="block">
      <div className="group w-full h-[120px] bg-[#1A1D26] rounded-lg hover:bg-[#1F2430] transition-colors cursor-pointer overflow-hidden flex border-[#2A2D3A] border-2">
        <div 
          className="w-2 flex-shrink-0" 
          style={{ backgroundColor: corBarra }}
        />
        
        <div className="flex-1 flex flex-col justify-between ">
          <div className="p-2">
            {data.motivo && (
              <span className="inline-block text-white text-xs font-medium px-2 py-1 rounded-md bg-[#2A2D3A]">
                {data.motivo}
              </span>
            )}
          </div>
          
        <div className="bg-[#0C0F15] py-2 mt-9 w-[20rem]">
            <h5 className="text-white font-semibold ml-4 ">
              {data.titulo}
            </h5>
          </div>  
        </div>
        
      </div>
      
    </Link>
  );
}
