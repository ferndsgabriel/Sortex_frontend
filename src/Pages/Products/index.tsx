import { AiOutlinePlus } from "react-icons/ai";
import {toast} from "react-toastify";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { Link } from "react-router-dom";

import Header from "../../components/header";
import ContainerPages from "../../components/ui/containerPages";
import Title from "../../components/ui/titlePages";
import Input from "../../components/ui/input";
import TextArea from "../../components/ui/textArea";
import { FormEvent, useEffect, useState } from "react";
import ButtonGreen from "../../components/ui/buttonGreen";
import { SetupApi } from "../../services";
import { AxiosError } from "axios";
import LoadingPage from "../../components/loading";


interface ProductsProps{
    admRef:string;
    createDate:Date;
    description:string;
    name:string;
    photos:string;
    _id:string;
}

export default function Products(){
    const api = SetupApi();
    const [loading, setLoading] = useState(true);
    const [imagesView, setImagesView] = useState<string[]>([]);
    const [imagesSend, setImagesSend] = useState<string[]>([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isLoadingCreate, setIsLoadingCreate] = useState(false);
    const [products, setProducts] = useState<ProductsProps[]>([]);
    const [isVisibleCreate, setIsVisibleCreate] = useState(true);
    
    useEffect(()=>{
        async function getProducts(){
            try {
                const response = await api.get('/produtos');
                setProducts(response.data);
                if (response.data.length > 0){
                    setIsVisibleCreate(false);
                }
            } catch (error) {
                console.log(error);
            }finally{
                setLoading(false);
            }
        }
        getProducts();
    },[]);
    

    
    function handleImages(e: React.ChangeEvent<HTMLInputElement>) {
        const listImagesView:any = [];
        const listImagesSend:any = [];
        
        if (e.target.files){
            for (let x = 0; x < e.target.files?.length && (imagesView.length + x) < 5; x++){
                const maxSize = 20 * 1024 * 1024; 
                const file = e.target.files[x];
                if  (file.size > maxSize) {
                    toast.warning('Um arquivo enviado excede o tamanho, 20mb');
                }else{
                    if (!(file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/jpg" || file.type === 'image/webp')){
                        toast.warning('Formato de arquivo não permitido');
                    }else{
                        const imgObj = file ? URL.createObjectURL(file) : null;
                        listImagesSend.push(file);
                        listImagesView.push(imgObj);
                    }
                }
            }
            
        }
        setImagesView((prev) => [...prev, ...listImagesView]);
        setImagesSend((prev) => [...prev, ...listImagesSend]);
    }

    function handleRemovePhoto(iItem:number){
        const removeItem = imagesView.filter((_, index)=> index !== iItem);
        const removeSend = imagesSend.filter((_, index)=> index !== iItem);
        setImagesView(removeItem);
        setImagesSend(removeSend);
    }
    
    async function createProduct(e: FormEvent) {
        e.preventDefault();

        const dataImage = new FormData();
        
        if (!(name || description) || imagesSend.length < 1){
            toast.warning('Preencha todos os campos');
            return;
        }
        

        dataImage.append('name', name.trim());
        dataImage.append('description',description.trim());  
    
        imagesSend.forEach((item) => {
            dataImage.append('files', item);
        });

        setIsLoadingCreate(true);

        try {
            const response = await api.post('/produtos', dataImage);
            setName('');
            setDescription('');
            setImagesSend([]);
            setImagesView([]);
            setProducts((prev)=>[...prev, response.data]);
            toast.success("Produto cadastrado com sucesso");
        } catch (error:AxiosError | any) {
            toast.error(error.response.data.error || 'Erro ao cadastrar produto');
        }finally{
            setIsLoadingCreate(false);
        }
    }
    

    const productsSort = products.sort((a, b) => {
        const dataA = new Date(a.createDate).getTime();
        const dataB = new Date(b.createDate).getTime();
        return dataB - dataA; 
    });
        


    
    if (loading){
        return <LoadingPage/>
    }

    return(
        <>
            <Header/>
            <ContainerPages>
                <Title text="Produtos"/>
                
                <section className="pb-4 border-b-2 border-solid border-neutral-300">
                    <div className="flex items-center justify-between w-full gap-2">
                        <h2 className="text-xl font-semibold">Cadastrar novo produto</h2>
                        <button onClick={()=>setIsVisibleCreate(!isVisibleCreate)} className="text-xl text-neutral-500">
                            {isVisibleCreate?(
                                <FaAngleUp/>
                            ):(
                                <FaAngleDown/>
                            )}
                        </button>
                    </div>
                    {isVisibleCreate &&(
                    <form className="flex flex-col gap-4 mt-6" onSubmit={createProduct}>
                        <Input text="Nome do Produto" placeholder="Digite o nome do produto"
                        type="text" minLength={3} maxLength={60} required={true} value={name} onChange={(e)=>setName(e.target.value)}/>
                        <TextArea text="Descrição" minLength={20} required={true} maxLength={1000} placeholder="Adicione uma descrição detalhada do produto" value={description} onChange={(e)=>setDescription(e.target.value)}/>
                        <div>
                            <span className="my-6 font-bold">Foto do produto</span>
                            <div className="grid w-full grid-cols-2 gap-6 mt-4 lg:grid-cols-3 2xl:grid-cols-4">
                            <label className={`w-full aspect-[1/0.6] duration-200 border-2 border-solid rounded border-neutral-200 
                            hover:border-neutral-500 ${imagesView.length >= 5 ? 'cursor-not-allowed hover:border-neutral-200' : 'cursor-pointer'}`}>
                                    <input disabled={imagesView.length >= 5 ? true : false} 
                                    type="file" onChange={handleImages} accept=".png, .jpeg, .jpg, .webp" multiple max={5}
                                    className="hidden"/>
                                    <div className="flex flex-col items-center justify-center w-full h-full text-lg text-neutral-500">
                                        <AiOutlinePlus/>
                                        <span>Adicionar Foto</span>
                                    </div>
                                </label>
                                {imagesView.length > 0 &&(
                                    imagesView.map((image, index) => (
                                        <div key={index} 
                                        className="overflow-hidden bg-black rounded" onClick={()=>handleRemovePhoto(index)}>
                                            <img key={index} src={image} alt={`Preview ${index}`} className="w-full aspect-[1/0.6] object-center object-contain hover:scale-125 duration-500" />
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                        <ButtonGreen disabled={isLoadingCreate} width={'fit'} className="self-end">Cadastrar Produto</ButtonGreen>
                    </form>
                    )}
                </section>
                
                {products.length > 0 &&(
                <section className="mt-12">
                    <h2 className="text-xl font-semibold">Produtos Cadastrados</h2>
                    <div className="grid grid-cols-1 gap-4 mt-6 md:grid-cols-2 2xl:grid-cols-3">
                        {productsSort.map((item)=>{
                            return(
                                <Link key={new Date(item.createDate).getTime()} 
                                to={`/products/${item._id}`} className="w-full">
                                    <div className="flex flex-col justify-between w-full h-full p-6 border-2 border-solid rounded overfslow-hidden xl:p-2 border-neutral-200 hover:border-neutral-300 hover:shadow-lg">
                                        <img
                                            src={item.photos[0]}
                                            alt={item.name}
                                            className="object-cover object-center w-full h-full duration-200 rounded bg-neutral-200 hover:scale-90 aspect-video"
                                        />
                                        <div className="w-full h-auto mt-8">
                                            <h3 className="text-xl font-bold capitalize truncate ">{item.name}</h3>
                                            <p className="truncate text-neutral-500">{item.description}</p>
                                        </div>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                </section>
                )}
            </ContainerPages>
        </>
    )
}