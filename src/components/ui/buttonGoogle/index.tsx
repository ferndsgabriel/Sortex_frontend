import { ButtonHTMLAttributes, ReactNode } from "react"
import { FaSpinner } from "react-icons/fa"
import { FcGoogle } from "react-icons/fc"

interface buttonProps  extends ButtonHTMLAttributes<HTMLButtonElement>{
    children: ReactNode;
    disabled:boolean;
    width?:string;
    className?:string;
}

export default function ButtonGoogle({children, disabled, className, width, ...rest}:buttonProps){

    if (disabled){
        return <FaSpinner className="self-center text-xl text-main animate-spin"/>
    }
    return(
        <button type='button' disabled={disabled}  {...rest}
        className={`w-${width? width : ''} p-2 duration-200 border-2 border-solid rounded-md hover:border-neutral-500 border-neutral-200 ${className}`}>
        <div className="flex items-center w-full gap-4">
            < FcGoogle /> <span>{children}</span>
        </div>

        </button>
    )
}


