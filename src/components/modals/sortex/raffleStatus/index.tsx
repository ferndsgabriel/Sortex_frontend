import Modal from "../../default"
import FormModalContainer from "../../ui/formContainer";
import TitleModal from "../../ui/titleModal";
import TextModal from "../../ui/text";
import ButtonsContainer from "../../ui/buttonsContainer";
import ButtonConfirm from "../../ui/buttonConfirm";
import ButtonCancel from "../../ui/buttonCancel";
import { FormEvent, useState } from "react";
import {toast} from "react-toastify";
import { SetupApi } from "../../../../services";
import { AxiosError } from "axios";


interface RaffleStatusProps{
    isOpen:boolean;
    closeModal:()=>void;
    status:boolean;
    id:string;
}


export default function RaffleStatusModal({isOpen, closeModal, status, id}:RaffleStatusProps){

    const [isLoadingButton, setIsLoadingButton] = useState(false);
    const api = SetupApi();

    async function changeStatus(e:FormEvent) {
        e.preventDefault();

        if (!id){
            toast.warning('Id não encontrado');
        }

        setIsLoadingButton(true);

        try {
            await api.put('/status',{
                id:id,
                status:status
            });
            toast.success('Status alterado com sucesso');
            closeModal();
        } catch (error:AxiosError | any) {
            toast.error(error.response.data.error || 'Erro ao alterar status');
        }finally{
            setIsLoadingButton(false);
        }
    }

    return (
        <Modal isOpen={isOpen} closeModal={closeModal}>
            <FormModalContainer onSubmit={changeStatus}>
                {status ? (
                    <>
                        <TitleModal>Ativar venda de rifas</TitleModal>
                        <TextModal>Ao ativar a venda de rifas, os participantes poderão comprá-las novamente. Lembre-se de atualizar a data de término, se necessário.</TextModal>
                    </>
                ):(
                    <>
                        <TitleModal>Desativar venda de rifas</TitleModal>
                        <TextModal>Ao desativar a venda de rifas, o sorteio estará pronto para ser iniciado.</TextModal>
                    </>
                )}
                <ButtonsContainer>
                    <ButtonConfirm disabled={isLoadingButton}>Confirmar</ButtonConfirm>
                    <ButtonCancel disabled={isLoadingButton} onClick={closeModal}>Cancelar</ButtonCancel>
                </ButtonsContainer>
            </FormModalContainer>
        </Modal>
    )

}