import { createContext, useEffect, useState } from "react";
import { ReactNode } from "react";
import { SetupApi } from "../services";
import { useNavigate } from "react-router-dom";
import { setCookie, parseCookies, destroyCookie } from "nookies";
import zxcvbn from 'zxcvbn';
import LoadingPage from "../components/loading";

type AuthContextData = {
    handleLogin:(credentials:LoginProps)=> Promise <void>;
    handleRegister:(credentials:SignupProps) => Promise <void>;
    logout:()=>void;
    isAuthenticated:boolean
}

type AuthProviderProps = {
    children: ReactNode;
}

type LoginProps = {
    sub:string;
    pass:string;
    email:string;
}

type SignupProps = {
    sub:string;
    pass:string;
    email:string;
    photo:string | null;
    name:string;
}

type UserProps = {
    email?:string;
    photo?:string | null;
    name?:string;
    _id?:string;
}

const AuthContext = createContext({} as AuthContextData);

export default function AuthProvider({children}:AuthProviderProps) {
    const [user, setUser] = useState <UserProps>();
    const navigate = useNavigate();
    const [loadingPage, setLoadingPage] = useState(true);

    let isAuthenticated = !!user

    const api = SetupApi();

    async function handleLogin({sub, pass, email}:LoginProps){
        if (!email){
            throw new Error ('Preencha todos os campos');
            
        }

        if (!pass && !sub){
            throw new Error ('Preencha todos os campos');
        }
        
        try {
            const response = await api.post('/authadm',{
                email:email,
                pass:pass,
                sub:sub
            });
            const token = response.data.token;
            const userData = response.data.user as UserProps;
            const sessionToken = response.data.sessionToken;

            const sessionParse = JSON.stringify(sessionToken);
            localStorage.setItem('sortexSession', sessionParse);

            setUser(userData);

            setCookie(undefined, '@sortex', token, {
                maxAge: 30 * 24 * 60 * 60,
                path: '/',
            });
                
            navigate('/start')
        } catch (error) {
            throw error
        }
    }


    async function handleRegister({photo, name, pass, sub, email}:SignupProps){

        if (!(email || photo || name || sub || pass)){
            throw new Error ('Preencha todos os campos');
        }
        
        const result = zxcvbn (pass);

        if (result.score < 3) { 
            throw new Error("A senha é fraca. Tente usar uma senha mais longa e complexa, incluindo letras maiúsculas, números e símbolos.");
        }
        try {
            await api.post('/adm',{
                email,
                pass,
                sub,
                name,
                photo
            }).then(async()=>{
                await handleLogin({sub, pass, email});
            })
        } catch (error) {
            throw error
        }
    }


    function logout(){
        try {
            destroyCookie(null, '@Sortex');
            setUser(undefined);
        } catch (error) {
            console.log(error);
        }
    }
    
    useEffect(()=>{
        async function getUserAuth(){
            logout ()
            const {'@Sortex':authToken} = parseCookies();

            if (!authToken){
                logout();
            }

            try {
                const response = await api.get('/adm');
                setUser(response.data.user);

                const dbToken = response.data.sessionToken;
                const sessionStorage = localStorage.getItem('sortexSession');
                const sessionParse = sessionStorage ? JSON.parse(sessionStorage ) : '';

                if (dbToken !== sessionParse){
                    logout();
                }
            } catch (error) {
                console.log(error);
                logout();
            }finally{
                setLoadingPage(false);
            }
        }

        getUserAuth();
    },[]);  

    if (loadingPage){
        return <LoadingPage/>
    }

    return(
        <AuthContext.Provider value={{handleLogin, handleRegister, isAuthenticated, logout}}>
            {children}
        </AuthContext.Provider>
    )
} 

export {AuthContext};