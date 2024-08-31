import { ButtonHTMLAttributes, ReactNode } from "react"

interface buttonProps extends ButtonHTMLAttributes <HTMLButtonElement>{
    children:ReactNode;
    disabled:boolean;
    className?:string;
}

export default function ButtonCancel({children,disabled, className,...rest}:buttonProps){

    return(
        <button className={`px-4 py-2 font-semibold text-black duration-200 rounded bg-neutral-300 disabled:opacity-100 hover:opacity-65 ${className}`}
        type="reset"
        disabled={disabled}
        {...rest}>
            {children}
        </button>
    )
}