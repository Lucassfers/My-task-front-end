type NewListaProps = {
  onClick?: () => void;
}

export default function NewLista({ onClick }: NewListaProps) {
  return (
    <div 
      onClick={onClick}
      className="group bg-transparent border-2 border-dashed border-[#155fd6] cursor-pointer hover:border-[#3B82F6] 
      transition-all duration-200 flex items-center justify-center w-[15rem] h-[50vh] rounded-[8px] flex-shrink-0">
      <span className="text-[#155fd6] group-hover:text-[#3B82F6] font-semibold text-lg">+ Nova Lista</span>
    </div>
  );
}