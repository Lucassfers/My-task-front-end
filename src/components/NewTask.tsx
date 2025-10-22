import { useState } from "react";

type NewTaskProps = {
  onCreateTask: (titulo: string) => void;
}

export default function NewTask({ onCreateTask }: NewTaskProps) {
  const [criando, setCriando] = useState(false);
  const [titulo, setTitulo] = useState("");

  function handleClick() {
    if (!criando) {
      setCriando(true);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && titulo.trim()) {
      onCreateTask(titulo);
      setTitulo("");
      setCriando(false);
    }
    if (e.key === 'Escape') {
      setTitulo("");
      setCriando(false);
    }
  }

  function handleBlur() {
    if (titulo.trim()) {
      onCreateTask(titulo);
    }
    setTitulo("");
    setCriando(false);
  }

  return (
    <div
      onClick={handleClick}
      className="group bg-transparent border-2 border-dashed border-[#5633F0] cursor-pointer hover:border-[#5633F0] 
      transition-all duration-200 flex items-center justify-center p-3 rounded-[8px] min-h-[20px]">
      {criando ? (
        <input
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder="Nome da task..."
          className="w-full bg-transparent border-none outline-none text-[#5633F0] placeholder-[#5633F0]/50 font-medium"
          autoFocus
        />
      ) : (
        <span className="text-[#5633F0] group-hover:text-[#5633F0] font-semibold text-sm">+ Nova Task</span>
      )}
    </div>
  );
}
