import axios, {AxiosError} from "axios";
import { parseCookies } from "nookies";


export const SetupApi= (ctx = undefined) =>{

    const cookies = parseCookies(ctx);

    const baseUrl = import.meta.env.VITE_APP_BASEURL;

    const api = axios.create({
        baseURL:baseUrl,
        headers:{
            Authorization: `Bearer ${cookies['@Sortex']}`
        }
    });

    api.interceptors.response.use(
        response =>{
            return response;
        },
        (error: AxiosError | any)=>{
            if (error.response.status === 401){
                if (typeof window !== 'undefined'){
                    /// deslogar
                }
            } else{
                return Promise.reject(error)
                
                } 
                return Promise.reject(error)
            }
        
    );
    
    return api;

}


