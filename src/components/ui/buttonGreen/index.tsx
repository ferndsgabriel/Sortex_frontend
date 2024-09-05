import { ButtonHTMLAttributes, ReactNode } from "react"
import { FaSpinner } from "react-icons/fa";

interface buttonProps  extends ButtonHTMLAttributes<HTMLButtonElement>{
    children: ReactNode;
    disabled:boolean;
    width?:string;
    className?:string;
    textColor?:string;
}

export default function ButtonGreen({children, disabled, width, className, textColor, ...rest}:buttonProps){

    if (disabled){
        return <FaSpinner className="self-center text-xl text-main animate-spin"/>
    }

    return(
        <button type='submit' disabled={disabled}
        className={`w-${width? width : ''} ${textColor? textColor : 'text-white'} p-3 font-semibold  duration-200 rounded-md bg-main hover:bg-maindark ${className}`}
        {...rest} >
            {children}
        </button>
    )
}
