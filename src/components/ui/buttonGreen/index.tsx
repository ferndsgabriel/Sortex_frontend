import { ButtonHTMLAttributes, ReactNode } from "react"
import { FaSpinner } from "react-icons/fa"

interface buttonProps  extends ButtonHTMLAttributes<HTMLButtonElement>{
    children: ReactNode;
    disabled:boolean;
    width?:string;
    className?:string;
}

export default function ButtonGreen({children, disabled, width, className, ...rest}:buttonProps){

    if (disabled){
        return <FaSpinner className="self-center text-xl text-main animate-spin"/>
    }
    return(
        <button type='submit' disabled={disabled}
        className={`w-${width? width : ''} p-3 font-semibold text-white duration-200 rounded-md bg-main hover:bg-maindark ${className}`}
        {...rest} >
            {children}
        </button>
    )
}
