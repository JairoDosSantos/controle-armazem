import Head from 'next/head'

import dynamic from 'next/dynamic'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { wrapper } from '../../redux/store'
import nookies from 'nookies'
import { fetchCompra } from '../../redux/slices/compraSlice'
import { fetchClassificacao } from '../../redux/slices/classificacaoSlice'
import { fetchDuracao } from '../../redux/slices/duracaoSlice.ts'
const RelatorioCompras = dynamic(() => import('../../components/relatorios/Compras'), { ssr: false })
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
    quantidade_comprada: number
}


type ComprasProps = {
    compras: CompraType[]
}

const Relatorio = ({ compras }: ComprasProps) => {
    return (
        <div>
            <Head>
                <title>Relatório</title>
            </Head>
            <RelatorioCompras compras={compras} />

        </div>
    )
}

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(
    (store) =>
        async (context: GetServerSidePropsContext) => {
            const cookie = nookies.get(context);
            const compraDispatch: any = await store.dispatch(fetchCompra());

            const classificacaoDispatch: any = await store.dispatch(fetchClassificacao());
            const duracaoDispatch: any = await store.dispatch(fetchDuracao());

            const compras = compraDispatch.payload
            const classificacao = classificacaoDispatch.payload
            const duracao = duracaoDispatch.payload

            /**
             *    if (!cookie.USER_LOGGED_ARMAZEM) {
                   // If no user, redirect to index.
                   return { props: {}, redirect: { destination: '/', permanent: false } }
               }
             */
            return {
                props: {
                    compras,
                    classificacao,
                    duracao
                },
            };
        }
);


export default Relatorio
