import { BaseHTMLAttributes, ReactNode } from "react"

interface ButtonsContainerProps extends BaseHTMLAttributes <HTMLDivElement>{
    children:ReactNode;

}

export default function ButtonsContainer({children, ...rest}:ButtonsContainerProps){
    return(
        <article {...rest} className="flex items-center justify-end w-full gap-4 pt-4 mt-4 border-t-2 border-neutral-300">
            {children}
        </article>
    )
}