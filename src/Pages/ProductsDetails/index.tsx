import { AiOutlinePlus } from "react-icons/ai";
import {toast} from "react-toastify";
import { Link, useParams } from "react-router-dom";
import { AxiosError } from "axios";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { SetupApi } from "../../services";
import { RiAlertLine } from "react-icons/ri";
import { IoIosArrowBack } from "react-icons/io";


import Header from "../../components/header";
import ContainerPages from "../../components/ui/containerPages";
import Input from "../../components/ui/input";
import TextArea from "../../components/ui/textArea";
import ButtonGreen from "../../components/ui/buttonGreen";
import ButtonConfirm from "../../components/modals/ui/buttonConfirm";
import ButtonCancel from "../../components/modals/ui/buttonCancel";
import LoadingPage from "../../components/loading";
import ModalDeleteProduct from "../../components/modals/products/deleteProduct";


interface ProductsProps{
    admRef:string;
    createDate:Date;
    description:string;
    name:string;
    photos:string[];
    _id:string;
}

export default function ProductsDetails(){
    const api = SetupApi();
    const {id} = useParams();

    const [loading, setLoading] = useState(true);

    const [imagesView, setImagesView] = useState<string[]>([]);
    const [newImagesSend, setNewImagesSend] = useState<string[]>([]);
    const [imagesDelete, setImagesDelete] = useState<string[]>([]);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
    const [product, setProduct] = useState<ProductsProps>();
    const [isEditable, setIsEditable] = useState(false);
    const [isOpenDelete, setIsOpenDelete] = useState(false);


    function handleImages(e: React.ChangeEvent<HTMLInputElement>) {
        
        const listImagesView: any[] = [];
        const listImagesSend: any[] = [];
        
        if (e.target.files) {
            for (let x = 0; x < e.target.files.length && (imagesView.length + x) < 5; x++) {
                const maxSize = 20 * 1024 * 1024; 
                const file = e.target.files[x];
                if  (file.size > maxSize) {
                    toast.warning('Um arquivo enviado excede o tamanho, 20mb');
                } else {
                    if (!(file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/jpg" || file.type === 'image/webp')) {
                        toast.warning('Formato de arquivo não permitido');
                    } else {
                        const imgObj = file ? URL.createObjectURL(file) : null;

                        listImagesSend.push(file); // Somente novos arquivos
                        listImagesView.push(imgObj); // Visualização
                    }
                }
            }
        }
        setImagesView((prev) => [...prev, ...listImagesView]);
        setNewImagesSend((prev) => [...prev, ...listImagesSend]);
    }

    function handleRemovePhoto(img: any) {
        if (img && typeof img === 'string' && img.includes('storage.googleapis.com')) {
            setImagesDelete((prev) => [...prev, img]);
        } 
    
        if (img) { 
            const imgsView = imagesView.filter((item) => {
                return item !== img;
            });
            setImagesView(imgsView);
        }
    }
    
    async function handleUpdate(e:FormEvent) {
        e.preventDefault();

        if (imagesView.length < 1){
            toast.warning('Envie fotos do produto');
            return;
        }

        if (!name || !description){
            toast.warning('Preencha todos os campos');
            return;
        }

        const oldPhotos = product?.photos ? product.photos.filter((item) => {
            return !imagesDelete.includes(item);
        }):[];
        

        const data = new FormData();
        data.append('name', name);
        data.append('description', description);

        newImagesSend.forEach((item)=>{
            data.append('files', item);
        });

        oldPhotos.forEach((item)=>{
            data.append('oldPhotos', item);
        });

        setIsLoadingUpdate(true);
        try {
            await api.put(`/produto/${id}`, data);
        } catch (error:AxiosError | any) {
            console.log(error.response.data.error || "Erro ao atualizar produto");
        }finally{
            setIsLoadingUpdate(false);
            setIsEditable(false);
        }
    }
    
    const openModal = useCallback(()=>{
        setIsOpenDelete(true);
    },[isOpenDelete]);

    const closeModal = useCallback(()=>{
        setIsOpenDelete(false);
    },[isOpenDelete]);
    
    function cancelEdit(){
        if (product) {
            setDescription(product.description);
            setName(product.name);
            setImagesView(product.photos);
        }
        setIsEditable(false);
    }

    function setEdit(e:FormEvent){
        e.preventDefault();
        setIsEditable(true);
    }

    async function getProduct() {
        setLoading(true);
        try {
            const response = await api.get(`/produto/${id}`);
            setProduct(response.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }
    
    useEffect(() => {
        getProduct();
    }, []);
    
    useEffect(() => {
        if (product) {
            setDescription(product.description);
            setName(product.name);
            setImagesView(product.photos);
        }
    }, [product]);
        

    
    if (loading){
        return <LoadingPage/>
    }

    return(
        <>
            <Header/>
            <ContainerPages>
                {product ? (
                    <>
                        <Link to={'/products'} className="text-2xl text-neutral-500">
                            < IoIosArrowBack className="duration-200 hover:scale-125"/>
                        </Link>
                        <section className="p-4 mt-12 shadow-lg shadow-neutral-300">
                            <h2 className="text-xl font-semibold">Detalhes do produto</h2>

                            <form className="flex flex-col gap-4 mt-6" onSubmit={handleUpdate}>
                                <Input text="Nome do Produto" placeholder="Digite o nome do produto" disabled={!isEditable}
                                type="text" minLength={3} maxLength={60} required={true} value={name} onChange={(e)=>setName(e.target.value)}/>
                                
                                <TextArea text="Descrição" minLength={20} maxLength={1000}  disabled={!isEditable} required={true}
                                placeholder="Adicione uma descrição detalhada do produto" value={description} onChange={(e)=>setDescription(e.target.value)}/>
                                <div>
                                    <span className="my-6 font-bold">Foto do produto</span>
                                    <div className="grid w-full grid-cols-2 gap-6 mt-4 lg:grid-cols-3 2xl:grid-cols-4">

                                        <label className={`w-full aspect-[1/0.6] duration-200 border-2 border-solid rounded border-neutral-200 
                                        hover:border-neutral-500 ${imagesView.length >= 5 || !isEditable ? 'cursor-not-allowed hover:border-neutral-200' : 'cursor-pointer'}`}>
                                                <input disabled={imagesView.length >= 5 || !isEditable ? true : false} 
                                                type="file" onChange={handleImages} accept=".png, .jpeg, .jpg, .webp" multiple={true}
                                                className="hidden"/>
                                                <div className="flex flex-col items-center justify-center w-full h-full text-lg text-neutral-500">
                                                    <AiOutlinePlus/>
                                                    <span>Adicionar Foto</span>
                                                </div>
                                        </label>
                                        {imagesView.length > 0 &&(
                                            imagesView.map((image, index) => (
                                                <div key={index} 
                                                className="overflow-hidden bg-black rounded" onClick={isEditable ? ()=>handleRemovePhoto(image) : undefined}>
                                                    <img key={index} src={image} alt={`Preview ${index}`} className="w-full aspect-[1/0.6] object-center object-contain hover:scale-125 duration-500" />
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                                {isEditable?(
                                    <div className="w-full">
                                        <ButtonConfirm className="float-right ml-4" type="submit"
                                        disabled={isLoadingUpdate}>Salvar</ButtonConfirm>

                                        <ButtonCancel onClick={cancelEdit} disabled={false} 
                                        className="float-right">Cancelar</ButtonCancel>

                                    </div>
                                ):(
                                    <div className="w-full">
                                        <ButtonConfirm className="float-right ml-4" 
                                        type="reset" 
                                        onClick={setEdit}
                                        disabled={false}>Editar</ButtonConfirm>

                                        <ButtonCancel disabled={false} 
                                        className="float-right" onClick={openModal}>Deletar</ButtonCancel>
                                    </div>
                                )}
                            </form>
                        </section>
                    </>
                ):(
                    <section className="flex flex-col items-center justify-center w-full max-w-lg gap-4 m-auto mt-36">
                        <div className="flex flex-col items-center justify-center w-full gap-2 text-3xl font-semibold">
                            <RiAlertLine/>
                            <h1>Produto não encontrado</h1>
                        </div>
                        <p className="text-base text-center text-neutral-500">
                            Desculpe, mas não conseguimos encontrar o produto que você está procurando. Verifique se o endereço está correto ou volte para a página de produtos.
                        </p>
                        <Link to={'/products'}>
                            <ButtonGreen disabled={false}>Voltar para a página de produtos</ButtonGreen>
                        </Link>
                        
                    </section>
                )}

            </ContainerPages>
            
            {id &&(
                <ModalDeleteProduct isOpen={isOpenDelete} closeModal={closeModal} id={id}/>
            )}
        </>
    )
}