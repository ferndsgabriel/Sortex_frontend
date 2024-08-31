import { BaseHTMLAttributes, ReactNode } from "react"

interface textProps extends BaseHTMLAttributes <HTMLDivElement>{
    children:ReactNode;
    className?:string;
}

export default function TitleModal({children, className, ...rest}:textProps){
    return(
        <h2 className={`mb-4 text-xl font-semibold ${className}`} {...rest}>
            {children}
        </h2>
    )
}