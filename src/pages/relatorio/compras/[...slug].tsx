import Head from 'next/head'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { wrapper } from '../../../redux/store'
import { fetchCompra } from '../../../redux/slices/compraSlice'
import { fetchClassificacao } from '../../../redux/slices/classificacaoSlice'
import { fetchDuracao } from '../../../redux/slices/duracaoSlice.ts'
import { useRouter } from 'next/router'
import nookies from 'nookies'
const RelatorioCompras = dynamic(() => import('../../../components/relatorios/Compras'), { ssr: false })

import AES from 'crypto-js/aes';
import { enc } from 'crypto-js';
import { FaCompressAlt } from 'react-icons/fa'

// @ts-ignore  

type EquipamentoType = {
    id: number;
    descricao: string;
    duracao_id: number;
    classificacao_id: number;
    data: string;
    stock_emergencia: number
}

type CompraType = {
    id: number;
    equipamento_id: EquipamentoType;
    preco: number;
    data_compra: string;
    quantidade_comprada: number;
    estado: string
}


type ComprasProps = {
    compras: CompraType[]
}

const Relatorio = ({ compras }: ComprasProps) => {

    return (
        <div>
            <Head>
                <title>Relatório </title>
            </Head>

            <RelatorioCompras compras={compras} />

        </div>
    )
}

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(
    (store) =>
        async (context: GetServerSidePropsContext) => {
            const cookie = nookies.get(context);
            if (!cookie.USER_LOGGED_ARMAZEM) {
                // If no user, redirect to index.
                return { props: {}, redirect: { destination: '/', permanent: false } }
            }
            const decriptedSTR = (params: string) => {

                const decodedStr = decodeURIComponent(params);
                return AES.decrypt(decodedStr, 'AES-256-CBC').toString(enc.Utf8);
            }
            const compraDispatch: any = await store.dispatch(fetchCompra());
            const compras = compraDispatch.payload

            const slug = context.params?.slug


            let comprasFiltradas = []
            if (slug?.length === 1 && decriptedSTR(slug[0]) === 'all') comprasFiltradas = compras
            else {
                if (slug?.length && compras) {
                    if (decriptedSTR(slug[0]) !== 'equipamento' && decriptedSTR(slug[1]) === '') comprasFiltradas = compras?.filter((compra: CompraType) => compra.equipamento_id.descricao.toLowerCase().includes(decriptedSTR(slug[0]).toLowerCase()))
                    else if (decriptedSTR(slug[0]) === 'equipamento' && decriptedSTR(slug[1])) comprasFiltradas = compras?.filter((compra: CompraType) => compra.data_compra.toLowerCase().includes(decriptedSTR(slug[1]).toLowerCase()))
                    else comprasFiltradas = compras?.filter((compra: CompraType) => compra.equipamento_id.descricao.toLowerCase().includes(decriptedSTR(slug[0]).toLowerCase()) && compra.data_compra.toLowerCase().includes(decriptedSTR(slug[1]).toLowerCase()))
                }
            }
            //  slug && console.log(decriptedSTR(slug[0]))
            return {
                props: {
                    compras: comprasFiltradas,
                },
            };
        }
);


export default Relatorio
