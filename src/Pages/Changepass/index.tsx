import { FaSpinner } from "react-icons/fa";
import { AiOutlineEyeInvisible } from "react-icons/ai";
import { IoEyeSharp } from "react-icons/io5";
import logo from "../../assets/logo.svg";
import icon from "../../assets/icon.svg";
import { useState, useRef, FormEvent, useEffect } from "react";
import { AxiosError } from "axios";
import { Link, useParams } from "react-router-dom";
import { toast } from 'react-toastify';
import { SetupApi } from "../../services";
import LoadingPage from "../../components/loading";
import zxcvbn from "zxcvbn";
import { useNavigate } from "react-router-dom";

export default function ChangePass(){
    const {cod, id} = useParams();
    const api = SetupApi();

    const [loading, setLoading] = useState(true);
    const [next, setNext] = useState(false);

    const [isVisible, setIsVisible] = useState(false);
    const passRef = useRef<HTMLInputElement>(null);
    const confirmPassRef = useRef<HTMLInputElement>(null);
    const [loadingButton, setLoadingButton] = useState(false);
    const navigate = useNavigate();

    useEffect(()=>{
        async function verifyLink() {
            if (cod && id){
                try {
                    await api.get("/recovery",{
                        headers:{
                            cod:cod,
                            id:id
                        }
                    });
                    setNext(true);
                } catch (error) {
                    console.log(error);
                    setNext(false);
                }finally{
                    setLoading(false);
                }
            }else{
                setLoading(false);
            }
        }

        verifyLink();
    },[]);
    
    async function login(e:FormEvent) {
        e.preventDefault();

        const pass = passRef.current ? passRef.current.value : '';
        const confirmPass = confirmPassRef.current ? confirmPassRef.current.value : '';

        if (!pass || !confirmPass){
            toast.warning('Preencha todos os campo');
            return;
        };

        const result = zxcvbn(pass);

        if (pass !== confirmPass){
            toast.warning('Senhas diferentes');
            return;
        }
        
        if (result.score < 3){
            toast.warning("A senha é fraca. Tente usar uma senha mais longa e complexa, incluindo letras maiúsculas, números e símbolos.");
            return;
        }
        
        setLoadingButton(true);

        try {
            await api.put('/recovery',{
                pass:pass,
                id:id,
                cod:cod
            });
            toast.success('Senha recuperada com sucesso');
            navigate('/');
        }catch (error:AxiosError | any) {
            toast.error(error.response.data);
        }finally{
            setLoadingButton(false);
        }    
    }

    if (loading){
        return <LoadingPage/>
    }

    return(
        <>
            {next?(
                <main className="flex items-center justify-center w-full h-screen lg:relative">
                    <Link to={'/'}>
                        <img src={logo} alt="logo" className="absolute top-0 left-0 hidden w-full max-w-xs p-8 xl:block"/>
                    </Link>
                    <section className="flex flex-col items-center justify-center w-full h-full max-w-xl gap-4 p-8 md:border-neutral-200 md:border-solid md:border-2 md:shadow-lg md:shadow-neutral-500 md:h-auto md:rounded-md">
                        <Link to={'/'}>
                            <img className="self-center w-full max-h-16 xl:hidden" 
                            src={icon} alt="logo do sortex"/>
                        </Link>
                        <div className="w-full text-center">
                            <h1 className="text-2xl font-bold">Alterar senha</h1>
                            <p className="mt-2 text-lg text-neutral-500">Recupere sua senha e continue desfrutando do Sortex.</p>
                        </div>

                        <form className="flex flex-col w-full gap-6 mt-8" onSubmit={login}>

                            <div>
                                <label className="flex flex-col gap-2">
                                    <span className="font-bold">Nova senha</span>
                                    <input className="p-2 border-2 border-solid rounded-md focus:border-solid focus:border-neutral-500 focus:border-2 border-neutral-200 placeholder:text-neutral-500" 
                                    type={!isVisible? 'password' : 'text'} placeholder="********"  required={true} minLength={6} maxLength={30}
                                    ref={passRef}/>
                                </label>
                                <button className="mt-4 text-xl" type="button" disabled={loadingButton}
                                    onClick={()=>setIsVisible(!isVisible)}>
                                        {!isVisible ?(
                                            <AiOutlineEyeInvisible/>
                                        ):( 
                                            <IoEyeSharp/>
                                        )}
                                </button>
                            </div>

                            <div>
                                <label className="flex flex-col gap-2">
                                    <span className="font-bold">Confirmar senha</span>
                                    <input className="p-2 border-2 border-solid rounded-md focus:border-solid focus:border-neutral-500 focus:border-2 border-neutral-200 placeholder:text-neutral-500" 
                                    type={!isVisible? 'password' : 'text'} placeholder="********"  required={true} minLength={6} maxLength={30}
                                    ref={confirmPassRef}/>
                                </label>
                                <button className="mt-4 text-xl" type="button" disabled={loadingButton}
                                    onClick={()=>setIsVisible(!isVisible)}>
                                        {!isVisible ?(
                                            <AiOutlineEyeInvisible/>
                                        ):( 
                                            <IoEyeSharp/>
                                        )}
                                </button>
                            </div>

                            {!loadingButton?(
                                <button className="p-3 font-semibold text-white duration-200 rounded-md bg-main hover:bg-maindark" 
                                type="submit">Alterar</button>
                            ):(
                                <FaSpinner className="self-center text-xl text-main animate-spin"/>
                            )}
                            
                        </form>
                        
                    </section>
                </main>
            ):(
                <section className="flex flex-col items-center justify-center w-full h-screen max-w-lg gap-6 p-6 m-auto text-center">
                    <h1 className="text-3xl font-bold">Link inválido ou expirado</h1>

                    <p className="text-neutral-500"
                    >Desculpe, mas o link que você tentou usar para alterar sua senha é inválido ou expirou. Por favor, tente gerar outro link.</p>
                                
                    <Link to={'/'} className="w-full p-3 font-semibold text-white duration-200 rounded-md bg-main hover:bg-maindark" 
                    type="submit">Página inicial</Link>
                </section>
            )}

        </>
    )
}