import useUsuario from "@/hooks/useUsuario"
import { ModalConsultarStock } from "./ModalConsultarStock";

export const ModalMostrarStock = ({ BASE_URL, stockFiltrado, setProductoState, setBusqueda }) => {

    const { changeModalStock } = useUsuario();

    return (
        <>
            <div className="py-10 px-5 border-b border-gray-300">
                <div className="text-center">
                    <button onClick={changeModalStock}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 bg-red-100 hover:bg-red-600 hover:text-white p-1 rounded-full">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <span className="block text-center text-2xl">Stock</span>
            </div>

            <div className="bg-[#f5f7f8] py-6 px-6">

                <div
                    className="flex items-center rounded-md bg-white shadow shadow-gray-200 w-full mb-5 m-auto"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 ml-5 text-gray-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>

                    <input
                        type="text"
                        className="pl-2 pr-6 py-2 outline-none text-gray-800 placeholder-gray-400 w-full rounded-md"
                        placeholder="Buscar: Ej. xxx-xxx-xxx"
                        onChange={e => setBusqueda(e.target.value)}
                    />
                </div>

                <div className='w-full overflow-auto'>
                    <table
                        className="w-full bg-white border"
                    >
                        <thead>
                            <tr className="border-b">
                                <th className="text-start p-2 lg:px-7 lg:py-5">Cod.</th>
                                <th className="text-start p-2 lg:px-7 lg:py-5">Nombre</th>
                                <th className="text-start p-2 lg:px-7 lg:py-5">Cant.</th>
                                <th className="text-start p-2 lg:px-7 lg:py-5">Pre. Uni.</th>
                                <th className="text-start p-2 lg:px-7 lg:py-5"></th>
                            </tr>
                        </thead>

                        <tbody>
                            {
                                stockFiltrado.map(stock => (
                                    <ModalConsultarStock
                                        key={stock._id}
                                        stock={stock}
                                        BASE_URL={BASE_URL}
                                        setProductoState={setProductoState}
                                    />
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}
