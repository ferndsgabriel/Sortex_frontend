import { ButtonHTMLAttributes, ReactNode } from "react"
import { FaSpinner } from "react-icons/fa";

interface buttonProps extends ButtonHTMLAttributes <HTMLButtonElement>{
    children:ReactNode;
    disabled:boolean;
    className?:string;
}

export default function ButtonConfirm({children,disabled, className,...rest}:buttonProps){

    if (disabled){
        return <FaSpinner className="text-xl cursor-not-allowed text-main animate-spin"/>
    }

    return(
        <button className={`px-4 py-2 font-semibold text-white duration-200 rounded bg-main hover:opacity-65 ${className}`}
        type="submit"
        disabled={disabled}
        {...rest}>
            {children}
        </button>
    )
}