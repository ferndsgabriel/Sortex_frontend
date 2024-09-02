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
            <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-screen p-8 bg-black opacity-30" onClick={closeModal}/> 
            {children}
        </>
    )
}