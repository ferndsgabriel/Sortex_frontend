import Modal from "../../default";
import { MdContentCopy } from "react-icons/md";
import FormModalContainer from "../../ui/formContainer";
import TitleModal from "../../ui/titleModal";
import TextModal from "../../ui/text";
import ButtonsContainer from "../../ui/buttonsContainer";
import ButtonCancel from "../../ui/buttonCancel";


interface modalProps{
    closeModal: ()=>void;
    isOpen:boolean;
    id:string;
}

export default function ModalGetLink({isOpen, closeModal, id}:modalProps){
    const url = window.location.origin;
    const address = `${url}/raffles/${id}`;

    function copyLink(){
        try {
            navigator.clipboard.writeText(address);
        } catch (error) {
            console.log(error);
        }
    }

    return(
        <Modal isOpen={isOpen} closeModal={closeModal}> 
            <FormModalContainer className="">
                <TitleModal>Sorteio criado com sucesso</TitleModal>
                <TextModal className="mb-6">Parabéns! Seu sorteio está ativo, e suas rifas já estão disponíveis para compra.</TextModal>
                <span className="flex items-center justify-between h-12 mt-8 overflow-hidden border-2 border-solid rounded shadow-md border-neutral-300 shadow-neutral-500">
                    <p className="px-2 text-xs truncate text-neutral-500">{address}</p>
                    <button type="button" onClick={copyLink}
                        className="h-full px-4 text-xl duration-200 text-main hover:text-maindark">
                        <MdContentCopy/>
                    </button>
                </span>
                <ButtonsContainer className="mt-8">
                    <ButtonCancel disabled={false} onClick={closeModal}>
                        Fechar
                    </ButtonCancel>
                </ButtonsContainer>
            </FormModalContainer>
        </Modal>
    )
}