import { useEffect, useState } from "react";
import useUsuario from "@/hooks/useUsuario";
import Swal from 'sweetalert2'
import axios from "axios";

export const ModalCabecera = ({ BASE_URL }) => {

    const [ruc, setRuc] = useState('')
    const [nombreLocal, setNombreLocal] = useState('')
    const [sucursal, setSucursal] = useState('')
    const [direccion, setDireccion] = useState('')

    const {
        changeModalCabecera,
        setEditar,
        editar,
        setCabeceraState,
        cabeceraState,
        usuario
    } = useUsuario();

    const {
        _id,
        ruc: rucState,
        nombreLocal: nombreLocalState,
        sucursal: sucursalState,
        direccion: direccionState
    } = cabeceraState

    useEffect(() => {
        if (cabeceraState?._id) {
            setRuc(rucState);
            setNombreLocal(nombreLocalState);
            setSucursal(sucursalState);
            setDireccion(direccionState);
            return;
        }

        setRuc('');
        setNombreLocal('');
        setSucursal('');
        setDireccion('');

    }, [cabeceraState])

    useEffect(() => {
        if (!editar) {
            setRuc('');
            setNombreLocal('');
            setSucursal('');
            setDireccion('');
        }
    }, [])


    const controlModal = () => {
        setEditar(false)
        changeModalCabecera()
        setCabeceraState({})
    }

    const eliminarCabecera = () => {
        Swal.fire({
            title: '¿Estas seguro de eliminar este registro?',
            showDenyButton: true,
            confirmButtonText: 'Si',
            denyButtonText: `Cancelar`
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`${BASE_URL}/factura/eliminar-cabecera-factura/${_id}/${usuario.token}`)

                    changeModalCabecera()
                    setEditar(false)
                    Swal.fire('Eliminado correctamente')

                } catch (error) { console.log(error) }

            } else if (result.isDenied) {
                changeModalCabecera()
                setEditar(false)
            }
        })
    }

    const editarCabecera = async () => {
        if (editar) {
            if (ruc === '') { return }
            if (nombreLocal === '') { return }
            if (direccion === '') { return }

            try {
                await axios.put(`${BASE_URL}/factura/actualizar-cabecera-factura/${_id}/${usuario.token}`, { ruc, nombreLocal, sucursal, direccion })

                Swal.fire('Editado correctamente')
                setCabeceraState({})

            } catch (error) { console.log(error) }

        } else {
            if (ruc === '') { return }
            if (nombreLocal === '') { return }
            if (direccion === '') { return }

            try {
                await axios.post(`${BASE_URL}/factura/ingresar-cabecera-factura/${usuario.token}`, { ruc, nombreLocal, sucursal, direccion })
                Swal.fire('Agregado correctamente')

            } catch (error) { console.log(error) }
        }

        changeModalCabecera()
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

                <span className="block text-center text-2xl">Cabecera</span>
            </div>

            <form
                className="py-10 px-12 bg-[#F1F1F1]"
            >
                <div className="mb-3">
                    <label
                        className="block mb-3"
                        htmlFor="ruc"
                    >
                        Ruc:
                    </label>
                    <input
                        id="ruc"
                        type="text"
                        placeholder="*"
                        className={`${ruc === '' ? 'border-red-400 placeholder:text-red-400' : ''} border-2 px-2 py-1 outline-none rounded-sm w-full`}
                        onChange={e => setRuc(e.target.value)}
                        value={ruc}
                    />
                </div>

                <div className="mb-3">
                    <label
                        className="block mb-3"
                        htmlFor="nombre-local"
                    >
                        Nombre Local:
                    </label>
                    <input
                        id="nombre-local"
                        type="text"
                        placeholder="*"
                        className={`${nombreLocal === '' ? 'border-red-400 placeholder:text-red-400' : ''} border-2 px-2 py-1 outline-none rounded-sm w-full`}
                        onChange={e => setNombreLocal(e.target.value)}
                        value={nombreLocal}
                    />
                </div>

                <div className="mb-3">
                    <label
                        className="block mb-3"
                        htmlFor="sucursal"
                    >
                        Sucursal:
                    </label>
                    <input
                        id="sucursal"
                        type="text"
                        className={`border-2 px-2 py-1 outline-none rounded-sm w-full`}
                        onChange={e => setSucursal(e.target.value)}
                        value={sucursal}
                    />
                </div>

                <div className="mb-7">
                    <label
                        className="block mb-3"
                        htmlFor="direccion"
                    >
                        Dirección:
                    </label>
                    <input
                        id="direccion"
                        type="text"
                        placeholder="*"
                        className={`${direccion === '' ? 'border-red-400 placeholder:text-red-400' : ''} border-2 px-2 py-1 outline-none rounded-sm w-full`}
                        onChange={e => setDireccion(e.target.value)}
                        value={direccion}
                    />
                </div>

                <div
                    className="flex justify-between items-center"
                >
                    <button
                        type="button"
                        className="bg-[#2291B9] text-white font-bold cursor-pointer px-3 py-2 rounded-md hover:bg-[#2F9CC4]"
                        onClick={editarCabecera}
                    >
                        {`${editar ? 'Editar' : 'Agregar'}`}
                    </button>

                    {editar &&
                        <button
                            type="button"
                            className="bg-red-400 text-white p-2 rounded-md hover:bg-red-600"
                            onClick={eliminarCabecera}
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
