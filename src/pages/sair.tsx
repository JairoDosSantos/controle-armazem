import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import React from 'react'
import nookies from 'nookies'
import { supabase } from '../utils/supabaseClient'
import Head from 'next/head'

import dynamic from 'next/dynamic'
//const RelatorioCompras = dynamic(() => import('../components/relatorios/Testando'), { ssr: false })

const Sair = () => {
    return (
        <div>
            <Head>
                <title>Saindo ...</title>
            </Head>
            {/**
       *       <RelatorioCompras />
       */}
        </div>
    )
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {

    let { error } = await supabase.auth.signOut();

    if (!error) {

        nookies.destroy(context, 'USER_LOGGED_ARMAZEM', {
            path: '/'
        })

        // If no user, redirect to index.
        return { props: {}, redirect: { destination: '/', permanent: false } }
    }


}


export default Sair
