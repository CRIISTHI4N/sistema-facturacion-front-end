import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { ModalCategoria } from '@/components/ModalCategoria';
import { Categoria } from '@/components/Categoria';
import useUsuario from "@/hooks/useUsuario";
import Modal from 'react-modal';
import useSWR from 'swr'
import axios from 'axios';
import styles from '../styles/sppiner.module.css'

const customStyles = {
    overlay: {
        backgroundColor: 'rgba(6, 6, 6, 0.45)',
        height: '100vh',
        width: '100vw'
    },
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        background: '#fff',
        padding: '0',
        maxWidth: '90%',
        maxHeight: '90%',
        overflow: 'hidden',
        overflow: 'auto',
    },
};

Modal.setAppElement('#__next');

export default function Categorias({ BASE_URL }) {
    const { changeModalCategoria, modalCategoria, noAcces, usuario } = useUsuario();
    const [busqueda, setBusqueda] = useState('')

    const fetcher = () => axios(`${BASE_URL}/categoria/listar-categorias/${usuario?.token}`).then(datos => datos.data)

    const { data, error, isLoading } = useSWR(`${BASE_URL}/categoria/listar-categorias/${usuario?.token}`, fetcher, { refreshInterval: 100 })


    const categoriasFiltradas = busqueda === ''
        ? data
        : data.filter(categorias => categorias.nombre.toLowerCase().includes(busqueda.toLowerCase()))

    return (
        <Layout>

            {error?.response?.data?.msg ?

                <p className='text-center text-xl'>{noAcces}</p>
                :
                <>
                    <div className="md:flex md:justify-between md:items-center text-gray-800 asd">
                        <div
                            className="flex items-center rounded-md bg-white shadow shadow-gray-200"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 ml-5 text-gray-400">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>

                            <input
                                type="text"
                                className="pl-2 pr-6 py-2 outline-none text-gray-800 placeholder-gray-400 w-full md:w-96 rounded-md"
                                placeholder="Buscar: Ej. Ropa y Calzado"
                                onChange={e => setBusqueda(e.target.value)}
                            />
                        </div>

                        <button
                            className="mt-3 md:mt-0 flex items-center gap-3 hover:bg-gray-300 px-3 py-2 rounded-xl"
                            onClick={changeModalCategoria}
                        >
                            Agregar
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-9 h-9">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </button>
                    </div>

                    {
                        data && data.length ?
                            <div className='overflow-auto'>
                                <table
                                    className={`w-full bg-white border mt-6 ${isLoading ? 'hidden' : 'table'}`}
                                >
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-start p-2 lg:px-7 lg:py-5">Nombre</th>
                                            <th className="text-start p-2 lg:px-7 lg:py-5">Descripción</th>
                                            <th className="text-start p-2 lg:px-7 lg:py-5">Estado</th>
                                            <th className="text-start p-2 lg:px-7 lg:py-5"></th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {
                                            categoriasFiltradas.map(categoria =>
                                                <Categoria
                                                    key={categoria._id}
                                                    categoria={categoria}
                                                    BASE_URL={BASE_URL}
                                                />
                                            )
                                        }
                                    </tbody>
                                </table>
                            </div>
                            :
                            <p className='text-center text-xl mt-10 uppercase'>Sin Categorías</p>
                    }

                    <div className={`${styles.skchase} ${isLoading ? 'block' : 'hidden'} my-16 m-auto`}>
                        <div className={`${styles.skchasedot}`}></div>
                        <div className={`${styles.skchasedot}`}></div>
                        <div className={`${styles.skchasedot}`}></div>
                        <div className={`${styles.skchasedot}`}></div>
                        <div className={`${styles.skchasedot}`}></div>
                        <div className={`${styles.skchasedot}`}></div>
                    </div>

                    <Modal
                        isOpen={modalCategoria}
                        style={customStyles}
                    >
                        <ModalCategoria
                            BASE_URL={BASE_URL}
                        />
                    </Modal>
                </>
            }
        </Layout>
    )
}

export async function getStaticProps() {
    const BASE_URL = process.env.URL_BACK
    return { props: { BASE_URL } }
}