import { FaSpinner } from "react-icons/fa";
import { AiOutlineEyeInvisible } from "react-icons/ai";
import { IoEyeSharp } from "react-icons/io5";
import logo from "../../assets/logo.svg";
import icon from "../../assets/icon.svg";
import { useState, useContext, useRef, FormEvent } from "react";
import { AuthContext } from "../../contexts/AuthContexts";
import { useGoogleLogin  } from '@react-oauth/google';
import axios, { AxiosError } from "axios";
import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { toast } from 'react-toastify';
import zxcvbn from "zxcvbn";

interface TokenInfo {
    iss: string;
    azp: string;
    aud: string;
    sub: string;
    email: string;
    email_verified: boolean;
    exp: number;
    family_name: string;
    given_name: string;
    iat: number;
    jti: string;
    locale: string;
    name: string;
    nbf: number;
    picture: string;
}


interface dataGoogleProps{
    sub: string;
    email: string;
    name: string;
    photo: string | null;
}

export default function Cadastrar(){
    const [isVisible, setIsVisible] = useState(false);
    const {handleRegister} = useContext(AuthContext);
    const passRef = useRef<HTMLInputElement>(null);
    const confirmPassRef = useRef<HTMLInputElement>(null);
    const [dataGoogle, setDataGoogle] = useState<dataGoogleProps>();
    const [loadingButton, setLoadingButton] = useState(false);
    
    async function signup(e:FormEvent) {
        e.preventDefault();

        const pass = passRef.current ? passRef.current.value : '';
        const confirmPass = confirmPassRef.current ? confirmPassRef.current.value : '';

        if (!(pass || confirmPass || dataGoogle?.email || dataGoogle?.name || dataGoogle?.sub )){
            toast.warning('Preencha todos os campo');
            return;
        };

        const result = zxcvbn(pass);
    
        if (result.score < 3) {
            toast.warning("A senha é fraca. Tente usar uma senha mais longa e complexa, incluindo letras maiúsculas, números e símbolos.");
            return;
        }
    
        if (pass !== confirmPass){
            toast.warning('Senha diferentes');
            return;
        }

        if (dataGoogle){
            setLoadingButton(true);
            try {
                await handleRegister({
                email:dataGoogle?.email,
                name:dataGoogle?.name,
                photo:dataGoogle?.photo,
                pass:pass,
                sub:dataGoogle?.sub
                });
                toast.success('Usuário cadastrado com sucesso');
            } catch (error:AxiosError | any) {
                console.log(error)
                toast.error(error.response.data.error || 'Erro ao cadastrar, verifique seus dados');
            }finally{
                setLoadingButton(false);
            } 
        }
    }


    const signupGoogle = useGoogleLogin({
        onSuccess: async tokenResponse => {
            var userDateAuth: TokenInfo = await axios
            .get('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
            })
            .then(res => res.data);
            if (userDateAuth){
                const data = {
                    sub:userDateAuth.sub,
                    email:userDateAuth.email,
                    name:userDateAuth.name,
                    photo:userDateAuth.picture || null
                }
                setDataGoogle(data);
            }
        },
    });

    return(
        <>
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
                        <h1 className="text-2xl font-bold">Cadastre-se</h1>
                        <p className="mt-2 text-lg text-neutral-500">Cadastre-se na Sortex e comece a criar e gerenciar seus próprios sorteios e rifas de forma fácil e segura.</p>
                    </div>
                    
                    <form className="flex flex-col w-full gap-6 mt-8" onSubmit={signup}>
                        {!dataGoogle &&(
                            <button onClick={()=>signupGoogle()} disabled={loadingButton} type="button"
                            className="flex items-center gap-4 p-2 duration-200 border-2 border-solid rounded-md hover:border-neutral-500 border-neutral-200">
                                < FcGoogle /> <span>Cadastre-se com google</span>
                            </button>
                            )}

                        {dataGoogle &&(
                            <>
                                <div>
                                    <label className="flex flex-col gap-2">
                                        <span className="font-bold">Crie uma senha</span>
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
                                        <span className="font-bold">Confirme sua senha</span>
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
                                    type="submit">Cadastrar</button>
                                ):(
                                    <FaSpinner className="self-center text-xl text-main animate-spin"/>
                                )}
                            </>
                            
                        )}
                        <span className="self-center w-full text-center text-neutral-500 max-w-96" 
                        >Já tem uma conta? <Link to={'/'} className="underline hover:text-black">Logar</Link> ou esqueceu sua senha? <Link to={'/recovery'} className="underline hover:text-black">Recuperar</Link>
                        </span>
                    </form>
                    
                </section>
            </main>
        </>
    )
}