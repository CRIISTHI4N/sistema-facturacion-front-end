import { useEffect } from "react";
import useUsuario from "@/hooks/useUsuario";
import { Nav } from "./Nav";
import { Header } from "./Header";
import axios from "axios";
import styles from '../styles/navBar.module.css'
import Link from "next/link";

export const Layout = ({ children }) => {

    const { usuario, setNoAcces } = useUsuario();

    useEffect(() => {
        const verificarUser = async () => {

            try {
                await axios.post(`${process.env.NEXT_PUBLIC_URL}/usuario/verificar-token`, { token: usuario?.token })

            } catch (error) {
                setNoAcces(error.response.data.msg)
            }
        }

        verificarUser()
    }, [])

    return (
        <>
            {usuario?._id ?
                (
                    <div className="flex">

                        <Nav />

                        <div className="flex flex-col w-full h-screen">

                            <Header />

                            <main className={`bg-[#f5f7f8] w-full h-full px-5 py-3 lg:px-16 lg:py-7 overflow-auto text-gray-800 ${styles.scroll}`}>
                                {children}
                            </main>
                        </div>
                    </div>
                )
                :
                <div className="w-screen h-screen bg-gradient-to-l from-[#232A2F] to-[#2A353D] flex justify-center items-center">
                    <div className="w-[90%] h-[90%] flex flex-col justify-center items-center text-white bg-gray-900 bg-opacity-30">
                        <p>Sin acceso al sistema</p>
                        <p>Probablemente quieras iniciar sesión</p>

                        <Link
                            href={'/'}
                            className="block my-10 bg-white text-black cursor-pointer px-3 py-2 rounded-md hover:bg-[#EFEFEF] font-normal shadow-lg shadow-gray-900"
                        >
                            Regresar al Inicio
                        </Link>
                    </div>
                </div>
            }
        </>
    )
}
