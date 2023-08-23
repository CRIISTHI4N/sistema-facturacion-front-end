import useUsuario from "@/hooks/useUsuario"
import { formatearFechaFactura } from "@/helpers";
import axios from "axios";
import { useEffect, useState } from "react";

export const ModalDetalleFactura = ({ BASE_URL }) => {

    const [datos, setDatos] = useState({})
    const { idFactura: id, changeModalDetalleFactura, setIdFactura, setSppiner, usuario } = useUsuario();

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

            <button
                type="button"
                className="bg-[#19C2FF] block mb-5 px-5 py-3 font-bold rounded-sm m-auto w-[90%] hover:bg-[#1195c5]"
                onClick={imprimirFactura}
            >
                IMPRIMIR
            </button>
        </>
    )
}
