import { useState, useEffect, createContext } from "react";
import { generarId } from "@/helpers";
import axios from "axios";
import Swal from 'sweetalert2'

export const UsuarioContext = createContext()

export const UsuarioProvider = ({ children }) => {

  const [modalCategoria, setModalCategoria] = useState(false);
  const [modalStockOrigin, setModalStockOrigin] = useState(false);
  const [modalProveedor, setModalProveedor] = useState(false);
  const [modalFactura, setModalFactura] = useState(false);
  const [modalStock, setModalStock] = useState(false);
  const [modalCabecera, setModalCabecera] = useState(false);
  const [modalCliente, setModalCliente] = useState(false);
  const [modalDetalleFactura, setModalDetalleFactura] = useState(false);
  const [editar, setEditar] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [categoriaState, setCategoriaState] = useState({});
  const [stockState, setStockState] = useState({});
  const [proveedorState, setProveedorState] = useState({});
  const [cabeceraState, setCabeceraState] = useState({});
  const [clienteState, setClienteState] = useState({});
  const [facturaState, setFacturaState] = useState({});
  const [totalFactura, setTotalFactura] = useState(0);
  const [toggle, setToggle] = useState(false);
  const [sppiner, setSppiner] = useState(false);
  const [usuario, setUsuario] = useState({})
  const [noAcces, setNoAcces] = useState('')

  // Opciones interfaz usuario
  const [navbar, setNavbar] = useState(false);
  const [opcFactura, setOpcFactura] = useState(false);

  // Datos Cuerpo Factura
  const [formulariosFactura, setFormulariosFactura] = useState([]);

  // Datos Cabecera Factura
  const [cabeceraFactura, setCabeceraFactura] = useState('');

  // Datos Cliente Factura
  const [nombres, setNombres] = useState('')
  const [apellidos, setApellidos] = useState('')
  const [identificacion, setIdentificacion] = useState('')
  const [direccion, setDireccion] = useState('')
  const [telefono, setTelefono] = useState('')
  const [correo, setCorreo] = useState('')
  const [descripcion, setDescripcion] = useState('')

  //Factura final
  const [productos, setProductos] = useState([])
  const [idFactura, setIdFactura] = useState('')




  const changeNavbar = () => {
    setNavbar(!navbar)
    localStorage.setItem('navbar', !navbar)
  }

  const changeOpcFactura = () => {
    setOpcFactura(!opcFactura)
    localStorage.setItem('opcFactura', !opcFactura)
  }

  const changeModalCategoria = () => {
    setModalCategoria(!modalCategoria)
  }

  const changeModalStock = () => {
    setModalStock(!modalStock)
  }

  const changeModalFactura = () => {
    setModalFactura(!modalFactura)
  }

  const changeModalDetalleFactura = () => {
    setModalDetalleFactura(!modalDetalleFactura)
  }

  const changeModalStockOrigin = () => {
    setModalStockOrigin(!modalStockOrigin)
  }

  const changeModalProveedor = () => {
    setModalProveedor(!modalProveedor)
  }

  const changeModalCabecera = () => {
    setModalCabecera(!modalCabecera)
  }

  const changeModalCliente = () => {
    setModalCliente(!modalCliente)
  }

  const changeToggle = () => {
    setToggle(!toggle)
  }

  const crearFormProducto = (producto) => {
    setProductos([...productos, producto])
    setFormulariosFactura([...formulariosFactura, generarId()])
  }

  const eliminarFormStock = async (idForm, idCuerpoFactura, idStock, cantidad) => {
    Swal.fire({
      title: '¿Estas seguro de eliminar este producto de la lista?',
      showDenyButton: true,
      confirmButtonText: 'Si',
      denyButtonText: `Cancelar`
    }).then(async (result) => {
      if (result.isConfirmed) {

        const nuevoFormFact = formulariosFactura.filter(fp => fp !== idForm)
        const nuevoPro = productos.filter(p => p.id !== idForm)

        setFormulariosFactura(nuevoFormFact)
        setProductos(nuevoPro)

        const URL = process.env.NEXT_PUBLIC_URL;
        const urlDevolverStock = axios.put(`${URL}/factura/devolver-stock/${idStock}/${usuario.token}`, { cantidad })
        const urlEliminarCuerpoFactura = axios.delete(`${URL}/factura/eliminar-cuerpo-factura/${idCuerpoFactura}/${usuario.token}`)

        try {
          await Promise.all([urlDevolverStock, urlEliminarCuerpoFactura])

        } catch (error) { console.log(error) }

      } else if (result.isDenied) {
        return
      }
    })
  }

  const cerrarSesion = () => {
    localStorage.removeItem('user')
    setUsuario({})
  }

  useEffect(() => {
    setNavbar(JSON.parse(localStorage.getItem('navbar')) || false)
    setOpcFactura(JSON.parse(localStorage.getItem('opcFactura')) || false)
    setUsuario(JSON.parse(localStorage.getItem('user')) || [])
  }, [])

  return (
    <UsuarioContext.Provider
      value={{
        setNavbar,
        changeNavbar,
        navbar,
        changeOpcFactura,
        opcFactura,
        changeModalCategoria,
        modalCategoria,
        setEditar,
        editar,
        changeModalStock,
        modalStock,
        setProductos,
        productos,
        crearFormProducto,
        eliminarFormStock,
        formulariosFactura,
        setCategorias,
        categorias,
        setCategoriaState,
        categoriaState,
        changeModalFactura,
        modalFactura,
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
        idFactura,
        changeModalDetalleFactura,
        modalDetalleFactura,
        setTotalFactura,
        totalFactura,
        changeToggle,
        toggle,
        setSppiner,
        sppiner,
        setStockState,
        stockState,
        changeModalStockOrigin,
        modalStockOrigin,
        changeModalProveedor,
        modalProveedor,
        setProveedorState,
        proveedorState,
        changeModalCabecera,
        modalCabecera,
        setCabeceraState,
        cabeceraState,
        changeModalCliente,
        modalCliente,
        setClienteState,
        clienteState,
        setUsuario,
        usuario,
        cerrarSesion,
        setNoAcces,
        noAcces,
        setFacturaState,
        facturaState
      }}
    >
      {children}
    </UsuarioContext.Provider >
  )
}
