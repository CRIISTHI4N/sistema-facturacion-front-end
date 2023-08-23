import Link from "next/link"
import { useRouter } from "next/router"
import styles from '../styles/navBar.module.css'
import useUsuario from "@/hooks/useUsuario"

export const Nav = () => {

    const { changeNavbar, navbar, changeOpcFactura, opcFactura, toggle, cerrarSesion } = useUsuario();
    const router = useRouter()

    return (
        <nav
            className={`${toggle ? 'right-[calc(100%-145px)]' : ''} fixed right-[100%] xl:relative xl:right-0 text-white bg-[#232A2F] h-screen xl:flex xl:flex-col main-navbar transition-width duration-300 overflow-hidden overflow-y-auto ${styles.scroll} ${navbar ? 'w-[145px]' : 'w-72'} z-20`}
        >
            <p
                className={`hidden xl:flex items-center py-4 px-7 bg-[#1b2227] font-bold border-b border-black ${navbar ? 'justify-center' : 'justify-between'}`}
            >
                {!navbar && <span className="block text-[#3EA8CE]">MI TIENDA</span>}

                <button
                    className="hover:bg-[#3EA8CE] p-2 rounded-full transition-colors"
                    onClick={changeNavbar}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                    </svg>
                </button>
            </p>

            <div className="h-full flex flex-col justify-between">
                <ul className="p-5">
                    <li>
                        <Link
                            href="/inicio"
                            className={`${router.pathname === '/inicio' ? 'bg-[#404446]' : ''} flex hover:bg-[#404446] rounded-md py-3 px-2 transition-colors ${navbar ? 'text-[12px] flex-col items-center gap-1' : 'gap-4'}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                            </svg>
                            Inicio
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/categorias"
                            className={`${router.pathname === '/categorias' ? 'bg-[#404446]' : ''} flex hover:bg-[#404446] rounded-md py-3 px-2 transition-colors ${navbar ? 'text-[12px] flex-col items-center gap-1' : 'gap-4'}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                            </svg>
                            Categorías
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/stock"
                            className={`${router.pathname === '/stock' ? 'bg-[#404446]' : ''} flex hover:bg-[#404446] rounded-md py-3 px-2 transition-colors ${navbar ? 'text-[12px] flex-col items-center gap-1' : 'gap-4'}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5" />
                            </svg>
                            Stock
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/proveedores"
                            className={`${router.pathname === '/proveedores' ? 'bg-[#404446]' : ''} flex hover:bg-[#404446] rounded-md py-3 px-2 transition-colors ${navbar ? 'text-[12px] flex-col items-center gap-1' : 'gap-4'}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                            </svg>
                            Proveedores
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/clientes"
                            className={`${router.pathname === '/clientes' ? 'bg-[#404446]' : ''} flex hover:bg-[#404446] rounded-md py-3 px-2 transition-colors ${navbar ? 'text-[12px] flex-col items-center gap-1' : 'gap-4'}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                            </svg>
                            Clientes
                        </Link>
                    </li>
                    <li>
                        <button
                            className={`flex items-center hover:bg-[#404446] rounded-md py-3 px-2 transition-colors enlace w-full ${navbar ? 'text-[12px] flex-col items-center gap-1' : 'gap-4'}`}
                            onClick={changeOpcFactura}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                            </svg>

                            Facturas

                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-4 h-4 transition-transform duration-200 ${opcFactura ? 'rotate-90' : ''}`}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                            </svg>

                        </button>

                        <ul className={`${opcFactura ? 'block' : 'hidden'}`}>
                            <li>
                                <Link
                                    href="/cabeceras"
                                    className={`${router.pathname === '/cabeceras' ? 'bg-[#404446]' : ''} flex gap-4 hover:bg-[#404446] rounded-md py-3 px-2 transition-colors ${navbar ? 'text-[12px]' : ''}`}
                                >
                                    Cabeceras
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/facturas"
                                    className={`${router.pathname === '/facturas' ? 'bg-[#404446]' : ''} flex gap-4 hover:bg-[#404446] rounded-md py-3 px-2 transition-colors ${navbar ? 'text-[12px]' : ''}`}
                                >
                                    Factura Final
                                </Link>
                            </li>
                        </ul>
                    </li>
                </ul>

                <ul className="p-5">
                    <li>
                        <Link
                            href="/"
                            className={`flex hover:bg-[#404446] rounded-md py-3 px-2 transition-colors enlace ${navbar ? 'text-[12px] flex-col items-center gap-1' : 'gap-4'}`}
                            onClick={cerrarSesion}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" />
                            </svg>
                            Salir
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    )
}
