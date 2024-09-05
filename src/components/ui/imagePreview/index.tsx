import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { MdClose } from "react-icons/md";
import { useEffect } from "react";

interface PreviewProps {
    photos:string[];
    onClose:()=>void;
    isOpen:boolean;
}

export default function ImagePreview({photos, onClose, isOpen}:PreviewProps){

    const responsive = {
        mobile: {
            breakpoint: { max: 9999999999999, min: 0 },
            items: 1
        }
    };

    useEffect(()=>{
        function whatsClick(e:KeyboardEvent){
            if (e.key === 'Escape'){
                onClose();
            }else{
                return;
            }
        }
        document.addEventListener('keydown', whatsClick);

        return ()=> document.removeEventListener('keydown', whatsClick);
    },[document]);

    if (!isOpen){
        return null;
    }

    
    return(
        <>
            <div className="fixed top-0 left-0 z-50 block w-screen h-screen bg-black/80" onClick={onClose}>
                <button className="absolute top-0 right-0 p-6 text-2xl text-white"><MdClose/></button>
            </div>
                <Carousel responsive={responsive} 
                className="fixed z-50 w-full h-auto max-w-2xl -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                    {photos.map((item)=>{
                        return(
                            <img src={item} alt="fotos preview" 
                            className="object-contain object-center w-full h-auto p-2 "/>
                        )
                        
                    })}
                </Carousel>

        </>
    )
}