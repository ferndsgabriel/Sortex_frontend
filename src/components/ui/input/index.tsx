import { InputHTMLAttributes, useState, forwardRef } from "react";
import { AiOutlineEyeInvisible } from "react-icons/ai";
import { IoEyeSharp } from "react-icons/io5";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    text: string;
    type: string;
    className?: string;
}

function Input(props: InputProps, ref: React.Ref<HTMLInputElement>) {
    const { text, type, className = "", ...rest } = props;
    const [isVisible, setIsVisible] = useState(false);
    const [inputType, setInputType] = useState(type);

    function visibleInput() {
        setIsVisible(true);
        setInputType("text");
    }

    function inVisibleInput() {
        setIsVisible(false);
        setInputType(type);
    }

    return (
        <div className="w-full">
            <label className="flex flex-col w-full gap-2">
                <span className="font-bold">{text}</span>
                <input
                    className={`w-full p-2 border-2 border-solid rounded-md focus:border-solid focus:border-neutral-500 focus:border-2 border-neutral-200 placeholder:text-neutral-500 ${className}`}
                    type={inputType}
                    ref={ref}
                    {...rest}
                />
            </label>

            {type === "password" && (
                <>
                    {!isVisible ? (
                        <AiOutlineEyeInvisible onClick={visibleInput} className="mt-2 text-xl cursor-pointer" />
                    ) : (
                        <IoEyeSharp onClick={inVisibleInput} className="mt-2 text-xl cursor-pointer" />
                    )}
                </>
            )}
        </div>
    );
}

export default forwardRef(Input);
