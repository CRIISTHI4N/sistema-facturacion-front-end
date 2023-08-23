const { useContext } = require("react");
import { UsuarioContext } from "@/context/usuarioProvider";

export default function useUsuario() {
    return useContext(UsuarioContext)
}