import Header from "../../components/header"
import { useCallback, useEffect, useState } from "react";
import { FaSpinner, FaRegCheckCircle  } from "react-icons/fa";
import { SetupApi } from "../../services";
import LoadingPage from "../../components/loading";
import {QRCodeSVG} from 'qrcode.react';

import ModalDeleteMp from "../../components/modals/account/deleteMP";

import ButtonGreen from "../../components/ui/buttonGreen";
import ContainerPages from "../../components/ui/containerPages";
import Title from "../../components/ui/titlePages";

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
            <ContainerPages>

                <Title text="Vincular conta"/>
                
                {cardId?(
                    <section className="flex flex-col w-full max-w-xl gap-8 p-4 py-4 m-auto border-2 rounded shadow-lg mt-36 h-max boder-solid border-neutral-200">
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
                    <section className="flex flex-col w-full max-w-xl gap-8 p-4 py-4 m-auto border-2 rounded shadow-lg mt-36 h-max boder-solid border-neutral-200">
                        <h2 className="text-2xl font-semibold">
                            Vincule sua conta bancária do mercado pago
                        </h2>
                        <p className="text-lg text-neutral-500"
                        >Escaneie o código QR fornecido para vincular sua conta do mercado pago e começar a receber pagamentos de rifas</p>
                        
                        {linkedAccount && (
                            <div className="flex flex-col items-center justify-center w-full gap-2">
                                <QRCodeSVG value={linkedAccount}/>

                                <a target="_blank" className="text-xl text-blue-500 underline" href={linkedAccount}>Acessar link</a>
                            </div>
                        )}
                        
                        
                        <ButtonGreen onClick={createQrCode} disabled={loadingButton}>
                            Gerar QRcode
                        </ButtonGreen>
                        
                    </section>
                )}

            </ContainerPages>

            < ModalDeleteMp isOpen={isOpenDelete} closeModal={closeDelete}/>
        </>
    )
}