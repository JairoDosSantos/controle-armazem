import 'animate.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import '../../styles/globals.css';

import { motion } from 'framer-motion';
import Router from "next/router";
import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { wrapper } from '../redux/store';
function MyApp({ Component, pageProps, router }: AppProps) {
  const queryClient = new QueryClient()
  /* ... */
  useEffect(() => {

    const handleRouteStart = () => NProgress.start();
    const handleRouteDone = () => NProgress.done();

    Router.events.on("routeChangeStart", handleRouteStart);
    Router.events.on("routeChangeComplete", handleRouteDone);
    Router.events.on("routeChangeError", handleRouteDone);

    return () => {
      // Make sure to remove the event handler on unmount!
      Router.events.off("routeChangeStart", handleRouteStart);
      Router.events.off("routeChangeComplete", handleRouteDone);
      Router.events.off("routeChangeError", handleRouteDone);
    };
  }, []);
  /* ... */

  return (
    <QueryClientProvider client={queryClient}>
      <Head>
        <title>Sistema de Controle de Armazem</title>
        {/**  <link rel="icon" href='/noah.png' /> */}
        <meta
          name='viewport'
          content='minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover'
        />
      </Head>
      <motion.div
        key={router.route}
        initial="initial"
        animate="animate"
        // this is a simple animation that fades in the page. You can do all kind of fancy stuff here
        variants={{
          initial: {
            opacity: 0,
          },
          animate: {
            opacity: 1,
          },
        }}>
        <Component {...pageProps} />
      </motion.div>
    </QueryClientProvider>
  )
}

export default wrapper.withRedux(MyApp)
