import Head from 'next/head'

import dynamic from 'next/dynamic'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { wrapper } from '../../../redux/store'
import { fetchCompra } from '../../../redux/slices/compraSlice'
import { fetchClassificacao } from '../../../redux/slices/classificacaoSlice'
import { fetchDuracao } from '../../../redux/slices/duracaoSlice.ts'
import { useRouter } from 'next/router'
import nookies from 'nookies'
const RelatorioCompras = dynamic(() => import('../../../components/relatorios/Compras'), { ssr: false })
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

    let comprasFiltradas: CompraType[] = [];
    const route = useRouter()
    const { slug } = route.query
    if (slug?.length === 1 && slug[0] === 'all') comprasFiltradas = compras
    else {

        if (slug && compras) {
            if (slug[0] !== 'equipamento' && slug[1] === '') comprasFiltradas = compras.filter((compra) => compra.equipamento_id.descricao.toLowerCase().includes(slug[0].toLowerCase()))
            else if (slug[0] === 'equipamento' && slug[1]) comprasFiltradas = compras.filter((compra) => compra.data_compra.toLowerCase().includes(slug[1].toLowerCase()))
            else comprasFiltradas = compras.filter((compra) => compra.equipamento_id.descricao.toLowerCase().includes(slug[0].toLowerCase()) && compra.data_compra.toLowerCase().includes(slug[1].toLowerCase()))
        }
    }

    return (
        <div>
            <Head>
                <title>Relatório </title>
            </Head>
            <RelatorioCompras compras={comprasFiltradas} />

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

            if (!cookie.USER_LOGGED_ARMAZEM) {
                // If no user, redirect to index.
                return { props: {}, redirect: { destination: '/', permanent: false } }
            }

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
