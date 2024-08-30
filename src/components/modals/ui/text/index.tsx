import { BaseHTMLAttributes, ReactNode } from "react"

interface textProps extends BaseHTMLAttributes <HTMLDivElement>{
    children:ReactNode
}

export default function TextModal({children, ...rest}:textProps){
    return(
        <p className="text-sm text-neutral-500" {...rest}>
            {children}
        </p>
    )
}