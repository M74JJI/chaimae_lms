import { FormMessage } from "@/types";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { MdErrorOutline } from "react-icons/md";

function FormResponseMessage({ message, type }: FormMessage) {
  if (!message) return null;
  const errorClass = `
      bg-red-200/15 text-red-400
      `;
  const successClass = `
      bg-emerald-600/15 text-emerald-600
      `;

  return (
    <div
      className={`${type === "success" ? successClass : errorClass}
           px-2 py-1 text-sm rounded-md flex items-center  gap-x-3 
          `}
    >
      {type === "success" ? <IoCheckmarkCircleOutline /> : <MdErrorOutline />}
      <span>{message}</span>
    </div>
  );
}

export default FormResponseMessage;
