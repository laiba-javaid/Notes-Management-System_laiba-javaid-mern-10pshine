import React, { useEffect } from 'react'
import { LuCheck } from 'react-icons/lu'
import { MdDeleteOutline } from 'react-icons/md';

interface ToastProps {
  isShown: boolean;
  message: string;
  type: "success" | "error" | "delete";
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ isShown, message, type, onClose }) => {

useEffect(() => {
    const timeOutId=setTimeout(() => {
        onClose();
    },3000);
    return () => {
        clearTimeout(timeOutId);
    }
}, [isShown, onClose]);


  return (
    <div
    className={`absolute top-20 right-6 transition-all duration-400 ${
      isShown ? "opacity-100" : "opacity-0"
    }`}>
      
        <div className={`min-w-52 bg-white border shadow-2xl rounded-md relative after:w-[5px] after:h-full after:absolute after:left-0 after:top-0 after:rounded-l-lg ${type === "success" ? "after:bg-green-500" : "after:bg-red-500"}`}>

        
        <div className='flex items-center gap-3 py-2 px-4'>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${type === "success" ? "bg-green-100" : "bg-red-500"}`}>

                {type === "success" ?
                (<LuCheck className="text-xl text-green-500" />)

            :
                (<MdDeleteOutline className='text-xl text-red-500'/>)                
            }
                
            </div>
            <p className='text-sm text-slate-800'>{message}</p>
            </div>
        </div>
    </div>
  )
}

export default Toast