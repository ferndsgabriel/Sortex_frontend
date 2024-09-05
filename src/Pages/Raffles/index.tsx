import { useEffect, useState } from "react"
import { SetupApi } from "../../services";
import { useParams } from "react-router-dom";
import { FaInstagram} from "react-icons/fa";
import { FiYoutube, FiTwitch  } from "react-icons/fi";
import { RiTiktokLine } from "react-icons/ri";
import DateConverter from "../../utils/dateConverter";

import ImagePreview from "../../components/ui/imagePreview";
import ButtonGreen from "../../components/ui/buttonGreen";
import LoadingPage from "../../components/loading";
import BuyRafflesModal from "../../components/modals/raffles/buyRaffles";

interface raffleProps{
    creator:{
        name:string;
        photo:string;
    },
    socials:{
        instagram:string;
        youtube:string;
        twitch:string;
        tiktok:string;
    },
    product:{
        name:string;
        description:string;
        photos:string[]
    },
    sortex:{
        _id:string;
        title:string;
        description:string;
        price:number;
        rafflesStatus:boolean;
        sortexStatus:boolean;
        dateStart:Date;
        dateFinish:Date;
    }
}

export default function Raffles(){
    
    const {id} = useParams();
    const [loading, setLoading] = useState(true);
    const api = SetupApi();
    const [raffle, setRaffle] = useState <raffleProps | null>(null);
    const [isOpenPreview, setIsOpenPreview] = useState(false);
    const [isOpenRaffles, setIsOpenRaffles] = useState(false);

    useEffect(()=>{
        
        async function getRaffle(){
            try {
                const response = await api.get('/raffle',{
                    params:{
                        id:id
                    }
                });
                setRaffle(response.data);
            } catch (error) {
                console.log(error);
                setRaffle(null);
            }finally{
                setLoading(false);
            }
        }
        getRaffle();
    },[]);

    function openPreview(){
        setIsOpenPreview(true);
    }

    function closePreview(){
        setIsOpenPreview(false);
    }

    function openBuyRaffles(){
        setIsOpenRaffles(true);
    }

    function closeBuyRaffles(){
        setIsOpenRaffles(false);
    }

    if (loading){
        return <LoadingPage/>
    }
    
    return(
        <>
            {raffle ? (
                <main className="w-full p-12">
                    <div className="flex flex-col items-center justify-center w-full gap-4 m-auto mb-12 text-center">
                        <h1 className="text-4xl font-semibold">{raffle.sortex.title}</h1>
                        <p className="w-full max-w-3xl text-lg text-neutral-500 text-wrap">{raffle.sortex.description}</p>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-5 lg:gap-16">

                        <section className="self-start w-full h-full overflow-hidden rounded lg:col-start-1 lg:col-end-3" onClick={openPreview}>
                            {raffle.product.photos.length  > 0 &&(
                                <img src={raffle.product.photos[0]} alt="foto do produto"
                                className="object-cover object-center w-full h-full duration-200 cursor-pointer aspect-video hover:scale-110" />
                            )}
                        </section>  

                        <section  className="flex flex-col w-full gap-4 lg:col-start-3 lg:col-end-6 ">
                            <h2 className="text-xl font-semibold">{raffle.product.name}</h2>
                            <p className="text-neutral-500">{raffle.product.description}</p>
    
                            <article className="w-full">

                                {raffle.sortex.rafflesStatus ?(
                                    <p className="mb-4"><b className="text-red-700">Atenção: a venda de rifas se encerra em: </b>{DateConverter(raffle.sortex.dateFinish)}</p>
                                ):(
                                    raffle.sortex.sortexStatus ? (
                                        <p className="mb-4"><b className="text-red-700">Atenção: as vendas de rifas foram encerradas, mas o sorteio ainda não ocorreu.</b></p>
                                    ):(
                                        <p className="mb-4"><b className="text-red-700">Sorteio encerrado, vencedor já foi definido.</b></p>
                                    )
                                )}
                                
                                
                                <div className="flex items-start justify-between w-full gap-2">
                                    <div>
                                        <p className="mb-2 text-lg font-semibold text-neutral-500">Proprietário do sorteio:</p>
                                        <div className="flex items-center gap-4">
                                            {raffle.creator.photo && (
                                                <img src={raffle.creator.photo} alt={raffle.creator.name} className="object-cover w-10 rounded-full aspect-square"/>
                                            )}
                                            <p className="font-semibold">{raffle.creator.name}</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2 mt-6 text-3xl duration-200 text-neutral-500 md:flex-row">
                                        {raffle.socials.instagram &&(
                                            <a className="hover:text-black" href={raffle.socials.instagram} target="_blank"><FaInstagram/></a>
                                        )}
                                        {raffle.socials.youtube &&(
                                            <a className="hover:text-black" href={raffle.socials.youtube} target="_blank"><FiYoutube/></a>
                                        )}
                                        {raffle.socials.tiktok &&(
                                            <a className="hover:text-black" href={raffle.socials.tiktok} target="_blank"><RiTiktokLine/></a>
                                        )}
                                        {raffle.socials.twitch &&(
                                            <a className="hover:text-black" href={raffle.socials.twitch} target="_blank"><FiTwitch/></a>
                                        )}
                                    </div>
                                </div>
                            </article>
                            
                            <div className="flex items-center w-full m-auto mt-4">
                                {raffle.sortex.rafflesStatus?(
                                    <ButtonGreen onClick={openBuyRaffles} 
                                    className="w-full" disabled={false}>Comprar rifas</ButtonGreen>
                                ):(
                                    raffle.sortex.sortexStatus && (
                                        <ButtonGreen disabled={false}
                                        className="w-full cursor-not-allowed bg-neutral-500 hover:bg-neutral-500">
                                        Vendas encerradas
                                        </ButtonGreen>
                                    )
                                )}
                            </div>
                        </section>
                    </div>
                
                </main>
            ):null
            }
            {raffle && (
                <>
                    <ImagePreview photos={raffle.product.photos} isOpen={isOpenPreview} onClose={closePreview}/>
                    <BuyRafflesModal isOpen={isOpenRaffles} closeModal={closeBuyRaffles} 
                    price={raffle.sortex.price} sorteioId={raffle.sortex._id}/>
                </>

            )}
            
            
        </>
    )
    
}