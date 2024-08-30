import { FormEvent, FormHTMLAttributes, ReactNode } from "react"

interface FormModalProps extends FormHTMLAttributes <HTMLFormElement> { 
    children:ReactNode;
    onSubmit:(e:FormEvent)=>Promise<void>;
}


export default function FormModalContainer({children, onSubmit, ...rest}:FormModalProps){
    return(
        <form onSubmit={onSubmit} {...rest}>
            {children}
        </form>
    )
}