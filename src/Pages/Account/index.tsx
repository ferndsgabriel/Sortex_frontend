import Header from "../../components/header"
import { useCallback, useEffect, useState } from "react";
import { FaSpinner, FaRegCheckCircle  } from "react-icons/fa";
import { IoQrCodeSharp} from "react-icons/io5";
import { SetupApi } from "../../services";
import LoadingPage from "../../components/loading";
import {QRCodeSVG} from 'qrcode.react';
import ModalDeleteMp from "../../components/modals/account/deleteMP";

export default function Account (){
    const [loading, setLoading] = useState(true);
    const [loadingButton, setLoadingButton] = useState(false);
    const [cardId, setCardId] = useState <string | null>();
    const api = SetupApi();
    const [linkedAccount, setLinkedAccount] = useState('');

    const [isOpenDelete, setIsOpenDelete] = useState(false);

    const openDelete = useCallback(()=>{
        setIsOpenDelete(true);
    },[isOpenDelete]);

    const closeDelete = useCallback(()=>{
        setIsOpenDelete(false);
    },[isOpenDelete]);


    async function getAccount(){
        setLinkedAccount('');
        try {
            const response = await api.get('/account');
            setCardId(response.data)
        } catch (error) {   
            setCardId(null);
        }finally{
            setLoading(false);
        }
    }

    async function createQrCode() {
        setLoadingButton(true);
        try {
            const response = await api.get('/linksaller');
            setLinkedAccount(response.data.url); 
            console.log(linkedAccount)
        } catch (error) {
            console.log(error)
        }finally{
            setLoadingButton(false);
        }
    }
    
    useEffect(()=>{
        if (loading || !isOpenDelete){
            getAccount();
        }
    },[loading, isOpenDelete]);

    if (loading){
        return <LoadingPage/>
    }

    return(
        <>
            <Header/>
            <main className="flex flex-col items-center gap-24 p-4 containerAdaptative">
                <h1 className="self-start">Vincular conta</h1>
            
                {cardId?(
                    <section className="flex flex-col w-full max-w-lg gap-8 py-4 m-auto bg-white shadow-lg h-max">
                    <h2 className="text-2xl font-semibold">
                        Conta bancária vinculada
                    </h2>
                    <p className="text-lg text-neutral-500"
                    >Sua conta bancária foi vinculada com sucesso. Você pode desvinculá-la a qualquer momento.</p>
                    
                    <div className="flex items-center justify-between">
                        {!loadingButton?(
                            <button onClick={openDelete} 
                            className="font-semibold duration-200 text-maindark hover:text-main" 
                            type="submit">Desvincular </button>
                        ):(
                            <FaSpinner className="self-center text-xl text-main animate-spin"/>
                        )}

                        <span className="flex items-center gap-1"><FaRegCheckCircle/> Conta vinculada</span>
                    </div>

                </section>
                ):(
                    <section className="flex flex-col w-full max-w-lg gap-8 p-4 py-4 m-auto bg-white shadow-lg -500 h-max">
                        <h2 className="text-2xl font-semibold">
                            Vincule sua conta bancária do mercado pago
                        </h2>
                        <p className="text-lg text-neutral-500"
                        >Escaneie o código QR fornecido para vincular sua conta do mercado pago e começar a receber pagamentos de rifas</p>
                        
                        {linkedAccount && (
                            <div className="flex items-center justify-center w-full">
                                <QRCodeSVG value={linkedAccount}/>
                            </div>
                        )}
                        
                        {!loadingButton?(
                            <button onClick={createQrCode} 
                            className="flex items-center justify-center gap-4 p-3 font-semibold text-white duration-200 rounded-md bg-main hover:bg-maindark" 
                            type="submit"><IoQrCodeSharp/>Gerar QRcode</button>
                        ):(
                            <FaSpinner className="self-center text-xl text-main animate-spin"/>
                        )}
                    </section>
                )}

            </main>

            < ModalDeleteMp isOpen={isOpenDelete} closeModal={closeDelete}/>
        </>
    )
}