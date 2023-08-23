import { useState } from 'react';
import { useRouter } from 'next/router';
import useUsuario from '@/hooks/useUsuario';
import styles from '../styles/navBar.module.css'
import axios from 'axios';

export default function Home({ BASE_URL }) {

  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [alerta, setAlerta] = useState('')

  const { setUsuario } = useUsuario();

  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      const { data } = await axios.post(`${BASE_URL}/usuario/login`, { user, pass })

      if (data.msg) {
        setAlerta(data.msg)
        return
      }

      setUsuario(data)
      localStorage.setItem('user', JSON.stringify(data))
      router.push('/inicio')

    } catch (e) {
      setAlerta(e.response.data.msg)
    }

  }

  return (

    <div className="min-w-screen min-h-screen w-screen h-screen bg-gradient-to-tl from-[#232A2F] to-[#2A353D] flex justify-center items-center overflow-auto">

      <div className="w-[90%] h-[60%] md:w-[50%] lg:w-[70%] xl:w-[50%] grid grid-cols-1 lg:grid-cols-2">

        <div className={`${styles.banner} hidden lg:block rounded-l-md`}></div>

        <div className="bg-[#f4f4f4] rounded-md lg:rounded-r-md lg:rounded-l-none px-11 py-20 flex justify-center lg:justify-start lg:pl-20 xl:pl-16 2xl:pl-20 items-center">
          <form
            onSubmit={handleLogin}
          >

            <h2 className="text-[#142241] text-4xl mb-12">Bienvenido!</h2>

            {alerta &&
              <p className='bg-red-500 rounded-md p-3 text-center text-white mb-5'>{alerta}</p>
            }

            <div className="mb-3">
              <label
                htmlFor="usuario"
                className="block mb-3 text-gray-600 font-bold"
              >
                Usuario:
              </label>

              <input
                type="text"
                id="usuario"
                className="w-full rounded-md bg-white shadow-lg shadow-gray-200 p-2 outline-none border"
                onChange={e => setUser(e.target.value)}
                value={user}
              />

            </div>

            <div className="mb-3">
              <label
                htmlFor="usuario"
                className="block mb-3 text-gray-600 font-bold"
              >
                Contraseña:
              </label>

              <input
                type="password"
                id="usuario"
                className="w-full rounded-md bg-white shadow-lg shadow-gray-200 p-2 outline-none border"
                onChange={e => setPass(e.target.value)}
                value={pass}
              />
            </div>

            <input
              type="submit"
              value="Entrar"
              className="bg-[#2291B9] text-white font-bold cursor-pointer px-3 py-2 rounded-md hover:bg-[#2F9CC4] mt-5"
            />
          </form>
        </div>
      </div>
    </div>
  )
}

export async function getStaticProps() {
  const BASE_URL = process.env.URL_BACK
  return { props: { BASE_URL } }
}
