import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Factura } from '@/components/Factura';
import { ModalFactura } from '@/components/ModalFactura';
import { ModalDetalleFactura } from '@/components/ModalDetalleFactura';
import { ModalSppiner } from '@/components/ModalSppiner';
import useUsuario from "@/hooks/useUsuario";
import useSWR from 'swr'
import axios from 'axios';
import Modal from 'react-modal';
import styles from '../styles/sppiner.module.css'

const customStylesFactura = {
    overlay: {
        backgroundColor: 'rgba(6, 6, 6, 0.45)',
        height: '100vh',
        width: '100vw',
        scrollbarColor: 'red',
        zIndex: '21'
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
        width: '90%',
        height: '90%',
        overflowY: 'hidden',
        overflowY: 'auto',
    },
};

const customStylesDetalleFactura = {
    overlay: {
        backgroundColor: 'rgba(6, 6, 6, 0.45)',
        height: '100vh',
        width: '100vw',
        scrollbarColor: 'red'
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
        overflowY: 'hidden',
        overflowY: 'auto',
    },
};

const customStylesSpinner = {
    overlay: {
        backgroundColor: 'rgba(6, 6, 6, 0.30)',
        height: '100vh',
        width: '100vw',
        scrollbarColor: 'red',
        zIndex: '30'
    },
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        background: '#00000000',
        padding: '0',
        width: '100%',
        height: '100%',
        overflowY: 'hidden',
        overflowY: 'auto',
    },
};

Modal.setAppElement('#__next');

export default function Facturas({ BASE_URL }) {

    const [busqueda, setBusqueda] = useState('')

    const {
        changeModalFactura,
        modalFactura,
        modalDetalleFactura,
        sppiner,
        noAcces,
        usuario
    } = useUsuario();

    const fetcher = () => axios(`${BASE_URL}/factura/listar-facturas/${usuario.token}`).then(datos => datos.data)
    const { data, error, isLoading } = useSWR(`${BASE_URL}/factura/listar-facturas/${usuario.token}`, fetcher, { refreshInterval: 100 })

    const facturasFiltradas = busqueda === ''
        ? data
        : data.filter(facturas => facturas.numeroFactura.toLowerCase().includes(busqueda.toLowerCase()))

    return (
        <Layout>
            {error?.response?.data?.msg ?

                <p className='text-center text-xl'>{noAcces}</p>
                :
                <>
                    <div className="md:flex md:justify-between md:items-center text-gray-800">
                        <div
                            className="flex items-center rounded-md bg-white shadow shadow-gray-200"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 ml-5 text-gray-400">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>

                            <input
                                type="text"
                                className="pl-2 pr-6 py-2 outline-none text-gray-800 placeholder-gray-400 w-full md:w-96 rounded-md"
                                placeholder="Buscar: Ej. 1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed"
                                onChange={e => setBusqueda(e.target.value)}
                            />
                        </div>

                        <button
                            className="mt-3 md:mt-0 flex items-center gap-3 hover:bg-gray-300 px-3 py-2 rounded-xl"
                            onClick={changeModalFactura}
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
                                    className="w-full bg-white border mt-6"
                                >
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-start p-2 lg:px-7 lg:py-5">Nº Factura</th>
                                            <th className="text-start p-2 lg:px-7 lg:py-5">Subtotal</th>
                                            <th className="text-start p-2 lg:px-7 lg:py-5">Descuento</th>
                                            <th className="text-start p-2 lg:px-7 lg:py-5">Total</th>
                                            <th className="text-start p-2 lg:px-7 lg:py-5">Fecha</th>
                                            <th className="text-start p-2 lg:px-7 lg:py-5"></th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {
                                            facturasFiltradas.map(factura =>
                                                <Factura
                                                    key={factura._id}
                                                    factura={factura}
                                                    BASE_URL={BASE_URL}
                                                />
                                            )
                                        }
                                    </tbody>
                                </table>
                            </div>
                            :
                            <p className='text-center text-xl mt-10 uppercase'>
                                Sin Facturas
                            </p>
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
                        isOpen={modalFactura}
                        style={customStylesFactura}
                    >
                        <ModalFactura
                            BASE_URL={BASE_URL}
                        />
                    </Modal>

                    <Modal
                        isOpen={modalDetalleFactura}
                        style={customStylesDetalleFactura}
                    >
                        <ModalDetalleFactura
                            BASE_URL={BASE_URL}
                        />
                    </Modal>

                    <Modal
                        isOpen={sppiner}
                        style={customStylesSpinner}
                    >
                        <ModalSppiner />
                    </Modal>
                </>
            }
        </Layout>
    )
}

export const getServerSideProps = async () => {
    const BASE_URL = process.env.URL_BACK
    return { props: { BASE_URL } }
}