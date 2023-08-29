import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import useUsuario from "@/hooks/useUsuario";
import { useRouter } from "next/router";
import styles from '../styles/navBar.module.css'
import useSWR from 'swr'
import axios from "axios";
import Swal from 'sweetalert2'

export default function Negocio({ BASE_URL }) {

    const [formPass, setFormPass] = useState(false)
    const [editar, setEditar] = useState(false)
    const [name, setName] = useState('')
    const [user, setUser] = useState('')
    const [pass, setPass] = useState('')
    const [confirmarPass, setConfirmarPass] = useState('')

    const { noAcces, usuario, cerrarSesion } = useUsuario()
    const router = useRouter()

    const fetcher = () => axios(`${BASE_URL}/factura/ventas/${usuario.token}`).then(datos => datos.data)
    const { data, error, isLoading } = useSWR(`${BASE_URL}/factura/ventas/${usuario.token}`, fetcher, { refreshInterval: 100 })

    useEffect(() => {
        if (usuario?._id) {
            setName(usuario?.name)
            setUser(usuario?.user)
            return;
        }

        setName('')
        setUser('')

    }, [usuario])

    const handleCambiarPass = async e => {
        e.preventDefault()

        if ([pass, confirmarPass].includes('')) { return }

        if (pass !== confirmarPass) {
            Swal.fire('La contraseñas no son iguales')
            return
        }

        try {
            await axios.put(`${BASE_URL}/usuario/actualizar/${usuario?._id}/${usuario.token}`, { pass })
            cerrarSesion()
            router.push('/')
            Swal.fire('Contraseña cambiada correctamente')
            setPass('')
            setConfirmarPass('')

        } catch (e) {
            Swal.fire(`${e.response.data.msg}`)
        }
    }

    const handleCambiarUser = async e => {
        e.preventDefault()

        if ([name, user].includes('')) { return }

        try {
            await axios.put(`${BASE_URL}/usuario/actualizar/${usuario?._id}/${usuario.token}`, { name, user })
            Swal.fire('Actualizado correctamente \n Vuelva a iniciar sesión para visualizar los cambios')
            setEditar(false)

        } catch (e) {
            Swal.fire(`${e.response.data.msg}`)
        }

    }

    return (
        <Layout>

            {error?.response?.data?.msg ?
                <p className='text-center text-xl'>{noAcces}</p>
                :
                <>

                    <div className="w-full grid md:grid-cols-3 text-white gap-5">

                        <div className={`bg-green-600 rounded-md h-fit`}>
                            <div className={`${styles.icon_money} p-5`}>
                                <h2 className="font-bold mb-5 text-2xl">$ {data?.totalVentasDia}</h2>
                                <p>Ganancias del día</p>
                            </div>

                            <span className="block w-full h-6 bg-green-700 rounded-b-md"></span>
                        </div>

                        <div className={`bg-cyan-600 rounded-md h-fit`}>
                            <div className={`${styles.icon_money} p-5`}>
                                <h2 className="font-bold mb-5 text-2xl">$ {data?.totalVentasMes}</h2>
                                <p>Ganancias del mes</p>
                            </div>

                            <span className="block w-full h-6 bg-cyan-700 rounded-b-md"></span>
                        </div>

                        <div className={`bg-orange-600 rounded-md h-fit`}>
                            <div className={`${styles.icon_money} p-5`}>
                                <h2 className="font-bold mb-5 text-2xl">$ {data?.totalVentasMesPasado}</h2>
                                <p>Ganancias mes pasado</p>
                            </div>

                            <span className="block w-full h-6 bg-orange-700 rounded-b-md"></span>
                        </div>
                    </div>

                    <h2 className="text-2xl mt-5">Mis Datos:</h2>

                    <form
                        onSubmit={handleCambiarUser}
                    >

                        <div className="my-3 flex items-center gap-3">
                            <button
                                type="button"
                                className={`${editar ? 'hidden' : 'block'} bg-green-400 hover:bg-green-600 p-2 rounded-full`}
                                onClick={() => setEditar(true)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                </svg>
                            </button>

                            <button
                                type="submit"
                                className={`${editar ? 'block' : 'hidden'} bg-orange-400 hover:bg-orange-600 p-2 rounded-full`}
                            >

                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>

                            </button>

                            <button
                                type="button"
                                className={`${editar ? 'block' : 'hidden'} bg-red-400 hover:bg-red-600 p-2 rounded-full`}
                                onClick={() => {
                                    setEditar(false)
                                    setName(usuario?.name)
                                    setUser(usuario?.user)
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="flex items-center mb-3 gap-3">
                            <label
                                htmlFor="nombre"
                                className="block my-3"
                            >
                                Nombre:
                            </label>

                            <input
                                type="text"
                                id="nombre"
                                disabled={!editar}
                                placeholder="*"
                                className={`${name === '' ? 'border-red-400 placeholder:text-red-400' : ''} ${editar ? '' : 'cursor-not-allowed'} border-2 px-2 py-1 outline-none rounded-sm w-full md:w-1/3`}
                                onChange={e => setName(e.target.value)}
                                value={name}
                            />
                        </div>

                        <div className="flex items-center mb-3 gap-3">
                            <label
                                htmlFor="user"
                                className="block my-3"
                            >
                                Usuario:
                            </label>

                            <input
                                type="text"
                                id="user"
                                disabled={!editar}
                                placeholder="*"
                                className={`${user === '' ? 'border-red-400 placeholder:text-red-400' : ''} ${editar ? '' : 'cursor-not-allowed'} border-2 px-2 py-1 outline-none rounded-sm w-full md:w-1/3`}
                                onChange={e => setUser(e.target.value)}
                                value={user}
                            />
                        </div>
                    </form>

                    <button
                        type="buton"
                        className="bg-[#2291B9] text-white font-bold cursor-pointer px-3 py-2 rounded-md hover:bg-[#2F9CC4] mt-5"
                        onClick={() => setFormPass(true)}
                    >
                        Cambiar Contraseña
                    </button>

                    <form
                        onSubmit={handleCambiarPass}
                        className={`${formPass ? 'block' : 'hidden'}`}
                    >
                        <div className="mb-3">
                            <label
                                htmlFor="pass"
                                className="block my-3"
                            >
                                Nueva Contraseña:
                            </label>
                            <input
                                type="password"
                                id="pass"
                                placeholder="*"
                                className={`${pass === '' ? 'border-red-400 placeholder:text-red-400' : ''} border-2 px-2 py-1 outline-none rounded-sm w-full md:w-1/3`}
                                onChange={e => setPass(e.target.value)}
                                value={pass}
                            />
                        </div>

                        <div className="mb-3">
                            <label
                                htmlFor="pass-confirm"
                                className="block my-3"
                            >
                                Confirmar Contraseña:
                            </label>
                            <input
                                type="password"
                                id="pass-confirm"
                                placeholder="*"
                                className={`${confirmarPass === '' ? 'border-red-400 placeholder:text-red-400' : ''} border-2 px-2 py-1 outline-none rounded-sm w-full md:w-1/3`}
                                onChange={e => setConfirmarPass(e.target.value)}
                                value={confirmarPass}
                            />
                        </div>

                        <button
                            type="submit"
                            className="bg-[#2291B9] text-white font-bold cursor-pointer px-3 py-2 rounded-md hover:bg-[#2F9CC4] mt-3"
                        >
                            Confirmar
                        </button>

                        <button
                            type="button"
                            className="bg-red-600 text-white font-bold cursor-pointer px-3 py-2 rounded-md hover:bg-red-500 mt-3 ml-3"
                            onClick={() => {
                                setFormPass(false)
                                setPass('')
                                setConfirmarPass('')
                            }}
                        >
                            Cancelar
                        </button>
                    </form>
                </>
            }

        </Layout >
    )
}

export async function getStaticProps() {
    const BASE_URL = process.env.URL_BACK
    return { props: { BASE_URL } }
}