import { BaseHTMLAttributes, ReactNode } from "react";

interface ContainerProps extends BaseHTMLAttributes <HTMLDivElement>{
    children:ReactNode;
    className?:string;
}

export default function ContainerPages({children, className}:ContainerProps){
    return(
        <main 
        className={`p-6 mt-16 containerAdaptative lg:w-[calc(100% - 320px)] lg:ml-80 lg:mt-0 lg:px-14 ${className}`}>
            {children}
        </main>
    )
}

