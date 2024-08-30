import { AiOutlineLoading } from "react-icons/ai";



export default function LoadingPage(){
    return(
        <div className="fixed z-50 flex items-center justify-center w-full h-screen p-8">
            <AiOutlineLoading className="text-6xl animate-spin text-main"/>
        </div>
    )
}