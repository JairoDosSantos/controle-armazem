import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import React, { useState } from 'react'
import Header from '../../components/Header'
import PainelItem from '../../components/Painel-Item'
import SiderBar from '../../components/SiderBar'
import nookies from 'nookies'
import { wrapper } from '../../redux/store'
import { fetchObra, fetchObraActiva } from '../../redux/slices/obraSlice'
import { fetchEncarregados } from '../../redux/slices/encarregadoSlice'
import { fetchArmGeralByClassificcao, fetchEsgotar } from '../../redux/slices/armGeralSlice'
import Head from 'next/head'

type PainelProps = {
    totalObras: number;
    obrasActivas: number;
    totalEncarregados: number;
    TotalHSST: number;
    TotalFerramenta: number;
    TotalMateriais: number

}

const Admin = ({ obrasActivas, totalObras, totalEncarregados, TotalHSST, TotalFerramenta, TotalMateriais }: PainelProps) => {

    return (
        <div className='flex'>
            <SiderBar itemActive='painel-controlo' />
            <main className='flex-1 space-y-6'>
                <div>
                    <Header />
                    <Head>
                        <title>SCA | Administrador</title>
                    </Head>
                </div>

                <div className='overflow-auto max-h-[85vh] overflow-hide-scroll-bar'>
                    <div className=' flex flex-wrap gap-6  justify-center items-center'>
                        <PainelItem icone='obra_activa' quantidade={obrasActivas} rodape='Total de obras activas' titulo='Obras activas' />
                        <PainelItem icone='total_obra' quantidade={totalObras} rodape='Número total de obras' titulo='Número de Obras' />
                        <PainelItem icone='epis_armazem' quantidade={TotalHSST} rodape='Total de Mat. de HSST em armazem' titulo='Higiene e Seg. em armazem' />
                        <PainelItem icone='ferramenta_armazem' quantidade={TotalFerramenta} rodape='Total de Ferramentas em armazem' titulo='Ferramenta em armazem' />
                        <PainelItem icone='material_armazem' quantidade={TotalMateriais} rodape='Total de Materiais em armazem' titulo='Material em armazem' />
                        <PainelItem icone='encarregado' quantidade={totalEncarregados} rodape='Total de Encarregados em obras' titulo='Encarregados' />
                        {/**      <PainelItem icone='ttl' quantidade={10} rodape='Stock de SOS atingido em armazem' titulo='A esgotar' /> */}
                    </div>

                </div>


            </main>
        </div>
    )
}


export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(
    (store) =>
        async (context: GetServerSidePropsContext) => {

            // const cookie = nookies.get(context);

            const obrasActivas: any = await (await store.dispatch(fetchObraActiva())).payload;
            const totalObras: any = await (await store.dispatch(fetchObra())).payload
            const totalEncarregado: any = await (await store.dispatch(fetchEncarregados())).payload
            const TotalHSSTs: any = await (await store.dispatch(fetchArmGeralByClassificcao(1))).payload
            const totalFerramentas: any = await (await store.dispatch(fetchArmGeralByClassificcao(4))).payload
            const TotalMaterial: any = await (await store.dispatch(fetchArmGeralByClassificcao(2))).payload
            const esgotar = await store.dispatch(fetchEsgotar())
            //   console.log(esgotar)
            const totalObrasActivas = obrasActivas ? obrasActivas.length : 0
            const totalObra = totalObras ? totalObras.length : 0
            const totalEncarregados = totalEncarregado ? totalEncarregado.length : 0
            const TotalHSST = TotalHSSTs ? TotalHSSTs.length : 0
            const TotalFerramenta = totalFerramentas ? totalFerramentas.length : 0
            const TotalMateriais = TotalMaterial ? TotalMaterial.length : 0


            // if (!cookie.USER_LOGGED_ARMAZEM) return { props: {}, redirect: { destination: '/', permanent: false } }

            return {
                props: {
                    obrasActivas: totalObrasActivas,
                    totalObras: totalObra,
                    totalEncarregados,
                    TotalHSST,
                    TotalFerramenta,
                    TotalMateriais
                },
            };




        }
);

/**
 * export async function getServerSideProps(context: GetServerSidePropsContext) {

    const cookie = nookies.get(context);

    if (!cookie.USER_LOGGED_ARMAZEM) {
        // If no user, redirect to index.
        return { props: {}, redirect: { destination: '/', permanent: false } }
    }

    return {
        props:
        {
            cookie
        }
    }
}
 */

export default Admin
