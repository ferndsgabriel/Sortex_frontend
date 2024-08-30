import { FormEvent, useState } from "react";
import Modal from "../../default";

import FormModalContainer from "../../ui/formContainer";
import TitleModal from "../../ui/titleModal";
import TextModal from "../../ui/text";
import ButtonsContainer from "../../ui/buttonsContainer";
import ButtonConfirm from "../../ui/buttonConfirm";
import ButtonCancel from "../../ui/buttonCancel";

interface modalProps{
    closeModal: ()=>void;
    isOpen:boolean;
}

export default function ModalDeleteMp({isOpen, closeModal}:modalProps){
    const [isLoading, setIsLoading] = useState(false);

    async function handleDelete(e:FormEvent){
        e.preventDefault();
    }

    return(
        <Modal isOpen={isOpen} closeModal={closeModal}> 
            <FormModalContainer onSubmit={handleDelete}>
                <TitleModal>Desvincular conta</TitleModal>
                <TextModal>Ao desvincular sua conta, não será mais possível realizar sorteios.</TextModal>

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