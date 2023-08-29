import { useEffect, useState } from "react"
import { DatosCliente } from "./DatosCliente"
import { AgregarProducto } from "./AgregarProducto"
import useUsuario from "@/hooks/useUsuario"
import useSWR from 'swr'
import axios from "axios"
import Swal from 'sweetalert2'

export const ModalFactura = ({ BASE_URL }) => {

    const [busqueda, setBusqueda] = useState('')
    const [botonMas, setBotonMas] = useState(true)

    const {
        changeModalFactura,
        crearFormProducto,
        formulariosFactura,
        setProductos,
        productos,
        setCabeceraFactura,
        cabeceraFactura,
        setNombres,
        nombres,
        setApellidos,
        apellidos,
        setIdentificacion,
        identificacion,
        setDireccion,
        direccion,
        setTelefono,
        telefono,
        setCorreo,
        correo,
        setDescripcion,
        descripcion,
        setFormulariosFactura,
        setIdFactura,
        changeModalDetalleFactura,
        totalFactura,
        setTotalFactura,
        setSppiner,
        usuario,
        setEditar,
        editar,
        facturaState
    } = useUsuario()

    const fetcherSotckPersonalizado = () => axios(`${BASE_URL}/stock/listado-compra/${usuario.token}`).then(datos => datos.data)
    const { data: stockPersonalizado, error, isLoading } = useSWR(`${BASE_URL}/stock/listado-compra/${usuario.token}`, fetcherSotckPersonalizado, { refreshInterval: 100 })

    const fetcherCabeceras = () => axios(`${BASE_URL}/factura/listar-cabecera-personalizado/${usuario.token}`).then(datos => datos.data)
    const { data: cabeceras, error: err, isLoading: isLod } = useSWR(`${BASE_URL}/factura/listar-cabecera-personalizado/${usuario.token}`, fetcherCabeceras, { refreshInterval: 100 })

    const stockFiltrado = busqueda === ''
        ? stockPersonalizado
        : stockPersonalizado.filter(stock => stock.codigo.toLowerCase().includes(busqueda.toLowerCase()))

    const {
        _id,
        cabecera: cabeceraState,
        cliente: clienteState,
        cuerpo: cuerpoState,
        subtotal: subtotalState
    } = facturaState

    useEffect(() => {
        if (facturaState?._id) {
            setBotonMas(true)
            setCabeceraFactura(cabeceraState?._id);
            setNombres(clienteState?.nombres)
            setApellidos(clienteState?.apellidos)
            setIdentificacion(clienteState?.identificacion)
            setDireccion(clienteState?.direccion || '')
            setTelefono(clienteState?.telefono || '')
            setCorreo(clienteState?.correo || '')

            const idCuerpo = [];
            const productosFormateados = [];

            cuerpoState.map((cuerpo) => {
                idCuerpo.push(cuerpo._id);

                const productoFormateado = {
                    id: cuerpo._id,
                    producto: cuerpo.producto._id,
                    totalProducto: cuerpo.subtotal,
                    descripcionProducto: cuerpo.descripcionProducto,
                    cantidadProducto: cuerpo.cantidadProducto,
                    descuentoProducto: cuerpo.descuentoProducto,
                    idCuerpo: cuerpo._id,
                    precioUnitario: cuerpo.producto
                };

                productosFormateados.push(productoFormateado);
            });

            setFormulariosFactura(idCuerpo);
            setProductos(productosFormateados);
            return;
        }

        setBotonMas(true)
        setCabeceraFactura('');
        setNombres('')
        setApellidos('')
        setIdentificacion('')
        setDireccion('')
        setTelefono('')
        setCorreo('')
        setDescripcion('')

        setProductos([])
        setFormulariosFactura([])

        setTotalFactura(0);

    }, [facturaState])

    useEffect(() => {
        if (!editar) {
            setBotonMas(true)

            setCabeceraFactura('');
            setNombres('')
            setApellidos('')
            setIdentificacion('')
            setDireccion('')
            setTelefono('')
            setCorreo('')
            setDescripcion('')

            setProductos([])
            setFormulariosFactura([])
            setTotalFactura(0);
        }
    }, [])

    // Se ejecuta al momento de recargar la pagina
    useEffect(() => {
        const handleBeforeUnload = async (e) => {
            e.preventDefault();
            e.returnValue = 'Estás a punto de abandonar la página. ¿Deseas continuar?';
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };

    }, [])

    useEffect(() => {
        const totalPagar = productos.reduce((total, p) => total + (Number(p?.totalProducto) || Number(p?.totalProducto?.$numberDecimal) || 0), 0);

        setTotalFactura(totalPagar);

        // productos.length > 0 ? setBotonMas(false) : setBotonMas(true)

    }, [productos])

    const resetearValores = () => {
        setProductos([])
        setFormulariosFactura([])

        setCabeceraFactura('')

        setNombres('')
        setApellidos('')
        setIdentificacion('')
        setDireccion('')
        setTelefono('')
        setCorreo('')
        setDescripcion('')
    }

    const controlModal = async () => {
        Swal.fire({
            title: '¿Estas seguro de cancelar esta factura?',
            showDenyButton: true,
            confirmButtonText: 'Si',
            denyButtonText: `Cancelar`
        }).then(async (result) => {
            if (result.isConfirmed) {
                setSppiner(true)

                const cuerpo = productos
                    .filter(producto => producto.idCuerpo !== undefined)

                try {
                    for (const c of cuerpo) {
                        try {
                            const devolverStock = axios.put(`${BASE_URL}/factura/devolver-stock/${c.producto}/${usuario.token}`, { cantidad: c.cantidadProducto });

                            const eliminarCuerpoFactura = axios.delete(`${BASE_URL}/factura/eliminar-cuerpo-factura/${c.idCuerpo}/${usuario.token}`);

                            await Promise.all([devolverStock, eliminarCuerpoFactura]);

                        } catch (error) { console.log(error) }
                    }

                    resetearValores()
                    changeModalFactura()
                    setIdFactura('')
                    setSppiner(false)

                } catch (error) { console.log(error) }

            } else if (result.isDenied) {
                return
            }
        })
    }

    const mostrarFormProducto = () => {
        crearFormProducto({})
        setBotonMas(false)
    }

    const handleDatosFactura = async e => {
        e.preventDefault()

        if (cabeceraFactura === '') { return }
        if (identificacion.length !== 10 || isNaN(identificacion)) { return }
        if ([nombres, apellidos, identificacion].includes('')) { return }

        if (editar) {

            setSppiner(true)
            try {

                // 1. Se crean los DATOS DEL CLIENTE
                const { data } = await axios.put(`${BASE_URL}/cliente/actualizar-cliente/${clienteState?._id}/${usuario.token}`, {
                    nombres,
                    apellidos,
                    identificacion,
                    direccion,
                    telefono,
                    correo,
                    descripcion
                })

                // 2. Extraigo el ID del CUERPO FACTURA (donde esta cada producto)
                const cuerpo = productos
                    .filter(producto => producto.idCuerpo !== undefined)
                    .map(producto => ({ _id: producto.idCuerpo }))

                // 3. Actualizo la FACTURA FINAL
                await axios.put(`${BASE_URL}/factura/actualizar-factura/${_id}/${usuario.token}`, {
                    cabecera: cabeceraFactura,
                    cliente: data.cliente,
                    cuerpo
                })

                setIdFactura(_id)
                setEditar(false)
                changeModalFactura()
                changeModalDetalleFactura()
                resetearValores()
                Swal.fire('Editado correctamente')
                setSppiner(false)

            } catch (error) { console.log(error) }

        } else {
            Swal.fire({
                title: 'Crear Factura',
                showDenyButton: true,
                confirmButtonText: 'Si',
                denyButtonText: `Cancelar`
            }).then(async (result) => {
                if (result.isConfirmed) {

                    setSppiner(true)
                    try {
                        // 1. Se crean los DATOS DEL CLIENTE
                        const { data } = await axios.post(`${BASE_URL}/cliente/ingresar/${usuario.token}`, {
                            nombres,
                            apellidos,
                            identificacion,
                            direccion,
                            telefono,
                            correo,
                            descripcion
                        })

                        // 2. Extraigo el ID del CUERPO FACTURA (donde esta cada producto)
                        const cuerpo = productos
                            .filter(producto => producto.idCuerpo !== undefined)
                            .map(producto => ({ _id: producto.idCuerpo }));

                        // 3. Creo la FACTURA FINAL
                        const { data: facturaFinal } = await axios.post(`${BASE_URL}/factura/ingresar-factura/${usuario.token}`, {
                            cabecera: cabeceraFactura,
                            cliente: data.cliente,
                            cuerpo
                        })

                        setIdFactura(facturaFinal._id)
                        changeModalFactura()
                        changeModalDetalleFactura()
                        resetearValores()
                        setSppiner(false)

                    } catch (error) { console.log(error) }

                } else if (result.isDenied) { return }
            })
        }
    }

    return (
        <>
            <div className="py-10 px-5 border-b border-gray-300">
                <div className={`${editar ? 'hidden' : 'block'} text-center`}>
                    <button onClick={controlModal}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 bg-red-100 hover:bg-red-600 hover:text-white p-1 rounded-full">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <span className="block text-center text-2xl">{editar ? 'Editar Factura' : 'Factura'}</span>
            </div>

            <form
                onSubmit={handleDatosFactura}
                className="p-7 py-10 px-12 bg-[#F1F1F1]"
            >

                {/* Eleguir Cabecera Factura */}
                <h2 className="text-2xl">Cabecera:</h2>
                <div className="mb-9 md:mb-3 flex flex-col md:flex-row md:gap-4 md:items-baseline">
                    <label
                        htmlFor="cabecera"
                        className="block mb-3"
                    >
                        Eleguir cabecera:
                    </label>

                    <select
                        id="cabecera"
                        className={`${cabeceraFactura === '' ? 'border-red-400' : ''} border-2 bg-white px-3 py-2 rounded-sm`}
                        onChange={(e) => setCabeceraFactura(e.target.value)}
                        value={cabeceraFactura}
                    >
                        <option
                            value=""
                            defaultValue
                        >
                            {`${cabeceras && cabeceras.length ? '-- Seleccione --' : '-- Sin Cabeceras --'}`}
                        </option>
                        {
                            cabeceras && cabeceras.length &&

                            cabeceras.map(c => (
                                <option
                                    key={c._id}
                                    value={c._id}
                                >{c.nombreLocal} - {c.direccion}
                                </option>
                            ))
                        }
                    </select >
                </div>

                <hr className='border-gray-300' />

                {/* Ingresar los datos del cliente */}
                <h2 className="text-2xl mt-7">Datos Cliente:</h2>
                <DatosCliente
                    BASE_URL={BASE_URL}
                />

                <hr className='border-gray-300' />

                {/* Cuerpo */}
                <h2 className="text-2xl mt-7">Productos:</h2>

                {botonMas &&
                    <button
                        type="button"
                        className="bg-green-400 hover:bg-green-600 px-2 rounded-full mt-5 p-2"
                        onClick={mostrarFormProducto}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                    </button>
                }

                {formulariosFactura.map(id => (
                    <AgregarProducto
                        key={id}
                        id={id}
                        BASE_URL={BASE_URL}
                        stockFiltrado={stockFiltrado}
                        setBusqueda={setBusqueda}
                    />
                ))}

                <div className={`${editar ? 'block' : 'hidden'} flex flex-col gap-3 sm:flex-row sm:gap-0 justify-between items-center mt-5`}>
                    <input
                        type="submit"
                        value="Editar Factura"
                        className={`bg-[#3EA8CE] rounded-md px-3 py-2 text-white cursor-pointer hover:bg-[#238DB4]`}
                    />

                    <p className="text-2xl">Subtotal: ${totalFactura}</p>
                </div>

                <div className={`${productos.length < 2 ? 'hidden' : 'block'} flex flex-col gap-3 sm:flex-row sm:gap-0 justify-between items-center mt-5`}>

                    <input
                        type="submit"
                        value="Crear Factura"
                        className={`${editar ? 'hidden' : 'block'} bg-[#3EA8CE] text-lg rounded-md py-2 px-5 cursor-pointer hover:bg-[#238DB4] mr-5 order-last sm:order-first`}
                    />

                    <p className={`${editar ? 'hidden' : 'block'} text-2xl`}>Subtotal: ${totalFactura}</p>
                </div>
            </form>
        </>
    )
}
