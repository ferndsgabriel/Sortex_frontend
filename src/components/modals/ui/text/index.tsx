import { BaseHTMLAttributes, ReactNode } from "react"

interface textProps extends BaseHTMLAttributes <HTMLDivElement>{
    children:ReactNode;
    className?:string;
}

export default function TextModal({children,className, ...rest}:textProps){
    return(
        <p className={`text-sm text-neutral-500 ${className}`} {...rest}>
            {children}
        </p>
    )
}