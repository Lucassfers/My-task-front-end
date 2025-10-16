import { useState } from "react";
import { ModalNewBoard } from "./ModalNewBoard";
import { useUsuarioStore } from "../context/UsuarioContext";

const apiUrl = import.meta.env.VITE_API_URL;


function NewBoard({ onClick }: { onClick?: () => void }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [boardName, setBoardName] = useState("");
  const [boardMotivo, setBoardMotivo] = useState("TRABALHO");
  const [isLoading, setIsLoading] = useState(false);
  
  const { usuario } = useUsuarioStore();

  const handleClick = () => {
    setIsModalOpen(true);
    onClick?.();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setBoardName("");
    setBoardMotivo("TRABALHO");
  };

  const handleCreateBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!boardName.trim()) {
      alert("Por favor, digite o nome do board");
      return;
    }

    if (!usuario.id) {
      alert("Usuário não está logado");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${apiUrl}/boards`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          titulo: boardName,
          motivo: boardMotivo,
          usuarioId: usuario.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao criar board");
      }

      const data = await response.json();
      console.log("Board criado com sucesso:", data);
      
      handleCloseModal();
      
      window.location.reload();
      
    } catch (error) {
      console.error("Erro ao criar board:", error);
      alert("Erro ao criar board. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div 
        className="group w-full h-[10rem] bg-transparent border-2 border-dashed border-[#155fd6] rounded-[4px] cursor-pointer hover:border-[#3B82F6] transition-all duration-200 flex items-center justify-center"
        onClick={handleClick}
      >
        <div className="text-center">
          <span className="text-[#155fd6] group-hover:text-[#3B82F6] font-medium text-lg hover:text-xl transition-all duration-200">
            Adicionar
          </span>
        </div>
      </div>
      
      <ModalNewBoard isOpen={isModalOpen} onClose={handleCloseModal}>
        <div>
          <form onSubmit={handleCreateBoard}>
            <h2 className="text-2xl font-bold mb-6 text-[#3B82F6] text-start">Criar Novo Board</h2>
            
            <div className="mb-6">
              <label htmlFor="boardName" className="block text-sm font-medium text-gray-700 mb-2 text-start">
                Nome do Board
              </label>
              <div className="flex justify-center pr-8">
                <input
                  type="text"
                  id="boardName"
                  value={boardName}
                  onChange={(e) => setBoardName(e.target.value)}
                  className="border rounded-md p-2 w-[100%] border-b-2 border-blue-500 focus:outline-none"
                  placeholder="Digite o nome do board"
                  required
                />
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="opcoes" className="block text-sm font-medium text-gray-700 mb-2 text-start">
                Escolha o Motivo do Board
              </label>
              <div className="flex justify-center pr-8">
                <select 
                  name="opcoes" 
                  id="opcoes" 
                  value={boardMotivo}
                  onChange={(e) => setBoardMotivo(e.target.value)}
                  className="border rounded-md p-2 w-[100%] border-b-2 border-blue-500 focus:outline-none"
                >
                  <option value="TRABALHO">Trabalho</option>
                  <option value="ESTUDO">Estudos</option>
                  <option value="PESSOAL">Pessoal</option>
                  <option value="OUTRO">Outros</option>
                </select>
              </div>
            </div>

            <div className="flex justify-center mt-8 pr-8">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-[#3B82F6] text-white px-[40%] py-2 rounded-md hover:bg-[#2563eb] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isLoading ? "Criando..." : "Criar Board"}
              </button>
            </div>
          </form>
        </div>
      </ModalNewBoard>
    </>
  );
}

export default NewBoard;