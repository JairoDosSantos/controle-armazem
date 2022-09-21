import { GetServerSidePropsContext } from 'next'
import React from 'react'
import nookies from 'nookies'
import { supabase } from '../utils/supabaseClient'
import Head from 'next/head'



const Sair = () => {
    return (
        <div>
            <Head>
                <title>Saindo ...</title>
            </Head>
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
