import { useEffect, useState } from "react";
import useUsuario from "@/hooks/useUsuario";
import Swal from 'sweetalert2'
import useSWR from 'swr'
import axios from "axios";

export const ModalStock = ({ BASE_URL }) => {

    const [nombre, setNombre] = useState('')
    const [cantidad, setCantidad] = useState(0)
    const [precioUnitario, setPrecioUnitario] = useState(0)
    const [codigo, setCodigo] = useState('')
    const [proveedor, setProveedor] = useState('')
    const [categoria, setCategoria] = useState('')
    const [descripcion, setDescripcion] = useState('')
    const [estado, setEstado] = useState('true')

    const {
        changeModalStockOrigin,
        setEditar,
        editar,
        setStockState,
        stockState,
        usuario
    } = useUsuario();

    const fetcherProveedor = () => axios(`${BASE_URL}/proveedor/listar-nombre-provedor/${usuario.token}`).then(datos => datos.data)
    const { data: nombreProveedor, errorProv, isLoadingPro } = useSWR(`${BASE_URL}/proveedor/listar-nombre-provedor/${usuario.token}`, fetcherProveedor, { refreshInterval: 100 })

    const fetcherCategoria = () => axios(`${BASE_URL}/categoria/listar-nombre-categoria/${usuario.token}`).then(datos => datos.data)
    const { data: nombreCategoria, errorCat, isLoadingCat } = useSWR(`${BASE_URL}/categoria/listar-nombre-categoria/${usuario.token}`, fetcherCategoria, { refreshInterval: 100 })

    const {
        _id,
        nombre: nombreState,
        cantidad: cantidadState,
        precioUnitario: precioUnitarioState,
        codigo: codigoState,
        proveedor: proveedorState,
        categoria: categoriaState,
        descripcion: descripcionState,
        estado: estadoState
    } = stockState

    useEffect(() => {
        if (stockState?._id) {
            setNombre(nombreState);
            setCantidad(cantidadState)
            setPrecioUnitario(precioUnitarioState.$numberDecimal)
            setCodigo(codigoState)
            setProveedor(proveedorState?._id || '')
            setCategoria(categoriaState?._id || '')
            setDescripcion(descripcionState);
            setEstado(estadoState);
            return;
        }

        setNombre('');
        setCantidad(0)
        setPrecioUnitario(0)
        setCodigo('')
        setProveedor('')
        setCategoria('')
        setDescripcion('');
        setEstado('true')

    }, [stockState])

    useEffect(() => {
        if (!editar) {
            setNombre('');
            setCantidad(0)
            setPrecioUnitario(0)
            setCodigo('')
            setProveedor('')
            setCategoria('')
            setDescripcion('');
            setEstado('true')
        }
    }, [])


    const controlModal = () => {
        setEditar(false)
        changeModalStockOrigin()
        setStockState({})
    }

    const eliminarStock = () => {
        Swal.fire({
            title: '¿Estas seguro de eliminar este stock?',
            showDenyButton: true,
            confirmButtonText: 'Si',
            denyButtonText: `Cancelar`
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`${BASE_URL}/stock/eliminar/${_id}/${usuario.token}`)

                    changeModalStockOrigin()
                    setEditar(false)
                    Swal.fire('Eliminado correctamente')

                } catch (error) { console.log(error) }

            } else if (result.isDenied) {
                changeModalStockOrigin()
                setEditar(false)
            }
        })
    }

    const editarStock = async () => {
        if (editar) {
            if (nombre === '') { return }
            if (cantidad < 0 || isNaN(cantidad) || cantidad === '') { return }
            if (precioUnitario < 0 || isNaN(precioUnitario) || precioUnitario === '') { return }
            if (codigo === '') { return }

            try {
                await axios.put(`${BASE_URL}/stock/actualizar/${_id}/${usuario.token}`, {
                    nombre,
                    cantidad,
                    precioUnitario,
                    codigo,
                    proveedor: proveedor ? proveedor : null,
                    categoria: categoria ? categoria : null,
                    descripcion,
                    estado
                })

                Swal.fire('Editado correctamente')
                setStockState({})

            } catch (error) { console.log(error) }

        } else {
            if (nombre === '') { return }
            if (cantidad < 0 || isNaN(cantidad) || cantidad === '') { return }
            if (precioUnitario < 0 || isNaN(precioUnitario) || precioUnitario === '') { return }
            if (codigo === '') { return }

            try {
                await axios.post(`${BASE_URL}/stock/ingresar/${usuario.token}`, {
                    nombre,
                    cantidad,
                    precioUnitario,
                    codigo,
                    proveedor,
                    categoria,
                    descripcion,
                    estado
                })
                Swal.fire('Agregado correctamente')

            } catch (error) { console.log(error) }
        }

        changeModalStockOrigin()
        setEditar(false)
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

                <span className="block text-center text-2xl">Stok</span>
            </div>

            <form
                className="py-10 px-12 bg-[#F1F1F1]"
            >
                <div className="mb-3">
                    <label
                        className="block mb-3"
                        htmlFor="nombre"
                    >
                        Nombre:
                    </label>
                    <input
                        id="nombre"
                        type="text"
                        placeholder="*"
                        className={`${nombre === '' ? 'border-red-400 placeholder:text-red-400' : ''} border-2 px-2 py-1 outline-none rounded-sm w-full`}
                        onChange={e => setNombre(e.target.value)}
                        value={nombre}
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
                        id="cantidad"
                        type="number"
                        min={0}
                        step={1}
                        placeholder="*"
                        className={`${cantidad < 0 || isNaN(cantidad) || cantidad === '' ? 'border-red-400 placeholder:text-red-400' : ''} border-2 px-2 py-1 outline-none rounded-sm w-full`}
                        onChange={e => setCantidad(e.target.value)}
                        value={cantidad}
                    />
                </div>

                <div className="mb-3">
                    <label
                        className="block mb-3"
                        htmlFor="precio-unitario"
                    >
                        Precio Unitario:
                    </label>
                    <input
                        id="precio-unitario"
                        type="number"
                        min={0}
                        step={1}
                        placeholder="*"
                        className={`${precioUnitario < 0 || isNaN(precioUnitario) || precioUnitario === '' ? 'border-red-400 placeholder:text-red-400' : ''} border-2 px-2 py-1 outline-none rounded-sm w-full`}
                        onChange={e => setPrecioUnitario(e.target.value)}
                        value={precioUnitario}
                    />
                </div>

                <div className="mb-3">
                    <label
                        className="block mb-3"
                        htmlFor="codigo"
                    >
                        Código:
                    </label>
                    <input
                        id="codigo"
                        type="text"
                        placeholder="*"
                        className={`${codigo === '' ? 'border-red-400 placeholder:text-red-400' : ''} border-2 px-2 py-1 outline-none rounded-sm w-full`}
                        onChange={e => setCodigo(e.target.value)}
                        value={codigo}
                    />
                </div>

                <div className="mb-3">
                    <label
                        className="block mb-3"
                        htmlFor="proveedor"
                    >
                        Proveedor:
                    </label>

                    <select
                        id="proveedor"
                        className={`${nombreProveedor === '' ? 'border-red-400' : ''} border-2 bg-white px-2 py-1 rounded-sm outline-none w-full`}
                        onChange={(e) => setProveedor(e.target.value)}
                        value={proveedor}
                    >
                        <option
                            value=""
                            defaultValue
                        >
                            {`${nombreProveedor && nombreProveedor.length ? '-- Seleccione --' : '-- Sin Proveedores --'}`}
                        </option>
                        {
                            nombreProveedor && nombreProveedor.length &&

                            nombreProveedor.map(np => (
                                <option
                                    key={np._id}
                                    value={np._id}
                                >
                                    {np.nombre} - {np.telefono}
                                </option>
                            ))
                        }
                    </select >
                </div>

                <div className="mb-3">
                    <label
                        className="block mb-3"
                        htmlFor="categoria"
                    >
                        Categoría:
                    </label>

                    <select
                        id="categoria"
                        className={`${nombreCategoria === '' ? 'border-red-400' : ''} border-2 bg-white px-2 py-1 rounded-sm outline-none w-full`}
                        onChange={(e) => setCategoria(e.target.value)}
                        value={categoria}
                    >
                        <option
                            value=""
                            defaultValue
                        >
                            {`${nombreCategoria && nombreCategoria.length ? '-- Seleccione --' : '-- Sin Proveedores --'}`}
                        </option>
                        {
                            nombreCategoria && nombreCategoria.length &&

                            nombreCategoria.map(nc => (
                                <option
                                    key={nc._id}
                                    value={nc._id}
                                >
                                    {nc.nombre}
                                </option>
                            ))
                        }
                    </select >
                </div>

                <div className="mb-7">
                    <label
                        className="block mb-3"
                        htmlFor="descripcion"
                    >
                        Descripción:
                    </label>
                    <textarea
                        id="descripcion"
                        cols="30"
                        rows="5"
                        className="border-2 px-2 py-1 rounded-sm outline-none w-full"
                        onChange={e => setDescripcion(e.target.value)}
                        value={descripcion}
                    ></textarea>
                </div>

                <div className="mb-7">
                    <label
                        className="block mb-3"
                        htmlFor="estado"
                    >
                        Estado:
                    </label>

                    <select
                        id="estado"
                        className="border-2 px-2 py-1 rounded-sm outline-none w-full bg-white"
                        onChange={e => setEstado(e.target.value)}
                        value={estado}
                    >
                        <option value="true">Activo</option>
                        <option value="false">Inactivo</option>
                    </select>
                </div>

                <div
                    className="flex justify-between items-center"
                >
                    <button
                        type="button"
                        className="bg-[#2291B9] text-white font-bold cursor-pointer px-3 py-2 rounded-md hover:bg-[#2F9CC4]"
                        onClick={editarStock}
                    >
                        {`${editar ? 'Editar' : 'Agregar'}`}
                    </button>

                    {editar &&
                        <button
                            type="button"
                            className="bg-red-400 text-white p-2 rounded-md hover:bg-red-600"
                            onClick={eliminarStock}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                        </button>
                    }
                </div>
            </form>
        </>
    )
}
