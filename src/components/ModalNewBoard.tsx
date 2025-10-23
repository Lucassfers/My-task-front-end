import { IoCloseSharp } from "react-icons/io5";
import type { ReactNode } from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children?: ReactNode;
};

export function ModalNewBoard({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 ">
      <div className="bg-[#1F2430] p-4 rounded-[10px] min-w-[320px] w-[30vw] h-[45vh] pl-[3rem]">
        <button
          onClick={onClose}
          className="ml-auto mb-2 block px-2 py-1"
        >
          <IoCloseSharp className="text-white w-[2rem] h-[2rem] cursor-pointer hover:text-[#5633F0] rounded-xl"/>
        </button>
        {children ?? <h1></h1>}
      </div>
    </div>
  );
}
