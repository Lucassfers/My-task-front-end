function NewBoard({ onClick }: { onClick?: () => void }) {
  return (
    <div 
      className="group w-full h-[10rem] bg-transparent border-2 border-dashed border-[#155fd6] rounded-[4px] cursor-pointer hover:border-[#3B82F6] transition-all duration-200 flex items-center justify-center"
      onClick={onClick}
    >
      <div className="text-center">
        <span className="text-[#155fd6] group-hover:text-[#3B82F6] font-medium text-lg hover:text-xl transition-all duration-200">
          Adicionar
        </span>
      </div>
    </div>
  );
}

export default NewBoard;