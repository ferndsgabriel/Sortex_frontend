import { ReactNode, useEffect } from "react";

interface modalProps{
    children:ReactNode;
    closeModal:()=>void;
    isOpen:boolean
}


export default function Modal({isOpen, children, closeModal}:modalProps){

    useEffect(()=>{
        function whatsClick(e:KeyboardEvent){
            if (e.key === 'Escape'){
                closeModal();
            }else{
                return;
            }
        }
        document.addEventListener('keydown', whatsClick);

        return ()=> document.removeEventListener('keydown', whatsClick);
    },[document]);

    if (!isOpen){
        return;
    }

    return(
        <>
            <div className="fixed top-0 left-0 z-50 w-full h-screen p-8 bg-black opacity-30" onClick={closeModal}/> 
            
            <div className="fixed z-50 w-full max-w-md px-3 py-4 -translate-x-1/2 -translate-y-1/2 bg-white h top-1/2 left-1/2">
                {children}
            </div>
        </>
    )
}