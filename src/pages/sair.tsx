import { GetServerSideProps, GetServerSidePropsContext } from 'next'
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

    nookies.destroy(context, 'USER_LOGGED_ARMAZEM')


    const cookie = nookies.get(context)

    if (!cookie.USER_LOGGED_ARMAZEM) {
        // If no user, redirect to index.
        return { props: {}, redirect: { destination: '/', permanent: false } }
    }
    return {
        props: {
            data: 'saindo...'
        }
    }
}

export default Sair
