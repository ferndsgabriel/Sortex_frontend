import { BaseHTMLAttributes, ReactNode } from "react"

interface textProps extends BaseHTMLAttributes <HTMLDivElement>{
    children:ReactNode
}

export default function TitleModal({children, ...rest}:textProps){
    return(
        <h2 className="mb-4 text-xl font-semibold" {...rest}>
            {children}
        </h2>
    )
}