import axios, {AxiosError} from "axios";
import { parseCookies } from "nookies";


export const SetupApi= (ctx = undefined) =>{

    const cookies = parseCookies(ctx);
    
    const api = axios.create({
        baseURL:'http://localhost:3333',
        headers:{
            Authorization: `Bearer ${cookies['@sortex']}`
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


