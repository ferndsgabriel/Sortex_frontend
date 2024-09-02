import { FormEvent, FormHTMLAttributes, ReactNode } from "react"

interface FormModalProps extends FormHTMLAttributes <HTMLFormElement> { 
    children:ReactNode;
    onSubmit:(e:FormEvent)=>Promise<void>;
    className?:string;
}


export default function FormModalContainer({children, className, onSubmit, ...rest}:FormModalProps){
    return(
        <form onSubmit={onSubmit} {...rest} className={`z-50 fixed w-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-md px-3 py-4 bg-white ${className}`}>
            {children}
        </form>
    )
}