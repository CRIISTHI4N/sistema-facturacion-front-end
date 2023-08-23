import useUsuario from '@/hooks/useUsuario'
import { useRouter } from 'next/router';
import styles from '../styles/navBar.module.css'

export default function PageError() {

    const { usuario } = useUsuario();

    const router = useRouter()

    const redirigir = () => {
        usuario?._id ? router.push('/inicio') : router.push('/')
    }

    return (
        <div className={`${styles.page_error} w-screen h-screen min-w-screen min-h-screen bg-gradient-to-tl from-[#232A2F] to-[#404446] flex justify-center items-center overflow-y-auto text-center text-white font-bold `}>

            <div
                className='w-[90%] h-[90%] md:w-[60%] md:h-[70%] flex flex-col p-5 justify-center items-center bg-gray-900 bg-opacity-30 shadow-lg rounded-md'
            >
                <h2 className="font-bold text-7xl my-5">404</h2>
                <p className="text-lg">Página no encontrada, parece que se esfumó en el éter.</p>

                <button
                    type="button"
                    className="block my-10 bg-white text-black cursor-pointer px-3 py-2 rounded-md hover:bg-[#EFEFEF] font-normal shadow-lg shadow-gray-900"
                    onClick={redirigir}
                >
                    Regresar al Inicio
                </button>

            </div>

        </div>
    )
}