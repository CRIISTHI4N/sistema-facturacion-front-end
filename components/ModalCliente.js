import { useEffect, useState } from "react";
import useUsuario from "@/hooks/useUsuario";

export const ModalCliente = () => {

    const [nombres, setNombres] = useState('')
    const [apellidos, setApellidos] = useState('')
    const [identificacion, setIdentificacion] = useState('')
    const [direccion, setDireccion] = useState('')
    const [telefono, setTelefono] = useState('')
    const [correo, setCorreo] = useState('')
    const [descripcion, setDescripcion] = useState('')
    const [numeroCompras, setNumeroCompras] = useState(0)

    const {
        changeModalCliente,
        setEditar,
        editar,
        setClienteState,
        clienteState
    } = useUsuario();

    const {
        _id,
        nombres: nombresState,
        apellidos: apellidosState,
        identificacion: identificacionState,
        direccion: direccionState,
        telefono: telefonoState,
        correo: correoState,
        descripcion: descripcionState,
        numeroCompras: numeroComprasState
    } = clienteState

    useEffect(() => {
        if (clienteState?._id) {
            setNombres(nombresState);
            setApellidos(apellidosState);
            setIdentificacion(identificacionState);
            setDireccion(direccionState);
            setTelefono(telefonoState);
            setCorreo(correoState);
            setDescripcion(descripcionState);
            setNumeroCompras(numeroComprasState);
            return;
        }

        setNombres('');
        setApellidos('');
        setIdentificacion('');
        setDireccion('');
        setTelefono('');
        setCorreo('');
        setDescripcion('');
        setNumeroCompras(0)

    }, [clienteState])

    useEffect(() => {
        if (!editar) {
            setNombres('');
            setApellidos('');
            setIdentificacion('');
            setDireccion('');
            setTelefono('');
            setCorreo('');
            setDescripcion('');
            setNumeroCompras(0)
        }
    }, [])


    const controlModal = () => {
        setEditar(false)
        changeModalCliente()
        setClienteState({})
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

                <span className="block text-center text-2xl">Cliente</span>
            </div>

            <form
                className="py-10 px-12 bg-[#F1F1F1]"
            >
                <div className="mb-3">
                    <label
                        className="block mb-3"
                        htmlFor="nombres"
                    >
                        Nombres:
                    </label>
                    <input
                        readOnly
                        id="nombres"
                        type="text"
                        className={`border-2 px-2 py-1 outline-none rounded-sm w-full cursor-not-allowed`}
                        value={nombres}
                    />
                </div>

                <div className="mb-3">
                    <label
                        className="block mb-3"
                        htmlFor="apellidos"
                    >
                        Apellidos:
                    </label>
                    <input
                        readOnly
                        id="apellidos"
                        type="text"
                        className={`border-2 px-2 py-1 outline-none rounded-sm w-full cursor-not-allowed`}
                        value={apellidos}
                    />
                </div>

                <div className="mb-3">
                    <label
                        className="block mb-3"
                        htmlFor="identificacion"
                    >
                        Identificación:
                    </label>
                    <input
                        readOnly
                        id="identificacion"
                        type="text"
                        className={`border-2 px-2 py-1 outline-none rounded-sm w-full cursor-not-allowed`}
                        value={identificacion}
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
                        readOnly
                        id="direccion"
                        type="text"
                        className={`border-2 px-2 py-1 outline-none rounded-sm w-full cursor-not-allowed`}
                        value={direccion}
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
                        readOnly
                        id="telefono"
                        type="text"
                        className={`border-2 px-2 py-1 outline-none rounded-sm w-full cursor-not-allowed`}
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
                        readOnly
                        id="correo"
                        type="text"
                        className={`border-2 px-2 py-1 outline-none rounded-sm w-full cursor-not-allowed`}
                        value={correo}
                    />
                </div>

                <div className="mb-3">
                    <label
                        className="block mb-3"
                        htmlFor="descripcion"
                    >
                        Descripción:
                    </label>
                    <input
                        readOnly
                        id="descripcion"
                        type="text"
                        className={`border-2 px-2 py-1 outline-none rounded-sm w-full cursor-not-allowed`}
                        value={descripcion}
                    />
                </div>

                <div className="mb-7">
                    <label
                        className="block mb-3"
                        htmlFor="numero-compras"
                    >
                        Número de Compras:
                    </label>
                    <input
                        readOnly
                        id="numero-compras"
                        type="text"
                        className={`border-2 px-2 py-1 outline-none rounded-sm w-full cursor-not-allowed`}
                        value={numeroCompras}
                    />
                </div>
            </form>
        </>
    )
}
