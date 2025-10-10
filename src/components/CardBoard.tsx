import { Link } from "react-router-dom";
import type { BoardType } from "../utils/BoardType";


export function CardBoard({ data }: { data: BoardType }) {

  let motivoColor = "#3B82F6";
  if (data.motivo && data.motivo.toUpperCase() === "TRABALHO") {
    motivoColor = "bg-color-[#FACC16]";
  } else if (data.motivo && data.motivo.toUpperCase() === "ESTUDO") {
    motivoColor = "bg-color-[#3faafb]";
  } else if (data.motivo && data.motivo.toUpperCase() === "PESSOAL") {
    motivoColor = "bg-color-[#D2B48C]";
  } else if (data.motivo && data.motivo.toUpperCase() === "OUTRO") {
    motivoColor = "bg-color-[#808080]";
  }
  if (!data) return null;
  return (

    <div className={`group w-full h-[10rem] bg-[#FFFFFF] rounded-lg  hover:shadow-gray-400 shadow-md`}>
      <div className="p-4">
        <div className=" items-center  gap-3 col">
          <h5 className={`text-black pb-1 text-xl font-bold tracking-tight line-clamp-1  w-[16.5rem]`}>
            {data.titulo}
          </h5>

          {data.motivo && (
            <span className={`text-white bg-[#F59E0B] py-1 px-2 rounded-md text-xs font-medium mt-[2rem]`}>
              {data.motivo}
            </span>
          )}
        </div>

        {/* <div className="mt-3 h-2 w-full rounded-full bg-[#3B82F6] dark:bg-gray-700">
          <div
            className="h-2 rounded-full bg-[#3B82F6] transition-all"
            style={{ width: `${Math.max(0, Math.min(100, data?.progresso ?? 0))}%` }}
          />
        </div> */}

        {data?.updatedAt && (
          <p className="mt-3 text-xs text-gray-400">
            Atualizado em {new Date(data.updatedAt).toLocaleDateString("pt-BR")}
          </p>
        )}

        <Link
          to={`/boards/${data?.id}/listas/tasks/comentarios`}
          className={`text-white bg-[#3B82F6] mt-10 inline-flex items-center px-3 py-2 text-sm font-medium  white rounded-lg focus:ring-2 duration-1000`}
        >
          Abrir board
          <svg
            className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 5h12m0 0L9 1m4 4L9 9"
            />
          </svg>
        </Link>
      </div>
    </div >
  );
}
