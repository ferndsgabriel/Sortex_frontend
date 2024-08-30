import { Routes, Route, Navigate} from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./contexts/AuthContexts";




// sem autenticação
import Home from "./Pages/Home";
import Cadastrar from "./Pages/Signup";
import Recovery from "./Pages/Recovery";
import ChangePass from "./Pages/Changepass";

// com autenticação
import Start from "./Pages/Start";
import Account from "./Pages/Account";

const RoutesApp = ()=>{

    const {isAuthenticated} = useContext(AuthContext);
    return(
        <Routes>
                {isAuthenticated?(
                    <>
                        <Route path="/*" element={<Navigate to={'/start'}/>} />
                        <Route path="/start" element={<Start />} />
                        <Route path="/account" element={<Account />} />
                    </>
                ):(
                    <>
                        <Route path="*" element={<Navigate to={'/'}/>}/>
                        <Route path="/" element={<Home />} />
                        <Route path="/signup" element={<Cadastrar />} />
                        <Route path="/recovery" element={<Recovery />} />
                        <Route path="/recovery/:cod/:id" element={<ChangePass/>} />
                    </>
                )}
        </Routes>
    )
}



export default RoutesApp