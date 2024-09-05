import { FormEvent, useEffect, useState } from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { SetupApi } from "../../services";
import CurrencyConverter from "../../utils/currencyConverter";
import PriceToNumber from "../../utils/priceToNumber";
import Confetti from 'react-confetti';
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import DateConverter from "../../utils/dateConverter";
import { MdContentCopy } from "react-icons/md";

import Header from "../../components/header"
import ContainerPages from "../../components/ui/containerPages";
import Title from "../../components/ui/titlePages";
import Input from "../../components/ui/input";
import InputDate from "../../components/ui/inputDate";
import TextArea from "../../components/ui/textArea";
import ButtonGreen from "../../components/ui/buttonGreen";
import Select from "../../components/ui/select";
import ModalGetLink from "../../components/modals/sortex/link";
import LoadingpageProgress from "../../components/loading";
import {useNavigate } from "react-router-dom";


interface ProductProps {
    name: string;
    _id:string;
}

interface SortexProps{
    admRef: string;
    produtoRef:string;
    cartaoRef: string;
    dataTermino:string;
    price: 0.1;
    rifas: [];
    title: string;
    description: string;
    status: boolean;
    drawn: boolean;
    winner: null | {};
    createDate: string;
    _id:string;
}

export default function Start(){
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [animation, setAnimation] = useState(false);

    const minDate = new Date(); 
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 2);
    const [finishDate, setFinishDate] = useState<Date | null>(maxDate);

    const [isLoadingCreate, setIsLoadingCreate] = useState(false);
    const [products, setProducts] = useState<ProductProps[]>([]); 
    const [product, setProduct] = useState<ProductProps>();
    const [newSortexId, setNewSortexId] = useState('');
    const api = SetupApi();
    const [isOpenModal, setIsOpenModal] = useState(false);

    const [isVisibleCreate, setIsVisibleCreate] = useState(true);

    const [sortexInProgress, setSortexInProgress]=  useState<SortexProps[]>([]);
    const [sortexFinished, setSortexFinished] = useState<SortexProps[]>([]);


    const [maxPageProgress,setMaxPageProgress] = useState(0);
    const [pageProgress, setPageProgress] = useState(1);

    const [maxPageFinished,setMaxPageFinished] = useState(0);
    const [pageFinished, setPageFinished] = useState(1);



    useEffect(()=>{
        async function getItens(){

            setLoading(true);

            const [response, response1, response2] = await Promise.all([
                await api.get('/sorteiosprogress',{
                    params:{
                        per_page:6,
                        page:pageProgress
                    }
                }),
                await api.get('/sorteiosfinished',{
                    params:{
                        per_page:6,
                        page:pageFinished
                    }
                }),
                await api.get('/produtos'),
            ]);
            
            try {
                setMaxPageProgress(response.data.maxPages);
                setSortexInProgress(response.data.itens);

                setMaxPageFinished(response1.data.maxPages);
                setSortexFinished(response1.data.itens)

                setProducts(response2.data);
            
            } catch (error) {
                console.log(error);
            }finally{
                setLoading(false);
            }
        }

        getItens()

    },[pageProgress, pageFinished]);


    async function createPrizeDraw(e:FormEvent) {
        e.preventDefault();

        const idProduct = product?._id;
        const eventPrice = PriceToNumber(price);

        if (!(name || description || idProduct || finishDate) || eventPrice < 0.01){
            toast.warning('Dados invalálidos')
        }
        setIsLoadingCreate(true);
        try {
            const response = await api.post('sorteio',{
                title:name,
                price:eventPrice,
                dataTermino:finishDate,
                productId:idProduct,
                description:description
            });

            setNewSortexId(response.data._id);
            setProducts((prev)=>[...prev, response.data]);
            toast.success('Sorteio criado com sucesso');
            resetInputs();
            setAnimation(true);
            setIsOpenModal(true);
        } catch (error:AxiosError | any) {
            console.log(error)
            toast.error(error.response.data.error)
        }finally{
            setIsLoadingCreate(false)
        }
    }

    function OpenAnimation(){
        
        if (animation){
            setTimeout(()=>{
                setAnimation(false);
            },8000)
            return <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            />

        }else{
            return null
        }
    }

    function resetInputs(){
        setName('');
        setDescription('');
        setPrice('');
        setFinishDate(maxDate);
    }
    
    function handlePrice(e: React.ChangeEvent<HTMLInputElement>){
        setPrice(CurrencyConverter(e))
    }

    function closeModal(){
        setIsOpenModal(false);
    }
    

    function copyLink(getId:string, e:FormEvent){
        e.stopPropagation();
        const url = window.location.origin;
        const address = `${url}/raffles/${getId}`;
        
        try {
            navigator.clipboard.writeText(address);
        } catch (error) {
            console.log(error);
        }
    }



    function getPercentageStyle(start:string, finish:string) {

        const max = new Date(finish).getDate();
        const min = new Date(start).getDate();
        const current = new Date().getDate();
    
        const total = (((current - min) / (max - min)) * 100).toFixed(0);
        
        const result = parseInt(total) > 100 ? 100 : total;

        return result;
    }

    function formatToBRL(value:number) {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    }
    
    function navigatePage(getId:string){
        //navigate('//') pagina de detalhes
    }

    const RepaginationInProgress = () => {
        if (maxPageProgress > 1) {
            return (
                <div className="flex items-center justify-center gap-2 mt-6">
                    {[...Array(maxPageProgress)].map((_, index) => (
                        <button className={`w-8 shadow-md shadow-neutral-500 rounded-full aspect-square ${(index + 1 ) === pageProgress ? 'bg-main text-white' : 'bg-white'}`} 
                        key={index} onClick={()=>setPageProgress(index + 1)}>
                            {index + 1}
                        </button>
                    ))}
                </div>
            );
        } else {
            return null; 
        }
    };
    
    const RepaginationFinished = () => {
        if (maxPageFinished > 1) {
            return (
                <div className="flex items-center justify-center gap-2 mt-6">
                    {[...Array(maxPageFinished)].map((_, index) => (
                        <button className={`w-8 shadow-md shadow-neutral-500 rounded-full aspect-square ${(index + 1 ) === pageFinished ? 'bg-main text-white' : 'bg-white'}`} 
                        key={index} onClick={()=>setPageFinished(index + 1)}>
                            {index + 1}
                        </button>
                    ))}
                </div>
            );
        } else {
            return null; 
        }
    };


    if (loading){
        return <LoadingpageProgress/>
    }

    return(
        <>
            <Header/>
            <ContainerPages>
                <Title text="Gerenciamento de Sorteios"/>
                <section className="pb-4 border-b-2 border-solid border-neutral-300">
                    <div className="flex items-center justify-between w-full gap-2">
                        <h2 className="text-xl font-semibold">Criar Sorteio</h2>
                        <button onClick={()=>setIsVisibleCreate(!isVisibleCreate)} className="text-xl text-neutral-500">
                            {isVisibleCreate?(
                                <FaAngleUp/>
                            ):(
                                <FaAngleDown/>
                            )}
                        </button>
                    </div>
                    {isVisibleCreate &&(
                        <form className="flex flex-col w-full gap-4 mt-6" onSubmit={createPrizeDraw}>
                            <Input text="Título" placeholder="Digite o título do sorteio"
                            type="text" minLength={3} maxLength={60} required={true} value={name} onChange={(e)=>setName(e.target.value)}/>
                            
                            <TextArea className="col-start-1 col-end-4" 
                            text="Descrição" minLength={20} maxLength={1000} required={true} placeholder="Digite a descrição sorteio" value={description} onChange={(e)=>setDescription(e.target.value)}/>

                            <Select failedMessage={'Nenhum produto encontrado'}
                            setProduct={setProduct} text={'Selecione o produto'} itens={products}/>

                            <div className="flex items-start justify-between gap-4">
                                <Input text="Preço por rifa" placeholder="5,00"
                                type="text" minLength={3} maxLength={30} required={true} value={price} onChange={(e)=>handlePrice(e)}/>
                                
                                <InputDate
                                text="Data de Término"
                                selectedDate={finishDate}
                                onChange={(date: Date | null) => setFinishDate(date)}
                                minDate={minDate}
                                maxDate={maxDate}
                                />
                            </div>

                            
                            <ButtonGreen disabled={isLoadingCreate}
                            >Criar sorteio</ButtonGreen>
                        </form>
                    )}
                </section>
                
                {sortexInProgress.length > 0 && (                
                    <section className="flex flex-col gap-4 pb-2 mt-12 overflow-hidden">
                        <h2 className="text-xl font-semibold">Ativos</h2>
                        <article className="w-full">
                            <div className="flex flex-col gap-4 md:grid md:grid-cols-2 2xl:grid-cols-3">
                                {sortexInProgress.map((item)=>{
                                    return(
                                        <div onClick={()=>navigatePage(item._id)}
                                        key={item._id}
                                        className="flex flex-col gap-2 px-4 py-4 border-2 border-solid rounded shadow-md cursor-pointer hover:border-neutral-300 shadow-neutral-300">

                                            <div className="flex items-start justify-between gap-2 font-semibold truncate">
                                                <h4 className="text-lg">{item.title}</h4>
                                                <button onClick={(e)=>copyLink(item._id, e)} 
                                                className="text-xl duration-200 text-main hover:text-maindark">
                                                    <MdContentCopy />
                                                </button>
                                            </div>

                                            <p className="font-semibold">{formatToBRL(item.price)} Rifa</p>
                                            <p className="truncate text-neutral-500">{item.description}</p>
                                            <div className="flex items-end justify-between gap-2 truncate text-neutral-500">
                                                <p>Inicio: {DateConverter(item.createDate)}</p>
                                                <p>Término: {DateConverter(item.dataTermino)}</p>
                                            </div>

                                            <span 
                                            className={`block h-3 rounded-full bg-main mt-2`}
                                            style={{width:`${getPercentageStyle(item.createDate, item.dataTermino)}%`}}/>
                                        </div>
                                    )
                                })}
                            </div>
                            {RepaginationInProgress()}
                        </article>
                    </section>
                )}

                {sortexFinished.length > 0 && (                
                    <section className="flex flex-col gap-4 mt-12">
                        <h2 className="text-xl font-semibold">Finalizados</h2>
                        <article>
                            <div className="flex flex-col gap-4 md:grid md:grid-cols-2 2xl:grid-cols-3">
                                {sortexFinished.map((item)=>{
                                    return(
                                        <div onClick={()=>navigatePage(item._id)}
                                        key={item._id}
                                        className="flex flex-col gap-2 px-4 py-6 border-2 border-solid rounded shadow-md cursor-pointer opacity-70 border-neutral-300 shadow-neutral-300">
                                            
                                            <div className="flex items-start justify-between gap-2 font-semibold truncate">
                                                <h4 className="text-lg">{item.title}</h4>
                                                <p className="font-semibold">{formatToBRL(item.price)} Rifa</p>
                                            </div>
                                           

                                            <p className="truncate text-neutral-500">{item.description}</p>
                                            <div className="flex items-end justify-between gap-2 truncate text-neutral-500">
                                                <p>Inicio: {DateConverter(item.createDate)}</p>
                                                <p>Término: {DateConverter(item.dataTermino)}</p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            {RepaginationFinished()}
                        </article>
                    </section>
                )}
                {OpenAnimation()}
                <ModalGetLink isOpen={isOpenModal} closeModal={closeModal} id={newSortexId}/>
            </ContainerPages>
        </>
    )
}