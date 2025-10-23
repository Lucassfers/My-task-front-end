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
      className=" cursor-pointer border-[#2A2D3A] hover:border-0 hover:bg-[#5633F0]/70
      transition-all duration-200 flex items-center justify-center p-3 rounded-[8px] min-h-[20px]">
      {criando ? (
        <input
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder="Nome da task..."
          className="w-full bg-transparent border-none outline-none font-medium"
          autoFocus
        />
      ) : (
        <span className="font-semibold text-sm">Adicionar uma Task</span>
        
      )}
    </div>
  );
}
