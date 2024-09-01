import {forwardRef, TextareaHTMLAttributes } from "react";


interface TextAreaProps extends TextareaHTMLAttributes <HTMLTextAreaElement> {
    text: string;
    className?:string;
}



function Input(props: TextAreaProps, ref: React.Ref<HTMLTextAreaElement>) {
    const { text, ...rest } = props;
    
    return (
        <div>
            <label className="flex flex-col gap-2">
                <span className="font-bold">{text}</span>
                <textarea
                className={`p-2 border-2 border-solid rounded-md focus:border-solid focus:border-neutral-500 focus:border-2 min-h-40 border-neutral-200 placeholder:text-neutral-500 ${props.className}`}
                ref={ref}
                {...rest}
                />
            </label>
        </div>
    );
}
export default forwardRef(Input);
