import '../../styles/globals.css'
import type { AppProps } from 'next/app'

import 'animate.css';
import Head from 'next/head';
import { wrapper } from '../redux/store';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Sistema de Controle de Armazem</title>
        {/**  <link rel="icon" href='/noah.png' /> */}
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default wrapper.withRedux(MyApp)
