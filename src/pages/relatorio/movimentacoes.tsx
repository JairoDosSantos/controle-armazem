import Head from 'next/head'

import dynamic from 'next/dynamic'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { wrapper } from '../../redux/store'
import { fetchSaida } from '../../redux/slices/auditoriaSlice'
import { fetchObra } from '../../redux/slices/obraSlice'
const RelatorioMovimentacoes = dynamic(() => import('../../components/relatorios/Movimentacoes'), { ssr: false })


type EquipamentoType = {
    id: number;
    descricao: string;
    duracao_id: number;
    classificacao_id: number;
    data: string
}
type ObraType = {
    id: number
    obra_nome: string;
    encarregado_id: number;
    estado: 'Activa' | 'Inactiva' | 'Concluida'
}

type AuditoriaType = {
    id: number;
    equipamento_id: EquipamentoType;
    obra_id: ObraType;
    data_retirada: string;
    quantidade_retirada: number;
    data_devolucao: string;
    quantidade_devolvida: number
}
type AuditoriaProps = {
    auditoria: AuditoriaType[];

}

const AlmoxarifadoRelatorio = ({ auditoria }: AuditoriaProps) => {
    return (
        <div>
            <Head>
                <title>Relatório de Movimentações</title>
            </Head>
            <RelatorioMovimentacoes auditoria={auditoria} />

        </div>
    )
}

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(
    (store) =>
        async (context: GetServerSidePropsContext) => {

            // const cookie = nookies.get(context);

            const auditoriaDispatch: any = await store.dispatch(fetchSaida());
            const obrasDispatch: any = await store.dispatch(fetchObra())


            const auditoria = auditoriaDispatch.payload
            const obras = obrasDispatch.payload
            /**
             * 
                        if (!cookie.USER_LOGGED_ARMAZEM) {
                            // If no user, redirect to index.
                            return { props: {}, redirect: { destination: '/', permanent: false } }
                        }
             */

            return {
                props: {
                    auditoria,
                    obras
                },
            };
        }
);

export default AlmoxarifadoRelatorio
