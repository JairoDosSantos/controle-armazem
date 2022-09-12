import Head from 'next/head'

import dynamic from 'next/dynamic'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { wrapper } from '../../redux/store'
import { fetchClassificacao } from '../../redux/slices/classificacaoSlice'
import { fetchDuracao } from '../../redux/slices/duracaoSlice.ts'
import { fetchArmGeral } from '../../redux/slices/armGeralSlice'
const RelatorioArmazem = dynamic(() => import('../../components/relatorios/Armazem'), { ssr: false })




type EquipamentoType = {
    id: number;
    descricao: string;
    duracao_id: number;
    classificacao_id: number;
    data: string
}

type EquipamentosARMType = {
    id: number;
    quantidade: number;
    equipamento_id: EquipamentoType;
    data_aquisicao: string
}
type DuracaoType = {
    id: number;
    tempo: string;

}
type ClassificacaoType = {
    id: number;
    tipo: string;

}

type PosicaoArmazemProps = {
    equipamentosARM: EquipamentosARMType[];

}

const Armazem = ({ equipamentosARM }: PosicaoArmazemProps) => {
    return (
        <div>
            <Head>
                <title>Relatório do Armazem</title>
            </Head>
            <RelatorioArmazem equipamentosARM={equipamentosARM} />

        </div>
    )
}

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(
    (store) =>
        async (context: GetServerSidePropsContext) => {

            // const cookie = nookies.get(context);

            //const equipamentoDispatch = await store.dispatch(fetchEquipamento());
            const classificacaoDispatch: any = await store.dispatch(fetchClassificacao());
            const duracaoDispatch: any = await store.dispatch(fetchDuracao());
            const equipamentoARM: any = await store.dispatch(fetchArmGeral());


            // const equipamentos = equipamentoDispatch.payload
            const classificacao = classificacaoDispatch.payload
            const duracao = duracaoDispatch.payload
            const equipamentosARM = equipamentoARM.payload
            /**
             *            if (!cookie.USER_LOGGED_ARMAZEM) {
                           // If no user, redirect to index.
                           return { props: {}, redirect: { destination: '/', permanent: false } }
                       }
             */
            return {
                props: {
                    equipamentosARM,
                    classificacao,
                    duracao
                },
            };
        }
);


export default Armazem
