import Head from 'next/head'

import dynamic from 'next/dynamic'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { wrapper } from '../../../redux/store'
import { fetchClassificacao } from '../../../redux/slices/classificacaoSlice'
import { fetchDuracao } from '../../../redux/slices/duracaoSlice.ts'
import { fetchAlmoxarifario } from '../../../redux/slices/almoxarifarioSlice'
import { fetchObra } from '../../../redux/slices/obraSlice'
import { useRouter } from 'next/router'
import nookies from 'nookies'
const RelatorioAlmoxarifado = dynamic(() => import('../../../components/relatorios/Almoxarifado'), { ssr: false })


type DuracaoType = {
    id: number;
    tempo: string;

}
type ClassificacaoType = {
    id: number;
    tipo: string;

}
type ObraType = {
    id: number
    obra_nome: string;
    encarregado_id: number;
    estado: 'Activa' | 'Inactiva' | 'Concluida'
}
type EquipamentoType = {
    id: number;
    descricao: string;
    duracao_id: number;
    classificacao_id: number;
    data: string
}
type Almoxarifario = {
    id: number;
    equipamento_id: EquipamentoType;
    quantidade: number;
    obra_id: ObraType;
    data_aquisicao: string
}

type AlmoxarifadoProps = {
    almoxarifados: Almoxarifario[]
}

const Relatorio = ({ almoxarifados }: AlmoxarifadoProps) => {

    let almoxarifadoFiltrados: Almoxarifario[] = []

    const route = useRouter();

    const { slug } = route.query;

    if (slug?.length === 1 && slug[0] === 'all') almoxarifadoFiltrados = almoxarifados
    else {
        if (slug && almoxarifados) {
            if (slug[0] !== 'equipamento' && Number(slug[1]) === 0 && Number(slug[2]) === 0) {

                almoxarifadoFiltrados = almoxarifados.filter((almoxarifario) => almoxarifario.equipamento_id.descricao.toLowerCase().includes(slug[0].toLowerCase()))
            }
            else if

                (Number(slug[2]) !== 0 && slug[0] === 'equipamento' && Number(slug[1]) === 0) {
                almoxarifadoFiltrados = almoxarifados.filter((almoxarifario) => almoxarifario.equipamento_id.classificacao_id === Number(slug[2]))
            }

            else if (Number(slug[1]) !== 0 && slug[0] === 'equipamento' && Number(slug[2]) === 0) {
                almoxarifadoFiltrados = almoxarifados.filter((almoxarifario) => almoxarifario.obra_id.id === Number(slug[1]))
            }
            else if (Number(slug[1]) !== 0 && slug[0] !== 'equipamento' && Number(slug[2]) === 0) {
                almoxarifadoFiltrados = almoxarifados.filter((almoxarifario) => almoxarifario.obra_id.id === Number(slug[1]) && almoxarifario.equipamento_id.descricao.toLowerCase().includes(slug[0].toLowerCase()))
            }
            else if

                (Number(slug[2]) !== 0 && slug[0] !== 'equipamento' && Number(slug[1]) === 0) {
                almoxarifadoFiltrados = almoxarifados.filter((almoxarifario) => almoxarifario.equipamento_id.classificacao_id === Number(slug[2]) && almoxarifario.equipamento_id.descricao.toLowerCase().includes(slug[0].toLowerCase()))
            }
            else { almoxarifadoFiltrados = almoxarifados.filter((almoxarifario) => almoxarifario.equipamento_id.descricao.toLowerCase().includes(slug[0].toLowerCase()) && almoxarifario.obra_id.id === (Number(slug[1])) && almoxarifario.equipamento_id.classificacao_id === Number(slug[2])) }

        }
    }
    return (
        <div>
            <Head>
                <title>Relatório de Almoxarifado</title>
            </Head>
            <RelatorioAlmoxarifado almoxarifados={almoxarifadoFiltrados} />

        </div>
    )
}

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(
    (store) =>
        async (context: GetServerSidePropsContext) => {

            const cookie = nookies.get(context);

            //const equipamentoDispatch = await store.dispatch(fetchEquipamento());
            const classificacaoDispatch: any = await store.dispatch(fetchClassificacao());
            const duracaoDispatch: any = await store.dispatch(fetchDuracao());
            const almoxarifario: any = await store.dispatch(fetchAlmoxarifario());
            const obra: any = await store.dispatch(fetchObra());


            // const equipamentos = equipamentoDispatch.payload
            const classificacao = classificacaoDispatch.payload
            const duracao = duracaoDispatch.payload
            const almoxarifarios = almoxarifario.payload
            const obras = obra.payload

            if (!cookie.USER_LOGGED_ARMAZEM) {
                // If no user, redirect to index.
                return { props: {}, redirect: { destination: '/', permanent: false } }
            }

            return {
                props: {
                    almoxarifarios,
                    classificacao,
                    duracao,
                    obras
                },
            };
        }
);

export default Relatorio
