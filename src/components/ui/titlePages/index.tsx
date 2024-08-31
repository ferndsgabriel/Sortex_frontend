interface titleProps{
    text:string;
    className?:string;
}

export default function Title({text, className}:titleProps){
    return(
        <h1 className={`w-full text-xl font-semibold float-start text-neutral-700 ${className}`}>
            {text}
        </h1>
    )
}