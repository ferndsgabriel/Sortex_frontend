import { FaSpinner } from "react-icons/fa";
import logo from "../../assets/logo.svg";
import icon from "../../assets/icon.svg";
import { useState, useRef, FormEvent } from "react";
import {toast} from "react-toastify";
import {isEmail} from "validator";
import { SetupApi } from "../../services";
import { Link } from "react-router-dom";



export default function Recovery(){
    const emailRef  = useRef<HTMLInputElement>(null);
    const [loadingButton, setLoadingButton] = useState(false);
    const api = SetupApi();

    async function recovery(e:FormEvent) {

        e.preventDefault();

        const email = emailRef.current? emailRef.current.value : '';

        if (!email){
            toast.warning('Digite seu e-mail');
            return;
        }
        
        if (!isEmail(email)){
            toast.warning('Digite um e-mail válido');
            return;
        }

        setLoadingButton(true);

        await api.post('/recovery',{
            email:email
        }).finally(()=>{
            setLoadingButton(false);
            toast.info('Se o endereço de email informado estiver cadastrado, você receberá um código de recuperação em breve.');
        })
    }


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
                        <h1 className="text-2xl font-bold">Recuperar senha</h1>
                        <p className="mt-2 text-lg text-neutral-500">Digite seu endereço de e-mail abaixo para receber um link de recuperação.</p>
                    </div>
                    
                    <form className="flex flex-col w-full gap-6 mt-8" onSubmit={recovery}>
                        <label className="flex flex-col gap-2">
                            <span className="font-bold">E-mail</span>
                            <input className="p-2 border-2 border-solid rounded-md focus:border-solid focus:border-neutral-500 focus:border-2 border-neutral-200 placeholder:text-neutral-500" 
                            type='text' placeholder="seu@gmail.com"  required={true} minLength={6}
                            ref={emailRef}/>
                        </label>

                        {!loadingButton?(
                            <button className="p-3 font-semibold text-white duration-200 rounded-md bg-main hover:bg-maindark" 
                            type="submit">Enviar link de recuperação</button>
                        ):(
                            <FaSpinner className="self-center text-xl text-main animate-spin"/>
                        )}
                            <Link to={'/'} className="text-center underline text-neutral-500 hover:text-black">Logar</Link>
                    </form>
                    
                </section>
            </main>
        </>
    )
}