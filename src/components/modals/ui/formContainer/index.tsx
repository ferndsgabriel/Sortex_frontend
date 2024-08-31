import { FormEvent, FormHTMLAttributes, ReactNode } from "react"

interface FormModalProps extends FormHTMLAttributes <HTMLFormElement> { 
    children:ReactNode;
    onSubmit:(e:FormEvent)=>Promise<void>;
    className?:string;
}


export default function FormModalContainer({children, className, onSubmit, ...rest}:FormModalProps){
    return(
        <form onSubmit={onSubmit} {...rest} className={`${className}`}>
            {children}
        </form>
    )
}