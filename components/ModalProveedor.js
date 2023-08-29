import { useEffect, useState } from "react";
import useUsuario from "@/hooks/useUsuario";
import Swal from 'sweetalert2'
import axios from "axios";

export const ModalProveedor = ({ BASE_URL }) => {

    const [nombre, setNombre] = useState('')
    const [identificacion, setIdentificacion] = useState('')
    const [contacto, setContacto] = useState('')
    const [telefono, setTelefono] = useState('')
    const [correo, setCorreo] = useState('')
    const [direccion, setDireccion] = useState('')
    const [descripcion, setDescripcion] = useState('')
    const [estado, setEstado] = useState('true')

    const {
        changeModalProveedor,
        setEditar,
        editar,
        setProveedorState,
        proveedorState,
        usuario
    } = useUsuario();

    const {
        _id,
        nombre: nombreState,
        identificacion: identificacionState,
        contacto: contactoState,
        telefono: telefonoState,
        correo: correoState,
        direccion: direccionState,
        descripcion: descripcionState,
        estado: estadoState
    } = proveedorState

    useEffect(() => {
        if (proveedorState?._id) {
            setNombre(nombreState);
            setIdentificacion(identificacionState);
            setContacto(contactoState);
            setTelefono(telefonoState);
            setCorreo(correoState);
            setDireccion(direccionState);
            setDescripcion(descripcionState);
            setEstado(estadoState);
            return;
        }

        setNombre('');
        setIdentificacion('');
        setContacto('');
        setTelefono('');
        setCorreo('');
        setDireccion('');
        setDescripcion('');
        setEstado('true')

    }, [proveedorState])

    useEffect(() => {
        if (!editar) {
            setNombre('');
            setIdentificacion('');
            setContacto('');
            setTelefono('');
            setCorreo('');
            setDireccion('');
            setDescripcion('');
            setEstado('true')
        }
    }, [])


    const controlModal = () => {
        setEditar(false)
        changeModalProveedor()
        setProveedorState({})
    }

    const eliminarProveedor = () => {
        Swal.fire({
            title: '¿Estas seguro de eliminar este registro?',
            showDenyButton: true,
            confirmButtonText: 'Si',
            denyButtonText: `Cancelar`
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`${BASE_URL}/proveedor/eliminar/${_id}/${usuario.token}`)

                    changeModalProveedor()
                    setEditar(false)
                    Swal.fire('Eliminado correctamente')

                } catch (error) { console.log(error) }

            } else if (result.isDenied) {
                changeModalProveedor()
                setEditar(false)
            }
        })
    }

    const editarProveedor = async () => {
        if (editar) {
            if (nombre === '') { return }
            if (identificacion.length !== 10 || isNaN(identificacion)) { return }

            try {
                await axios.put(`${BASE_URL}/proveedor/actualizar/${_id}/${usuario.token}`, {
                    nombre,
                    identificacion,
                    contacto,
                    telefono,
                    correo,
                    direccion,
                    descripcion,
                    estado
                })

                Swal.fire('Editado correctamente')
                setProveedorState({})

            } catch (error) { console.log(error) }

        } else {
            if (nombre === '') { return }
            if (identificacion.length !== 10 || isNaN(identificacion)) { return }

            try {
                await axios.post(`${BASE_URL}/proveedor/ingresar/${usuario.token}`, {
                    nombre,
                    identificacion,
                    contacto,
                    telefono,
                    correo,
                    direccion,
                    descripcion,
                    estado
                })

                Swal.fire('Agregado correctamente')

            } catch (error) { console.log(error) }
        }

        changeModalProveedor()
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

                <span className="block text-center text-2xl">Proveedor</span>
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
                        placeholder="* Nombre de la empresa"
                        className={`${nombre === '' ? 'border-red-400 placeholder:text-red-400' : ''} border-2 px-2 py-1 outline-none rounded-sm w-full`}
                        onChange={e => setNombre(e.target.value)}
                        value={nombre}
                    />
                </div>

                <div className="mb-3">
                    <label
                        className="block mb-3"
                        htmlFor="identificacion"
                    >
                        Identificacion:
                    </label>
                    <input
                        id="identificacion"
                        type="text"
                        placeholder="No es obligatorio"
                        className={`${identificacion.length !== 10 || isNaN(identificacion) ? 'border-red-400' : ''} border-2 px-2 py-1 outline-none rounded-sm w-full`}
                        onChange={e => setIdentificacion(e.target.value)}
                        value={identificacion}
                    />
                </div>

                <div className="mb-3">
                    <label
                        className="block mb-3"
                        htmlFor="contacto"
                    >
                        Contacto:
                    </label>
                    <input
                        id="contacto"
                        type="text"
                        placeholder="Nombre del contacto"
                        className={`border-2 px-2 py-1 outline-none rounded-sm w-full`}
                        onChange={e => setContacto(e.target.value)}
                        value={contacto}
                    />
                </div>

                <div className="mb-3">
                    <label
                        className="block mb-3"
                        htmlFor="telefono"
                    >
                        Teléfono:
                    </label>
                    <input
                        id="telefono"
                        type="text"
                        placeholder="No es obligatorio"
                        className={`${telefono.length !== 10 || isNaN(telefono) ? 'border-red-400' : ''} border-2 px-2 py-1 outline-none rounded-sm w-full`}
                        onChange={e => setTelefono(e.target.value)}
                        value={telefono}
                    />
                </div>

                <div className="mb-3">
                    <label
                        className="block mb-3"
                        htmlFor="correo"
                    >
                        Correo:
                    </label>
                    <input
                        id="correo"
                        type="email"
                        className={`border-2 px-2 py-1 outline-none rounded-sm w-full`}
                        onChange={e => setCorreo(e.target.value)}
                        value={correo}
                    />
                </div>

                <div className="mb-3">
                    <label
                        className="block mb-3"
                        htmlFor="direccion"
                    >
                        Dirección:
                    </label>
                    <input
                        id="direccion"
                        type="text"
                        className={`border-2 px-2 py-1 outline-none rounded-sm w-full`}
                        onChange={e => setDireccion(e.target.value)}
                        value={direccion}
                    />
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
                        onClick={editarProveedor}
                    >
                        {`${editar ? 'Editar' : 'Agregar'}`}
                    </button>

                    {editar &&
                        <button
                            type="button"
                            className="bg-red-400 text-white p-2 rounded-md hover:bg-red-600"
                            onClick={eliminarProveedor}
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
