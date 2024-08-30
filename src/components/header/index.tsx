import { IoIosMenu, IoMdSettings } from "react-icons/io";
import icon from "../../assets/iconwhite.svg";
import { useRef, useContext  } from "react";
import { IoClose } from "react-icons/io5";
import { AuthContext } from "../../contexts/AuthContexts";
import { Link, useLocation } from "react-router-dom";
import { RiCoupon2Line } from "react-icons/ri";
import { AiFillProduct } from "react-icons/ai";
import { MdPayments, MdInsights } from "react-icons/md";
import { TiSocialAtCircular } from "react-icons/ti";
import { FaPowerOff } from "react-icons/fa6";


export default function Header(){
    const navRef = useRef<HTMLDivElement>(null);
    const backgroundRef = useRef<HTMLDivElement>(null);
    const {logout} = useContext(AuthContext);
    const location = useLocation().pathname;

    console.log(location)

    function openNav(){
        if (navRef.current){
            navRef.current.classList.remove('hidden');
            navRef.current.classList.add('flex');
            navRef.current.classList.add('animate-openNav');
            if (backgroundRef.current){
                backgroundRef.current.classList.remove('hidden');
            }
        }
    }

    function closeNav(){
        if (navRef.current){
            navRef.current.classList.remove('animate-openNav');
            navRef.current.classList.add('animate-closeNav');
            backgroundRef.current?.classList.add('hidden');
            setTimeout(()=>{
                navRef.current?.classList.remove('animate-closeNav');
                navRef.current?.classList.add('hidden');
            },1000);
        }
    }
    
    return(
        <>
            <header className="fixed top-0 left-0 z-40 flex items-center justify-between w-full h-16 p-4 bg-main lg:hidden">

                <button onClick={openNav} 
                className="text-2xl text-white">
                    <IoIosMenu/>
                </button>

                <img src={icon} alt="icon sortex" 
                className="w-12 aspect-square"/>
            </header>

            <div ref={backgroundRef} onClick={closeNav}
            className="fixed top-0 left-0 hidden w-full h-screen bg-black opacity-35 lg:hidden"/>


            <nav className="fixed top-0 left-0 z-40 flex-col items-start hidden h-screen p-0 shadow-2xl bg-main w-80 lg:animate-none lg:flex" 
            ref={navRef}>

                <button onClick={closeNav} className="flex items-center justify-center w-16 h-16 p-4 text-white bg-maindark lg:hidden">
                    <IoClose className="text-3xl"/>
                </button>
                
                <ul className="w-full h-full">
                    <li className="w-full">
                        <Link to={'/'} className="flex items-center w-full h-16 gap-4 text-white duration-200 hover:bg-maindark group">
                            <div className="flex items-center justify-center h-full text-2xl shadow-md group-hover:shadow-black bg-maindark aspect-square">
                                <RiCoupon2Line />
                            </div>
                            <span className={`${location === '/start' ? '' : 'opacity-70'}`}>Sorteios</span>
                        </Link>
                    </li>
                    <li className="w-full">
                        <Link to={'/'} className="flex items-center w-full h-16 gap-4 text-white duration-200 hover:bg-maindark group">
                            <div className="flex items-center justify-center h-full text-2xl shadow-md group-hover:shadow-black bg-maindark aspect-square">
                                <AiFillProduct/>
                            </div>
                            <span className={`${location === '/products' ? '' : 'opacity-70'}`}>Produtos</span>
                        </Link>
                    </li>
                    <li className="w-full">
                        <Link to={'/account'} className="flex items-center w-full h-16 gap-4 text-white duration-200 hover:bg-maindark group">
                            <div className="flex items-center justify-center h-full text-2xl shadow-md group-hover:shadow-black bg-maindark aspect-square">
                                <MdPayments/>
                            </div>
                            <span className={`${location === '/account' ? '' : 'opacity-70'}`}>Conta</span>
                        </Link>
                    </li>
                    <li className="w-full">
                        <Link to={'/'} className="flex items-center w-full h-16 gap-4 text-white duration-200 hover:bg-maindark group">
                            <div className="flex items-center justify-center h-full text-2xl shadow-md group-hover:shadow-black bg-maindark aspect-square">
                                <TiSocialAtCircular/>
                            </div>
                            <span className={`${location === '/social' ? '' : 'opacity-70'}`}>Redes sociais</span>
                        </Link>
                    </li>
                    <li className="w-full">
                        <Link to={'/'} className="flex items-center w-full h-16 gap-4 text-white duration-200 hover:bg-maindark group">
                            <div className="flex items-center justify-center h-full text-2xl shadow-md group-hover:shadow-black bg-maindark aspect-square">
                                <MdInsights/>
                            </div>
                            <span className={`${location === '/dashboard' ? '' : 'opacity-70'}`}>Insights</span>
                        </Link>
                    </li>
                    <li className="w-full">
                        <Link to={'/'} className="flex items-center w-full h-16 gap-4 text-white duration-200 hover:bg-maindark group">
                            <div className="flex items-center justify-center h-full text-2xl shadow-md group-hover:shadow-black bg-maindark aspect-square">
                                <IoMdSettings/>
                            </div>
                            <span className={`${location === '/settings' ? '' : 'opacity-70'}`}>Configurações</span>
                        </Link>
                    </li>
                </ul>
            
                <div className="flex items-end justify-center w-16 h-full text-white bg-maindark">
                    <button onClick={logout} className="mb-16 hover:opacity-50">
                        <FaPowerOff />
                    </button>
                </div>

            </nav>
        </>
    )
}