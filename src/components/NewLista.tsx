type NewListaProps = {
  onClick?: () => void;
}

export default function NewLista({ onClick }: NewListaProps) {
  return (
    <div 
      onClick={onClick}
      className="group bg-transparent border-2 border-dashed border-[#5633F0] cursor-pointer hover:border-[#4B28D8] 
      transition-all duration-200 flex items-center justify-center w-[15rem] h-[50vh] rounded-[8px] flex-shrink-0">
      <span className="text-[#5633F0] group-hover:text-[#4B28D8] font-semibold text-lg">+ Nova Lista</span>
    </div>
  );
}