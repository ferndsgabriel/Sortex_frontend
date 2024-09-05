import { useState } from "react"
import { FaAngleDown, FaAngleUp } from "react-icons/fa";

// Interface para o produto
interface Product {
    name: string;
    _id:string;
}

interface SelectProps {
    itens: Product[];
    text:string;
    setProduct:any;
    failedMessage:string;
}


export default function Select({itens, text, setProduct, failedMessage}:SelectProps){

    function changeOption(index:number){
        setSelected(index);
        setIsOpenSelect(false);
    }

    const [isOpenSelect, setIsOpenSelect] = useState(false);
    const [selected, setSelected] = useState(0);

    setProduct(itens[selected]);

    return(
        <div className="flex flex-col w-full gap-2">
            <span className="font-bold">{text}</span>

            {itens && itens.length > 0 ?(
                <div className="relative w-full">
                    
                    <button type="button" onClick={()=>setIsOpenSelect(!isOpenSelect)}
                    className={`${isOpenSelect ? 'shadow-md shadow-neutral-400' : 'border-neutral-200'} rounded-md flex items-center justify-between w-full p-2 border-2 border-solid`}>
                        {itens[selected].name}
                        {isOpenSelect ?(
                            <FaAngleUp/>
                        ):(
                            <FaAngleDown/>
                        )}
                    </button>

                    {isOpenSelect ? (
                        <div className="absolute z-10 w-full p-2 mt-2 bg-white border-2 border-solid rounded shadow-md shadow-neutral-400">
                            {itens?.map((item, index)=>{
                                return(
                                    <button type="button" onClick={()=>changeOption(index)} key={item._id}
                                    className={`flex items-center justify-between w-full p-2 border-solid rounded cursor-pointer focus:border-solid border-neutral-500 ${index == selected ? 'bg-mainLight2' : ' hover:bg-mainLight'}`}>
                                        <p className="text-sm text-neutral-700">{item.name}</p>
                                    </button>
                                )
                            })}
                        </div>
                    ):null}
                </div>
            ):(
                <div className="flex items-center justify-between w-full p-2 border-2 border-solid rounded-md ">
                    <span className="text-neutral-500">{failedMessage}</span>
                </div>    
            )}
        </div>
    )
}