import { FormEvent, useState } from "react";
import Modal from "../../default";
import { SetupApi } from "../../../../services";
import {toast} from "react-toastify";

import FormModalContainer from "../../ui/formContainer";
import TitleModal from "../../ui/titleModal";
import TextModal from "../../ui/text";
import ButtonsContainer from "../../ui/buttonsContainer";
import ButtonConfirm from "../../ui/buttonConfirm";
import ButtonCancel from "../../ui/buttonCancel";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

interface modalProps{
    closeModal: ()=>void;
    isOpen:boolean;
    id:string;
}

export default function ModalDeleteProduct({isOpen, closeModal, id}:modalProps){
    const navigate = useNavigate();
    const api = SetupApi();
    const [isLoading, setIsLoading] = useState(false);

    async function handleDelete(e:FormEvent){
        e.preventDefault();

        setIsLoading(true);
        try {
            await api.delete(`/produto/${id}`);
            toast.success("Produto deletado com sucesso");   
            navigate('/products');
        } catch (error:AxiosError | any) {
            toast.error(error.response.data.error);
        }finally{
            setIsLoading(false);
            closeModal();
        }
    }

    return(
        <Modal isOpen={isOpen} closeModal={closeModal}> 
            <FormModalContainer onSubmit={handleDelete}>
                <TitleModal>Deletar produto</TitleModal>
                <TextModal>Tem certeza de que deseja deletar o produto? Ele não poderá mais ser usado em sorteios.</TextModal>

                <ButtonsContainer>
                    <ButtonConfirm disabled={isLoading}>
                        Confirmar
                    </ButtonConfirm>
                    <ButtonCancel disabled={isLoading} onClick={closeModal}>
                        Cancelar
                    </ButtonCancel>
                </ButtonsContainer>
            </FormModalContainer>
        </Modal>
    )
}