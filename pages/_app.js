import '@/styles/globals.css'
import { Roboto } from 'next/font/google'
import { UsuarioProvider } from '@/context/usuarioProvider'

const roboto = Roboto({
  weight: ['100', '300', '400', '500', '700', '900',],
  subsets: ['latin']
})

export default function App({ Component, pageProps, BASE_URL }) {

  return (
    <div className={roboto.className}>
      <UsuarioProvider>
        <Component {...pageProps} />
      </UsuarioProvider>
    </div>
  )
}