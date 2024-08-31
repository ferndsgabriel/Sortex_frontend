import logo from "../../assets/logo.svg";
import icon from "../../assets/icon.svg";
import { useState, useContext, useRef, FormEvent } from "react";
import { AuthContext } from "../../contexts/AuthContexts";
import { useGoogleLogin  } from '@react-oauth/google';
import axios, { AxiosError } from "axios";
import {isEmail} from "validator";
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';

import ButtonGoogle from "../../components/ui/buttonGoogle";
import ButtonGreen from "../../components/ui/buttonGreen";
import Input from "../../components/ui/input";

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


export default function Home(){
    const {handleLogin} = useContext(AuthContext);
    const passRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const [loadingButton, setLoadingButton] = useState(false);

    async function login(e:FormEvent) {
        e.preventDefault();

        
        const pass = passRef.current ? passRef.current.value : '';
        const email = emailRef.current ? emailRef.current.value : '';

        if (!pass || !email){
            toast.warning('Preencha todos os campo');
            return;
        };

        if (!isEmail(email)){
            toast.warning('Digite um e-mail válido');
            return;
        }

        setLoadingButton(true);

        try {
            await handleLogin({sub:'', pass:pass, email: email});
            toast.success('Usuário logado com sucesso');
        }catch (error:AxiosError | any) {
            toast.error(error.response.data);
        }finally{
            setLoadingButton(false);
        }    
    }


    const loginGoogle = useGoogleLogin({
        onSuccess: async tokenResponse => {
            var userDateAuth: TokenInfo = await axios
            .get('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
            })
            .then(res => res.data);
            if (userDateAuth){
                const sub = userDateAuth.sub;
                const email = userDateAuth.email;

                setLoadingButton(true);
                try {
                    await handleLogin({sub:sub, pass:'', email: email});
                    toast.success('Usuário logado com sucesso');
                }catch (error:AxiosError | any) {
                    toast.error(error.response.data);
                }finally{
                    setLoadingButton(false);
                } 
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
                        <h1 className="text-2xl font-bold">Logar</h1>
                        <p className="mt-2 text-lg text-neutral-500">Digite seu e-mail e senha para entrar no sortex.</p>
                    </div>

                    <form className="flex flex-col w-full gap-6 mt-8" onSubmit={login}>

                        <Input text="Email" type="email" placeholder="email@example.com" 
                        required={true} minLength={6} maxLength={60}  ref={emailRef}/>

                        <Input text="Senha" type="password" placeholder="********"
                        required={true} minLength={6} maxLength={60} ref={passRef}/>
                        
                        <ButtonGreen disabled={loadingButton}>
                            Entrar
                        </ButtonGreen>

                        <ButtonGoogle disabled={loadingButton} onClick={()=>loginGoogle()} width="fit" >
                            Logar com google
                        </ButtonGoogle>

                        <span className="self-center w-full text-center text-neutral-500 max-w-96" 
                        >Não tem uma conta? <Link to={'/signup'} className="underline hover:text-black">Cadastre-se</Link> ou esqueceu sua senha? <Link to={'/recovery'} className="underline hover:text-black">Recuperar</Link>
                        </span>
                    </form>
                    
                </section>
            </main>
        </>
    )
}