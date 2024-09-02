import { FormEvent, useEffect, useState } from "react";
import Header from "../../components/header";
import { FaInstagram} from "react-icons/fa";
import { FiYoutube, FiTwitch  } from "react-icons/fi";
import { RiTiktokLine } from "react-icons/ri";
import { SetupApi } from "../../services";
import LoadingPage from "../../components/loading";
import { toast } from "react-toastify";

import Title from "../../components/ui/titlePages";
import ContainerPages from "../../components/ui/containerPages";
import ButtonConfirm from "../../components/modals/ui/buttonConfirm";
import ButtonCancel from "../../components/modals/ui/buttonCancel";

interface sociasProps{
    instagram?:string;
    twitch?:string;
    youtube?:string;
    tiktok?:string;
}

export default function Sociais(){
    const api = SetupApi();
    const [isEditable, setIsEditable] = useState(false);
    const [insta, setInsta] = useState('');
    const [youtube, setYoutube] = useState('');
    const [tiktok, setTiktok] = useState('');
    const [twitch, setTwitch] = useState('');
    const [loading, setLoading] = useState(true);
    const [isLoadingBtn, setIsLoadingBtn] = useState(false);

    async function getSociais() {
        try {
            const response = await api.get('/sociais');
            const medias:sociasProps = response.data;
            medias.instagram? setInsta(medias.instagram):setInsta('');
            medias.twitch? setTwitch(medias.twitch) : setTwitch('');
            medias.tiktok? setTiktok(medias.tiktok) : setTiktok('');
            medias.youtube? setYoutube(medias.youtube) : setYoutube('');
            
        } catch (error) {
            console.log(error);
        }finally{
            setLoading(false);
        }
    }

    useEffect(()=>{
        getSociais();
    },[]);


    async function cancelButton(){
        await getSociais();
        setIsEditable(false);
    }
    
    async function handleChange(e:FormEvent) {
        e.preventDefault();

        const regexInsta = /^(https?:\/\/)?(www\.)?instagram\.com\/[a-zA-Z0-9._]+\/?$/;
        const regexTk = /^(https?:\/\/)?(www\.)?(tiktok\.com\/@([a-zA-Z0-9._-]+)\/?)$/;
        const regexYoutube = /^(https?:\/\/)?(www\.)?(youtube\.com\/@([a-zA-Z0-9._-]+)\/?)$/;
        const regexTwitch =  /^(https?:\/\/)?(www\.)?(twitch\.tv\/([a-zA-Z0-9._-]+)\/?)$/;
        
        if (insta && !(regexInsta.test(insta))){
            toast.warning('Digite um link válido do instagram'); 
            return;
        }

        if (youtube && !(regexYoutube.test(youtube))){
            toast.warning('Digite um link válido do youtube'); 
            return;
        }

        if (tiktok && !(regexTk.test(tiktok))){
            toast.warning('Digite um link válido do TikTok'); 
            return;
        }

        if (twitch && !(regexTwitch.test(twitch))){
            toast.warning('Digite um link válido do TikTok'); 
            return;
        }

        
        try {
            setIsLoadingBtn(true);
            await api.post('/sociais',{
                instagram: insta,
                youtube:youtube,
                tiktok:tiktok,
                twitch:twitch
            });
        } catch (error) {
            console.log(error);
            getSociais();
        }finally{
            setIsEditable(false);
            setIsLoadingBtn(false);
        }
    }

    if (loading){
        return <LoadingPage/>;
    }


    return(
        <>
            <Header/>
            <ContainerPages>
                <Title text="Redes sociais"/>
                <section className="flex flex-col w-full max-w-xl gap-6 mt-16">
                    <div>
                        <h2 className="text-2xl font-semibold">
                            Perfis de Redes Sociais
                        </h2>
                        <p className="text-neutral-500">Insira suas informações de perfil de redes sociais abaixo.</p>
                    </div>

                    <form className="flex flex-col w-full gap-6" onSubmit={handleChange}>
                        <label className="w-full">
                            <div className="flex items-center gap-2 mb-2 font-semibold">
                                <FaInstagram className="text-2xl text-neutral-600"/>
                                <span>Instagram</span>
                            </div>
                            <input value={insta} onChange={(e)=>setInsta(e.target.value)} 
                            disabled={!isEditable}  className="w-full p-2 border-2 border-solid rounded border-neutral-200 placeholder:text-neutral-500 focus:border-2 focus:border-solid focus:border-neutral-500" 
                            type="text" placeholder="instagram.com/usuario"/>
                        </label>

                        <label className="w-full">
                            <div className="flex items-center gap-2 mb-2 font-semibold">
                                <FiYoutube  className="text-2xl text-neutral-600"/>
                                <span>Youtube</span>
                            </div>
                            <input value={youtube} onChange={(e)=>setYoutube(e.target.value)}  
                            disabled={!isEditable}  className="w-full p-2 border-2 border-solid rounded border-neutral-200 placeholder:text-neutral-500 focus:border-2 focus:border-solid focus:border-neutral-500" 
                            type="text" placeholder="youtube.com/@usuario"/>
                        </label>

                        <label className="w-full">
                            <div className="flex items-center gap-2 mb-2 font-semibold">
                                <RiTiktokLine  className="text-2xl text-neutral-600"/>
                                <span>TikTok</span>
                            </div>
                            <input value={tiktok} onChange={(e)=>setTiktok(e.target.value)}  
                            disabled={!isEditable}  className="w-full p-2 border-2 border-solid rounded border-neutral-200 placeholder:text-neutral-500 focus:border-2 focus:border-solid focus:border-neutral-500" 
                            type="text" placeholder="tiktok.com/@usuario"/>
                        </label>

                        
                        <label className="w-full">
                            <div className="flex items-center gap-2 mb-2 font-semibold">
                                <FiTwitch  className="text-2xl text-neutral-600"/>
                                <span>Twitch</span>
                            </div>
                            <input value={twitch} onChange={(e)=>setTwitch(e.target.value)}  
                            disabled={!isEditable}  className="w-full p-2 border-2 border-solid rounded border-neutral-200 placeholder:text-neutral-500 focus:border-2 focus:border-solid focus:border-neutral-500" 
                            type="text" placeholder="twitch.tv/usuario"/>
                        </label>
                        
                        {isEditable ? (
                            <div className="flex items-center gap-2">
                                
                                <ButtonConfirm disabled={isLoadingBtn} className="w-fit">
                                    Salvar
                                </ButtonConfirm>

                                <ButtonCancel disabled={isLoadingBtn} onClick={cancelButton} type="reset">
                                    Cancelar
                                </ButtonCancel>                    
                            </div>
                        ):(
                            <ButtonConfirm disabled={false} onClick={()=>setIsEditable(true)} type="button" className="w-fit">
                                Editar
                            </ButtonConfirm>
                            
                        )}
                    </form>
                </section>
            </ContainerPages>
        </>
        
    )
}