import Head from 'next/head'

import dynamic from 'next/dynamic'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { wrapper } from '../../../redux/store'
import { fetchClassificacao } from '../../../redux/slices/classificacaoSlice'
import { fetchDuracao } from '../../../redux/slices/duracaoSlice.ts'
import { fetchArmGeral } from '../../../redux/slices/armGeralSlice'
import AES from 'crypto-js/aes';
import { enc } from 'crypto-js';
import nookies from 'nookies'
const RelatorioArmazem = dynamic(() => import('../../../components/relatorios/Armazem'), { ssr: false })


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
    data_aquisicao: string;
    estado: string
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
    armazemData: EquipamentosARMType[];
    classificacao: ClassificacaoType[];
    duracao: DuracaoType[]

}

const Armazem = ({ armazemData, classificacao, duracao }: PosicaoArmazemProps) => {

    return (

        <div>
            <Head>
                <title>Relatório do Armazem</title>
            </Head>

            <RelatorioArmazem classificacao={classificacao} duracao={duracao} equipamentosARM={armazemData} />

        </div>
    )
}

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(
    (store) =>
        async (context: GetServerSidePropsContext) => {


            const decriptedSTR = (params: string) => {

                const decodedStr = decodeURIComponent(params);
                return AES.decrypt(decodedStr, 'AES-256-CBC').toString(enc.Utf8);
            }

            const cookie = nookies.get(context);

            //const equipamentoDispatch = await store.dispatch(fetchEquipamento());
            const classificacaoDispatch: any = await store.dispatch(fetchClassificacao());
            const duracaoDispatch: any = await store.dispatch(fetchDuracao());
            const equipamentoARM: any = await store.dispatch(fetchArmGeral());


            // const equipamentos = equipamentoDispatch.payload
            const classificacao = classificacaoDispatch.payload
            const duracao = duracaoDispatch.payload
            const equipamentosARM = equipamentoARM.payload

            if (!cookie.USER_LOGGED_ARMAZEM) return { props: {}, redirect: { destination: '/', permanent: false } }


            let armazemData = []

            //const { query } = useRouter();

            const slug = context.params?.slug

            if (slug?.length === 1 && slug[0] === 'all') armazemData = equipamentosARM

            else {

                if (slug && equipamentosARM) {
                    const URLdesencriptada = decriptedSTR(slug[0])
                    if (URLdesencriptada !== 'equipamento' && Number(slug[1]) === 0) {
                        armazemData = equipamentosARM.filter((equipamento: EquipamentosARMType) => equipamento.equipamento_id.descricao.toLowerCase().includes(URLdesencriptada.toLowerCase()))
                    } else if (Number(slug[1]) !== 0 && URLdesencriptada === 'equipamento') {
                        armazemData = equipamentosARM.filter((equipamento: EquipamentosARMType) => equipamento.equipamento_id.classificacao_id === Number(slug[1]))
                    } else if (URLdesencriptada !== 'equipamento' && Number(slug[1]) !== 0) {
                        armazemData = equipamentosARM.filter((equipamento: EquipamentosARMType) => equipamento.equipamento_id.descricao.toLowerCase().includes(URLdesencriptada.toLowerCase()) && equipamento.equipamento_id.classificacao_id === Number(slug[1]))
                    }

                }
            }

            return {
                props: {
                    armazemData,
                    classificacao,
                    duracao
                },
            };
        }
);


export default Armazem
