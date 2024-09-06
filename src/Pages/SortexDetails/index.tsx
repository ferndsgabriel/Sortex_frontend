import { useCallback, useEffect, useState } from "react"
import { SetupApi } from "../../services";
import { useParams } from "react-router-dom";

import ImagePreview from "../../components/ui/imagePreview";
import ButtonGreen from "../../components/ui/buttonGreen";
import LoadingPage from "../../components/loading";
import ContainerPages from "../../components/ui/containerPages";
import Header from "../../components/header";
import RaffleStatusModal from "../../components/modals/sortex/raffleStatus";


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

export default function SortexDetails(){
    
    const {id} = useParams();
    const [loading, setLoading] = useState(true);
    const api = SetupApi();
    const [raffle, setRaffle] = useState <raffleProps | null>(null);
    const [isOpenPreview, setIsOpenPreview] = useState(false);
    const [isOpenRafflesStatus, setIsOpenRafflesStatus] = useState(false);
    const [raffleStatus, setRaffleStatus] = useState(false);


    const openRaflesStatus = useCallback((value:boolean)=>{
        setRaffleStatus(value);
        setIsOpenRafflesStatus(true);
    },[isOpenRafflesStatus]);

    const closeRaflesStatus = useCallback(()=>{
        setIsOpenRafflesStatus(false);
    },[isOpenRafflesStatus]);

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

    },[ closeRaflesStatus]);

    function openPreview(){
        setIsOpenPreview(true);
    }

    function closePreview(){
        setIsOpenPreview(false);
    }

    function formatToBRL(value: number) {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    }

    if (loading){
        return <LoadingPage/>
    }


    return(
        <>
            <ContainerPages>
            <Header/>
            {raffle ? (
                <>
                    <div className="flex flex-col items-center justify-center w-full gap-4 m-auto mb-12 text-center">
                        <h1 className="text-3xl font-semibold">{raffle.sortex.title}</h1>
                        <p className="w-full max-w-3xl text-neutral-500 text-wrap">{raffle.sortex.description}</p>
                    </div>

                    <div className="grid gap-4 xl:grid-cols-5 xl:gap-16">

                        <section className="self-start w-full h-full overflow-hidden rounded xl:col-start-1 xl:col-end-3" onClick={openPreview}>
                            {raffle.product.photos.length  > 0 &&(
                                <img src={raffle.product.photos[0]} alt="foto do produto"
                                className="object-cover object-center w-full h-full duration-200 cursor-pointer aspect-video hover:scale-110" />
                            )}
                        </section>  

                        <section  className="flex flex-col w-full gap-4 xl:col-start-3 xl:col-end-6 ">
                            <h2 className="text-xl font-semibold">{raffle.product.name}</h2>
                            <p className="text-sm text-neutral-500">{raffle.product.description}</p>
                            
                            <div>
                                <h3 className="text-2xl font-semibold">Informações da Rifa</h3>
                                <div className="flex items-start justify-between w-full">
                                    <div>
                                        <p className="text-lg text-neutral-500">Valor da Rifa:</p>
                                        <p className="text-lg font-semibold">{formatToBRL(raffle.sortex.price)}</p>
                                    </div>
                                    <div>
                                        <p className="text-lg text-neutral-500">Rifas Vendidas:</p>
                                        <p className="text-lg font-semibold">12345</p>
                                    </div>
                                </div>
                            </div>

                            
                            <div className="flex items-center w-full m-auto mt-4">
                                {raffle.sortex.sortexStatus ? (
                                    <div className="w-full">
                                        {raffle.sortex.rafflesStatus?(
                                            <ButtonGreen 
                                            onClick={()=>openRaflesStatus(false)}
                                            className="w-full" disabled={false}>
                                            Desativar vendas de rifas
                                            </ButtonGreen>
                                        ):(
                                            raffle.sortex.sortexStatus && (
                                                <ButtonGreen disabled={false}
                                                onClick={()=>openRaflesStatus(true)}
                                                className="w-full">
                                                Ativar vendas de rifas
                                                </ButtonGreen>
                                            )
                                        )}
                                        <ButtonGreen disabled={false} className="w-full mt-2 text-black bg-white border-2 border-neutral-300 hover:bg-neutral-200" 
                                        textColor="text-black">Editar Informações</ButtonGreen>
                                    </div>
                                ):(
                                    <ButtonGreen disabled={false} className="w-full bg-red-600 hover:bg-red-500">Excluir Sorteio</ButtonGreen>
                                )}
                                
                            </div>
                        </section>
                    </div>
                </>
            ):null
            }
            {raffle && (
                <>
                    <ImagePreview photos={raffle.product.photos} isOpen={isOpenPreview} onClose={closePreview}/>
                    
                    <RaffleStatusModal isOpen={isOpenRafflesStatus} id={raffle.sortex._id} 
                    closeModal={closeRaflesStatus} status={raffleStatus}/>
                </>

            )}
            
            </ContainerPages>
        </>
    )
    
}