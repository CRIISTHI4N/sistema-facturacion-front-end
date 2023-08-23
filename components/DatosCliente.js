import useUsuario from "@/hooks/useUsuario"
import axios from "axios"
import { useEffect } from "react"

export const DatosCliente = ({ BASE_URL }) => {

    const {
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
        usuario
    } = useUsuario()

    useEffect(() => {
        const descripcionCiente = async () => {
            if (identificacion.length === 10 && !isNaN(identificacion)) {
                try {
                    const { data } = await axios.get(`${BASE_URL}/cliente/descripcion-cliente/${identificacion}/${usuario.token}`)
                    setDescripcion(data.descripcion);

                } catch (error) { console.log(error) }
            } else {
                setDescripcion('');
            }
        }
        descripcionCiente()
    }, [identificacion])

    return (
        <div className="flex flex-col md:flex-row md:justify-between md:gap-4">
            <div className="w-full md:w-1/4 md:mb-4">
                <div className="mb-3">
                    <label
                        className="block mb-3"
                        htmlFor="nombres"
                    >
                        Nombres:
                    </label>
                    <input
                        value={nombres}
                        onChange={e => setNombres(e.target.value)}
                        id="nombres"
                        type="text"
                        placeholder="*"
                        className={`${nombres === '' ? 'border-red-400 placeholder:text-red-400' : ''} px-2 py-1 outline-none rounded-sm w-full border-2`}
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
                        value={apellidos}
                        onChange={e => setApellidos(e.target.value)}
                        id="apellidos"
                        type="text"
                        placeholder="*"
                        className={`${apellidos === '' ? 'border-red-400 placeholder:text-red-400' : ''} border-2 px-2 py-1 outline-none rounded-sm w-full`}
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
                        value={identificacion}
                        onChange={e => setIdentificacion(e.target.value)}
                        id="identificacion"
                        type="text"
                        placeholder="*"
                        className={`${identificacion === '' ? 'border-red-400 placeholder:text-red-400' : ''} ${identificacion.length !== 10 || isNaN(identificacion) ? 'border-red-400' : ''} border-2 px-2 py-1 outline-none rounded-sm w-full`}
                    />
                </div>
            </div>

            <div className="w-full md:w-1/4 md:mb-4">
                <div className="mb-3">
                    <label
                        className="block mb-3"
                        htmlFor="direccion"
                    >
                        Dirección:
                    </label>
                    <input
                        value={direccion}
                        onChange={e => setDireccion(e.target.value)}
                        id="direccion"
                        type="text"
                        className="border-2 px-2 py-1 outline-none rounded-sm w-full"
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
                        value={telefono}
                        onChange={e => setTelefono(e.target.value)}
                        id="telefono"
                        type="text"
                        placeholder="No es obligatorio"
                        className={`px-2 py-1 outline-none rounded-sm w-full ${telefono.length !== 10 || isNaN(telefono) ? 'border-red-400' : ''} border-2`}
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
                        value={correo}
                        onChange={e => setCorreo(e.target.value)}
                        id="correo"
                        type="email"
                        className="border-2 px-2 py-1 outline-none rounded-sm w-full"
                    />
                </div>
            </div>

            <div className="w-full mb-9 md:w-1/4 md:mb-3">
                <label
                    className="block mb-3"
                    htmlFor="descripcion"
                >
                    Descripción:
                </label>

                <textarea
                    value={descripcion}
                    onChange={e => setDescripcion(e.target.value)}
                    className="border-2 px-2 py-1 outline-none rounded-sm w-full" id="descripcion"
                    rows="7"
                ></textarea>
            </div>
        </div>
    )
}
