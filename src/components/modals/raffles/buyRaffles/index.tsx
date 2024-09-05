import { IoCloseSharp } from "react-icons/io5";
import Modal from "../../default";
import FormModalContainer from "../../ui/formContainer";
import TitleModal from "../../ui/titleModal";
import Input from "../../../ui/input";
import { FormEvent, useEffect, useState } from "react";
import ButtonGreen from "../../../ui/buttonGreen";
import ButtonsContainer from "../../ui/buttonsContainer";
import FormatPhoneNumber from "../../../../utils/formatPhone";
import {toast} from "react-toastify";
import isEmail from "validator/lib/isEmail";
import validator from "validator";
import { SetupApi } from "../../../../services";
import { AxiosError } from "axios";
import Confetti from 'react-confetti';

interface RafflesProps {
    isOpen: boolean;
    closeModal: () => void;
    price: number;
    sorteioId:string
}

export default function BuyRafflesModal({ isOpen, closeModal, price, sorteioId }: RafflesProps) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [number, setNumber] = useState('');
    const [qtd, setQtd] = useState<number | "">(1); 
    const [loadingButton, setLoadingButton] = useState(false);
    const api = SetupApi();
    const [link, setLink] = useState('');
    const [animation, setAnimation] = useState(false);

    function formatToBRL(value: number) {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    }

    function handleQuantityChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value;

        if (value === "") {
            setQtd("");
        } else {
            const parsedValue = parseInt(value, 10);
            if (!isNaN(parsedValue) && parsedValue >= 1) {
                setQtd(parsedValue);
            } else {
                setQtd(""); 
            }
        }
    }
    
    const total = (qtd === "" ? 0 : qtd) * price;

    function formatPhone(event: React.ChangeEvent<HTMLInputElement>){
        setNumber(FormatPhoneNumber(event));
    }

    async function handleLink(e:FormEvent) {
        e.preventDefault();

        if (typeof qtd === 'number'){
            if (!(name || email || number) || qtd < 1){
                toast.warning('Preencha todos os campos');
                return;
            }
        }else{
            toast.warning('Quantidade invlálida');
            return;
        }

        if (!isEmail(email)){
            toast.warning('Digite um e-mail válido');
            return;
        }

        if (!validator.isMobilePhone(number, 'pt-BR')){
            toast.warning('Digite um número válido');
            return;
        }

        setLoadingButton(true);
        setAnimation(false);
        try {
            const response = await api.post('/pagamento',{
                name:name,
                email:email.toLowerCase().trim(),
                whatsapp:number,
                sorteioId:sorteioId,
                qtd:qtd
            });
            const url = response.data.url;
            setAnimation(true);
            setLink(url);
            window.open(url, '_blank');
        } catch (error:AxiosError | any) {
            console.log(error);
            toast.error(error.response.data.error || "Erro ao gerar link de pagamento")
        }finally{
            setLoadingButton(false);
        }
    }

    useEffect(()=>{
        if (!isOpen){
            setName('');
            setEmail('');
            setNumber('');
            setQtd(1);
            setAnimation(false);
            setLink('');
        }
    },[closeModal]);

    return (
        <>
        <Modal isOpen={isOpen} closeModal={closeModal}>
                <FormModalContainer onSubmit={handleLink}
                className="max-w-xl p-6">
                    <div className="flex items-start justify-between w-full">
                        <TitleModal>
                            Gerar link de pagamento
                        </TitleModal>
                        <button type="button" 
                        onClick={closeModal} className="text-xl duration-200 text-neutral-500 hover:text-black">
                            <IoCloseSharp />
                        </button>
                    </div>
                    <div className="flex flex-col gap-4 p-2 mt-4">
                        <Input value={name} onChange={(e)=>setName(e.target.value)} required={true} min={10} max={80} 
                        className="border-neutral-300" text="Nome completo" type="text" placeholder="Digite seu nome completo" />
                        
                        <Input value={email} onChange={(e)=>setEmail(e.target.value)} required={true} min={10} max={100} 
                        className="border-neutral-300" text="E-mail" type="text" placeholder="Digite seu e-mail" />

                        <Input value={number} onChange={formatPhone} required={true} min={10} max={80}  
                        className="border-neutral-300" text="Número de Whatsapp" type="text" placeholder="Ex: (11)90000-0000" />
                        
                        
                        <Input value={qtd} onChange={handleQuantityChange} min={1} required={true}
                            className="border-neutral-300" text="Quantidade de rifas" type="number" placeholder="Quantidade de rifas" />
                        
                        <div className="flex items-start justify-between">
                            <p className="text-neutral-500">Valor total: {formatToBRL(total)}</p>

                            {link &&(
                                <a href={link} target="_blank" className="text-blue-600 underline">Link de pagamento</a>
                            )}
                            
                        </div>

                    </div>
                    <ButtonsContainer>
                        <ButtonGreen disabled={loadingButton} className="w-full"
                        >Gerar link</ButtonGreen>
                    </ButtonsContainer>

                </FormModalContainer>
        </Modal>
        {animation &&(
            <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            />
        )}
        </>
    );
}
