import Head from 'next/head'

import dynamic from 'next/dynamic'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { wrapper } from '../../../redux/store'
import { fetchClassificacao } from '../../../redux/slices/classificacaoSlice'
import { fetchDuracao } from '../../../redux/slices/duracaoSlice.ts'
import { fetchAlmoxarifario } from '../../../redux/slices/almoxarifarioSlice'
import { fetchObra } from '../../../redux/slices/obraSlice'

import nookies from 'nookies'
import AES from 'crypto-js/aes';
import { enc } from 'crypto-js';

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
    data_aquisicao: string;
    estado: string
}

type AlmoxarifadoProps = {
    almoxarifadoFiltrados: Almoxarifario[];
    duracao: DuracaoType[];
    classificacao: ClassificacaoType[]
}

const Relatorio = ({ almoxarifadoFiltrados, duracao, classificacao }: AlmoxarifadoProps) => {

    // console.log('Almoxarifado', almoxarifadoFiltrados)
    // let almoxarifadoFiltrados: Almoxarifario[] = []
    /**
     * const route = useRouter();

        const { slug } = route.query;
     */


    return (
        <div>
            <Head>
                <title>Relatório de Almoxarifado</title>
            </Head>


            <RelatorioAlmoxarifado almoxarifadoFiltrados={almoxarifadoFiltrados} duracao={duracao} classificacao={classificacao} />
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(
    (store) =>
        async (context: GetServerSidePropsContext) => {
            let almoxarifadoFiltrados = []
            const cookie = nookies.get(context);
            if (!cookie.USER_LOGGED_ARMAZEM) {
                // If no user, redirect to index.
                return { props: {}, redirect: { destination: '/', permanent: false } }
            }
            const slug = context.params?.slug
            const decriptedSTR = (params: string) => {
                const decodedStr = decodeURIComponent(params);
                return AES.decrypt(decodedStr, 'AES-256-CBC').toString(enc.Utf8);
            }
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


            if (slug?.length === 1 && slug[0] === 'all') almoxarifadoFiltrados = almoxarifarios
            else {
                if (slug && almoxarifarios) {
                    const descriptografado = decriptedSTR(slug[0])

                    if (descriptografado !== 'equipamento' && Number(slug[1]) === 0 && Number(slug[2]) === 0) {

                        almoxarifadoFiltrados = almoxarifarios.filter((almoxarifario: Almoxarifario) => almoxarifario.equipamento_id.descricao.toLowerCase().includes(descriptografado.toLowerCase()))
                    }
                    else if

                        (Number(slug[2]) !== 0 && descriptografado === 'equipamento' && Number(slug[1]) === 0) {
                        almoxarifadoFiltrados = almoxarifarios.filter((almoxarifario: Almoxarifario) => almoxarifario.equipamento_id.classificacao_id === Number(slug[2]))
                    }

                    else if (Number(slug[1]) !== 0 && descriptografado === 'equipamento' && Number(slug[2]) === 0) {
                        almoxarifadoFiltrados = almoxarifarios.filter((almoxarifario: Almoxarifario) => almoxarifario.obra_id.id === Number(slug[1]))
                    }
                    else if (Number(slug[1]) !== 0 && descriptografado === 'equipamento' && Number(slug[2]) !== 0) {
                        almoxarifadoFiltrados = almoxarifarios.filter((almoxarifario: Almoxarifario) => almoxarifario.obra_id.id === Number(slug[1]) && almoxarifario.equipamento_id.classificacao_id === Number(slug[2]))
                    }
                    else if (Number(slug[1]) !== 0 && descriptografado !== 'equipamento' && Number(slug[2]) === 0) {
                        almoxarifadoFiltrados = almoxarifarios.filter((almoxarifario: Almoxarifario) => almoxarifario.obra_id.id === Number(slug[1]) && almoxarifario.equipamento_id.descricao.toLowerCase().includes(descriptografado.toLowerCase()))
                    }
                    else if

                        (Number(slug[2]) !== 0 && descriptografado !== 'equipamento' && Number(slug[1]) === 0) {
                        almoxarifadoFiltrados = almoxarifarios.filter((almoxarifario: Almoxarifario) => almoxarifario.equipamento_id.classificacao_id === Number(slug[2]) && almoxarifario.equipamento_id.descricao.toLowerCase().includes(descriptografado.toLowerCase()))
                    }
                    else {

                        almoxarifadoFiltrados = almoxarifarios.filter((almoxarifario: Almoxarifario) => almoxarifario.equipamento_id.descricao.toLowerCase().includes(descriptografado.toLowerCase()) && almoxarifario.obra_id.id === (Number(slug[1])) && almoxarifario.equipamento_id.classificacao_id === Number(slug[2]))
                    }

                }
            }

            return {
                props: {
                    almoxarifadoFiltrados,
                    classificacao,
                    duracao
                },
            };
        }
);

export default Relatorio
