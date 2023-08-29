import { useEffect, useState } from "react";
import { ModalMostrarStock } from "./ModalMostrarStock";
import Modal from 'react-modal';
import useUsuario from "@/hooks/useUsuario";
import axios from "axios";
import Swal from 'sweetalert2'
import Decimal from 'decimal.js';

const customStyles = {
    overlay: {
        backgroundColor: 'rgba(6, 6, 6, 0.45)',
        height: '100vh',
        width: '100vw',
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
        maxWidth: '90%',
        maxHeight: '90%',
        overflow: 'hidden',
        overflow: 'auto',
    },
};

Modal.setAppElement('#__next');

export const AgregarProducto = ({ id, BASE_URL, stockFiltrado, setBusqueda }) => {
    const [descripcionProducto, setDescripcionProducto] = useState('')
    const [cantidadProducto, setCantidadProducto] = useState(0)
    const [descuento, setDescuento] = useState(0)
    const [total, setTotal] = useState(0)
    const [agrePro, setAgrePro] = useState(false)
    const [editarPro, setEditarPro] = useState(false)
    const [alerta, setAlerta] = useState(false);
    const [idCuerpoFactura, setIdCuerpoFactura] = useState('')
    const [idStockTemp, setIdStockTemp] = useState('')
    const [productoState, setProductoState] = useState({})
    const [cantidadProductoTemp, setCantidadProductoTemp] = useState(0)

    const {
        changeModalStock,
        crearFormProducto,
        eliminarFormStock,
        modalStock,
        productos,
        setProductos,
        usuario,
        facturaState,
        editar
    } = useUsuario();

    const {
        _id,
        cuerpo: cuerpoState
    } = facturaState

    useEffect(() => {
        if (facturaState?._id) {
            productos.map(p => {
                if (p.id === id) {
                    setDescripcionProducto(p.descripcionProducto)
                    setCantidadProducto(p.cantidadProducto)
                    setCantidadProductoTemp(p.cantidadProducto)
                    setIdCuerpoFactura(p.idCuerpo)
                    setIdStockTemp(p.producto)
                    setDescuento(p.cantidadProducto)
                    setProductoState(p.precioUnitario)
                    setTotal(p.totalProducto.$numberDecimal)
                    setAgrePro(true)
                    setEditarPro(false)
                }
            })

            return;
        }

        setIdCuerpoFactura('')
        setCantidadProductoTemp(0)
        setDescripcionProducto('')
        setCantidadProducto(0)
        setDescuento(0)
        setProductoState({})
        setTotal(0)
        setAgrePro(false)
        setEditarPro(false)


    }, [facturaState])

    useEffect(() => {


        if (!editar) {
            setIdCuerpoFactura('')
            setCantidadProductoTemp(0)
            setDescripcionProducto('')
            setCantidadProducto(0)
            setDescuento(0)
            setProductoState({})
            setTotal(0)
            setAgrePro(false)
            setEditarPro(false)
        }
    }, [])

    const { _id: idStock, precioUnitario } = productoState

    useEffect(() => {

        if (cantidadProducto < 1 || isNaN(cantidadProducto) || cantidadProducto === '') { return }

        if (descuento < 0 || descuento > 100 || isNaN(descuento) || descuento === '') { return }

        if (precioUnitario?.$numberDecimal) {
            const decimalCantidad = new Decimal(cantidadProducto);
            const decimalPrecioUnitario = new Decimal(precioUnitario.$numberDecimal);
            const decimalDescuento = new Decimal(descuento);

            const subtotal = decimalCantidad.times(decimalPrecioUnitario);
            const descuentoAmount = subtotal.times(decimalDescuento).dividedBy(100);
            const finalTotal = subtotal.minus(descuentoAmount);

            setTotal(finalTotal);
        }

        // setTotal((cantidadProducto * Number(precioUnitario?.$numberDecimal)) - ((cantidadProducto * Number(precioUnitario?.$numberDecimal) * descuento) / 100))
    }, [cantidadProducto, precioUnitario, descuento])

    const crearProducto = async () => {

        if (descripcionProducto === '') { return }
        if (cantidadProducto < 1 || isNaN(cantidadProducto) || cantidadProducto === '') { return }

        if (descuento < 0 || descuento > 100 || isNaN(descuento) || descuento === '') { return }

        if (Object.keys(productoState).length === 0) {
            Swal.fire('Escogue un producto del Stock')
            return;
        }

        try {
            const { data } = await axios.post(`${BASE_URL}/factura/crear-cuerpo-factura/${usuario.token}`, {
                idStock,
                descripcionProducto,
                cantidadProducto,
                descuentoProducto: descuento
            })

            if (data.msg) {
                setAlerta(true)

                setTimeout(() => {
                    setAlerta(false)
                }, 2000);
                return
            }

            const { _id: idCuerpo } = data

            crearFormProducto({
                id,
                producto: idStock,
                totalProducto: total,
                descripcionProducto,
                cantidadProducto,
                descuentoProducto: descuento,
                idCuerpo
            })
            setCantidadProductoTemp(cantidadProducto)
            setIdCuerpoFactura(idCuerpo)
            setIdStockTemp(idStock) // OJOOOOOO
            setAgrePro(true) // Desabilita el icono de (+)

        } catch (error) { console.log(error) }
    }

    const editarProducto = async () => {

        if (descripcionProducto === '') { return }

        if (cantidadProducto < 1 || isNaN(cantidadProducto || cantidadProducto === '')) { return }

        if (descuento < 0 || descuento > 100 || isNaN(descuento) || descuento === '') { return }

        try {
            const { data } = await axios.put(`${BASE_URL}/factura/actualizar-cuerpo-factura/${usuario.token}`, {
                idCuerpoFactura,
                idStock: idStockTemp,
                descripcionProducto,
                cantidadProducto,
                descuentoProducto: descuento,
                cantidadProductoTemp
            })

            if (data.msg) {
                setAlerta(true)
                setCantidadProductoTemp(0)

                setTimeout(() => {
                    setAlerta(false)
                }, 2000);
                return
            }

            const nuevoPro = productos.map((p) => {
                if (p.id === id) {
                    p.producto = idStockTemp
                    p.descripcionProducto = descripcionProducto
                    p.cantidadProducto = cantidadProducto
                    p.descuentoProducto = descuento
                    p.totalProducto = total
                }

                return p;
            });

            setProductos(nuevoPro)
            setCantidadProductoTemp(cantidadProducto)
            setAgrePro(true)
            setEditarPro(false)

        } catch (error) { console.log(error) }
    }

    return (
        <div className="flex flex-col gap-3 md:flex-row md:justify-between md:items-start md:gap-12 mt-4">
            <div className="w-full flex flex-col lg:flex-row md:gap-6">
                <div className="mb-3">
                    <label
                        className="block mb-3"
                        htmlFor="descripcion-producto"
                    >
                        Descripción:
                    </label>
                    <input
                        onChange={e => setDescripcionProducto(e.target.value)}
                        value={descripcionProducto}
                        id="descripcion-producto"
                        type="text"
                        placeholder="*"
                        disabled={agrePro ? !editarPro : null}
                        className={`${agrePro ? editarPro ? 'bg-white text-black' : 'bg-transparent text-gray-500 border-[#F1F1F1]' : 'bg-white'} px-2 py-1 outline-none rounded-sm w-full border-2 placeholder:text-red-400 ${descripcionProducto === '' ? 'border-red-400' : ''}`}
                    />
                </div>

                <div className="mb-3">
                    <label
                        className="block mb-3"
                        htmlFor="cantidad"
                    >
                        Cantidad:
                    </label>
                    <input
                        value={cantidadProducto}
                        onChange={e => setCantidadProducto(e.target.value)}
                        min={0}
                        id="cantidad"
                        type="number"
                        disabled={agrePro ? !editarPro : null}
                        className={`${agrePro ? editarPro ? 'bg-white text-black' : 'bg-transparent text-gray-500 border-[#F1F1F1]' : 'bg-white'} px-2 py-1 outline-none rounded-sm w-full border-2 ${cantidadProducto < 1 || isNaN(cantidadProducto) || cantidadProducto === '' ? 'border-red-400' : ''}`}
                    />
                </div>
                <div className="mb-3">
                    <label
                        className="block mb-3"
                        htmlFor="decuento"
                    >
                        Decuento:
                    </label>
                    <input
                        value={descuento}
                        onChange={e => setDescuento(e.target.value)}
                        min={0}
                        id="decuento"
                        type="number"
                        disabled={agrePro ? !editarPro : null}
                        className={`${agrePro ? editarPro ? 'bg-white text-black' : 'bg-transparent text-gray-500 border-[#F1F1F1]' : 'bg-white'} px-2 py-1 outline-none rounded-sm w-full border-2 ${descuento < 0 || descuento > 100 || isNaN(descuento) || descuento === '' ? 'border-red-400' : ''}`}
                    />
                </div>

                <div className="flex gap-5 justify-between">
                    <div className="mb-3">
                        <label
                            className="block mb-3"
                            htmlFor="precio-unitario"
                        >
                            Pre. Uni:
                        </label>
                        <input
                            readOnly
                            disabled
                            value={precioUnitario?.$numberDecimal === undefined ? '' : precioUnitario?.$numberDecimal}
                            id="precio-unitario"
                            type="number"
                            className={`${agrePro ? editarPro ? 'text-black' : 'bg-gray-200 text-gray-500' : ''} bg-transparent px-2 py-1 outline-none rounded-sm w-full cursor-not-allowed`}
                        />
                    </div>
                    <div className="mb-3">
                        <label
                            className="block mb-3"
                            htmlFor="total"
                        >
                            Total:
                        </label>
                        <input
                            readOnly
                            disabled
                            value={total ? total : 0}
                            id="total"
                            type="number"
                            className={`${agrePro ? editarPro ? ' text-black' : 'bg-gray-200 text-gray-500' : ''} bg-transparent px-2 py-1 outline-none rounded-sm w-full cursor-not-allowed`}
                        />
                    </div>
                </div>
            </div>

            <div className="flex gap-3 items-center md:mt-8 lg:mt-0 relative">

                <span
                    className={`${alerta ? 'block' : 'hidden'} bg-red-500 rounded-md p-1 text-sm absolute text-center top-[-50px]`}
                >
                    La cantidad supera el stock
                </span>

                <button
                    type="button"
                    className={`bg-[#51B1D3] hover:bg-[#238DB4] px-2 rounded-full p-2 ${agrePro ? 'hidden' : 'block'}`}
                    onClick={changeModalStock}
                >
                    Stock
                </button>

                {agrePro &&
                    <button
                        type="button"
                        className="bg-red-400 hover:bg-red-600 px-2 rounded-full p-2"
                        onClick={() => eliminarFormStock(id, idCuerpoFactura, idStock, cantidadProducto)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                    </button>
                }

                <button
                    type="button"
                    className={`${agrePro ? 'block' : 'hidden'} ${editarPro ? 'hidden' : 'block'} bg-orange-400 hover:bg-orange-600 px-2 rounded-full p-2`}
                    onClick={() => setEditarPro(true)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>
                </button>

                <button
                    type="button"
                    className={`bg-green-400 hover:bg-green-600 px-2 rounded-full p-2 ${agrePro ? 'hidden' : 'block'} ${editarPro ? 'hidden' : ''}`}
                    onClick={crearProducto}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                </button>

                <button
                    type="button"
                    className={`bg-orange-400 hover:bg-orange-600 px-2 rounded-full p-2 ${editarPro ? 'block' : 'hidden'}`}
                    onClick={editarProducto}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                </button>

                <Modal
                    isOpen={modalStock}
                    style={customStyles}
                >
                    <ModalMostrarStock
                        BASE_URL={BASE_URL}
                        stockFiltrado={stockFiltrado}
                        setProductoState={setProductoState}
                        setCantidadProductoTemp={setCantidadProductoTemp}
                        setBusqueda={setBusqueda}
                    />
                </Modal>
            </div>

            <hr className='border-gray-400 my-5' />

        </div>
    )
}
