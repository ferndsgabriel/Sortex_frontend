import { FormEvent, useContext, useState } from "react";
import { AuthContext } from "../../contexts/AuthContexts";
import { SetupApi } from "../../services";
import {toast} from "react-toastify";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

import Header from "../../components/header";
import ContainerPages from "../../components/ui/containerPages";
import Title from "../../components/ui/titlePages";
import ButtonGoogle from "../../components/ui/buttonGoogle";
import Input from "../../components/ui/input";
import ButtonGreen from "../../components/ui/buttonGreen";
import zxcvbn from "zxcvbn";
import { AxiosError } from "axios";


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

export default function Settings(){
    const api = SetupApi();
    const {logout} = useContext(AuthContext);
    const [isRefeshData, setIsRefeshData] = useState(false);
    const [isLoadingChangePass, setIsLoadingChangePass] = useState(false);
    const [isLoadingSession, setIsLoadingSession] = useState(false);
    const [oldPass, setOldPass] = useState('');
    const [newPass, setNewPass] = useState('');


    const refreshDate = useGoogleLogin({
        onSuccess: async tokenResponse => {
            var userDateAuth: TokenInfo = await axios
            .get('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
            })
            .then(res => res.data);
            if (userDateAuth){
                setIsRefeshData(true);
                try {
                    await api.put('/dados',{
                        sub:userDateAuth.sub,
                        email:userDateAuth.email,
                        name:userDateAuth.name,
                        photo:userDateAuth.picture || null
                    })
                    toast.success('Dados atualizados com sucesso');
                } catch (error:AxiosError | any) {
                    toast.error(error.response.data.error)
                }
                finally{
                    setIsRefeshData(false);
                }
            }
        }
    });


    async function changePass(e:FormEvent) {
        e.preventDefault();

        if (!oldPass || !newPass){
            toast.warning('Preencha todos os campos');
            return;
        }
        
        const result = zxcvbn(newPass);

        if (result.score < 3) {
            toast.warning("A senha é fraca. Tente usar uma senha mais longa e complexa, incluindo letras maiúsculas, números e símbolos.");
            return;
        }

        setIsLoadingChangePass(true);

        try {
            const response = await api.put('/senha',{
                senhaNova:newPass,
                senhaAntiga:oldPass
            });

            const newSession = response.data;
            const sessionParse = JSON.stringify(newSession);
            localStorage.setItem('sortexSession', sessionParse);
            
        } catch (error:AxiosError | any) {
            toast.error(error.response.data.error);
        }finally{
            setNewPass("");
            setOldPass("");
            setIsLoadingChangePass(false);
        }
    }

    async function refreshSession() {
        setIsLoadingSession(true);
        try {
            const response = await api.put('/session');
            const newRefresh = response.data;

            const sessionParse = JSON.stringify(newRefresh);
            localStorage.setItem('sortexSession', sessionParse);
            
        } catch (error) {
            toast.error('Erro ao desconectar dispositivos');
        }finally{
            setIsLoadingSession(false);
        }    
    }
    
    return(
        <>
            <Header/>
            <ContainerPages>
                <Title text="Configurações"/>

                <section className="flex flex-col w-full max-w-xl gap-6 mt-16">
                    
                    <article className="flex flex-col gap-2">
                        <h2 className="text-xl font-semibold">Atualizar informações da conta</h2>
                        <p className="text-lg text-neutral-500">Reautentique-se com o Google para atualizar suas informações de perfil.</p>
                        <ButtonGoogle width="fit" disabled={isRefeshData} onClick={()=>refreshDate()}>
                            Atualizar informações
                        </ButtonGoogle>
                    </article>

                    <article className="flex flex-col gap-2">
                        <h2 className="text-xl font-semibold">Alterar senha</h2>
                        <p className="text-lg text-neutral-500">Atualize sua senha da conta.</p>
                        <form className="flex flex-col gap-2" onSubmit={changePass}>
                            <Input type="password" text="Senha atual" value={oldPass} onChange={(e)=>setOldPass(e.target.value)}
                            required={true} minLength={6} maxLength={30}/>

                            <Input type="password" text="Nova senha" value={newPass} onChange={(e)=>setNewPass(e.target.value)}
                            required={true} minLength={6} maxLength={30}/>

                            <ButtonGreen disabled={isLoadingChangePass}>Alterar senha</ButtonGreen>
                        </form>
                    </article>

                    <article className="flex flex-col gap-2">
                        <h2 className="text-xl font-semibold">Sair de outros dispositivos</h2>
                        <p className="text-lg text-neutral-500">Saia da sua conta em todos os outros dispositivos.</p>
                        <ButtonGreen disabled={isLoadingSession} width='fit' onClick={refreshSession}>
                            Sair de outros dispositivos
                        </ButtonGreen>
                    </article>

                    <article className="flex flex-col gap-2">
                        <h2 className="text-xl font-semibold">Sair</h2>
                        <p className="text-lg text-neutral-500">Saia da sua conta atual.</p>
                        <ButtonGreen disabled={false} width='fit' className="px-6 bg-red-600 hover:bg-red-900" onClick={logout}>Sair</ButtonGreen>
                    </article>
                </section>
            </ContainerPages>
        </>
    )
}