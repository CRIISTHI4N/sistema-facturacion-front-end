import { useEffect, useState } from "react";
import useUsuario from "@/hooks/useUsuario"
import { formatearFechaFactura } from "@/helpers";
import axios from "axios";
import Swal from 'sweetalert2'

export const ModalDetalleFactura = ({ BASE_URL }) => {

    const [datos, setDatos] = useState({})
    const { idFactura: id, changeModalDetalleFactura, setIdFactura, setSppiner, usuario, setEditar, changeModalFactura, setFacturaState } = useUsuario();

    const controlModal = () => {
        changeModalDetalleFactura()
        setDatos({})
        setIdFactura('')
    }

    useEffect(() => {
        const datos = async () => {
            setSppiner(true)
            const { data } = await axios.get(`${BASE_URL}/factura/listar-factura/${id}/${usuario.token}`)
            setDatos(data)
            setSppiner(false)
        }
        datos()
    }, [])

    const { cuerpo, cabecera, numeroFactura, cliente, subtotal, descuento, iva, total, createdAt } = datos

    const imprimirFactura = () => {

        // <style>

        //     #factura_final {
        //         width: 7.5cm;
        //     height: 22cm;
        //             }

        //     @page {
        //         size: 7.5cm 22cm;
        //             }
        //     @media print {
        //         body {
        //         margin: 0;
        //     padding: 0;
        //     -webkit-print-color-adjust: exact;
        //     print-color-adjust: exact;
        //                 }
        //               }
        // </style>

        const contenidoParaImprimir = document.getElementById('factura_final');

        const ventanaImpresion = window.open('', '_blank');
        ventanaImpresion.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <link href="https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css" rel="stylesheet">
                </head>
                <body>
                    ${contenidoParaImprimir.outerHTML}
                </body>
                </html>
            `);

        ventanaImpresion.document.close();
        ventanaImpresion.print();
    }

    const eliminarFactura = () => {
        Swal.fire({
            title: '¿Estas seguro de eliminar esta factura?',
            showDenyButton: true,
            confirmButtonText: 'Si',
            denyButtonText: `Cancelar`
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const { data } = await axios.delete(`${BASE_URL}/factura/eliminar-factura/${id}/${usuario.token}`)

                    await axios.put(`${BASE_URL}/cliente/actualizar-compras-cliente/${cliente._id}/${usuario.token}`)

                    setIdFactura('')
                    changeModalDetalleFactura()

                    Swal.fire(`${data.msg}`)

                } catch (error) { console.log(error) }

            } else if (result.isDenied) {
                return;
            }
        })
    }

    const editarFactura = () => {
        setFacturaState(datos)
        setEditar(true)
        changeModalDetalleFactura()
        changeModalFactura()
    }

    return (
        <>
            <div className="py-10 px-5 border-b border-gray-300">
                <div className="text-center">
                    <button onClick={controlModal}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 bg-red-100 hover:bg-red-600 hover:text-white p-1 rounded-full">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <span className="block text-center text-2xl">Detalle Factura</span>
            </div>

            {datos && Object.keys(datos).length > 0 &&
                <div className="bg-[#f5f7f8] py-5 px-5 text-xs" id="factura_final">
                    <p className="text-center uppercase">{cabecera?.nombreLocal || '*Cabecera Eliminada*'}</p>
                    <p className="text-center uppercase">{cabecera?.sucursal}</p>
                    <p className="text-center mb-5 uppercase">{cabecera?.direccion}</p>

                    <p className="font-bold">
                        RUC: <span className="font-normal">{cabecera?.ruc}</span>
                    </p>
                    <p className="font-bold">
                        Nº FRA: <span className="font-normal">{numeroFactura}</span>
                    </p>

                    <p className="font-bold">
                        FECHA EMISIÓN: <span className="font-normal">{formatearFechaFactura(createdAt)}</span>
                    </p>

                    <hr className='border-black my-3' />

                    <p className="uppercase">NOMBRES: {cliente?.nombres} {cliente?.apellidos}</p>
                    <p className="uppercase">DIRECCIÓN: {cliente?.direccion}</p>
                    <p className="uppercase">RUC/C.I/PPT: {cliente?.identificacion}</p>

                    <hr className='border-black my-3' />

                    <table
                        className="mb-5 w-full"
                    >
                        <thead>
                            <tr>
                                <td>COD.</td>
                                <td>DESCR.</td>
                                <td>CANT.</td>
                                <td>P. UNIT.</td>
                                <td>TOTAL</td>
                            </tr>
                        </thead>

                        <tbody>
                            {cuerpo.map(c => (
                                <tr key={c._id}>
                                    <td>{c?.producto?.codigo || '*Producto Eliminado*'}</td>
                                    <td>{c?.descripcionProducto}</td>
                                    <td>{c?.cantidadProducto}</td>
                                    <td>{c?.precioProducto.$numberDecimal}</td>
                                    <td>{c?.subtotal.$numberDecimal}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <p>SUBTOTAL: ${subtotal.$numberDecimal}</p>
                    <p>IVA 12%: ${iva.$numberDecimal}</p>
                    <p>DESCUENTO: ${descuento.$numberDecimal}</p>
                    <p>TOTAL: ${total.$numberDecimal}</p>

                    <p className="pt-5 text-center">MUCHAS GRACIAS POR SU COMPRA</p>
                </div>
            }

            <div className="bg-white border-t border-gray-300 m-auto flex justify-between items-center gap-3 py-4 px-5">
                <div className="flex gap-3">
                    <button
                        type="button"
                        className="bg-green-400 px-3 py-2 text-white rounded-md hover:bg-green-600"
                        onClick={imprimirFactura}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
                        </svg>
                    </button>

                    <button
                        type="button"
                        className="bg-[#2291B9] text-white font-bold cursor-pointer px-3 py-2 rounded-md hover:bg-[#2F9CC4]"
                        onClick={editarFactura}
                    >
                        Editar
                    </button>
                </div>

                <button
                    type="button"
                    className="bg-red-400 text-white p-2 rounded-md hover:bg-red-600"
                    onClick={eliminarFactura}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                </button>
            </div>
        </>
    )
}
