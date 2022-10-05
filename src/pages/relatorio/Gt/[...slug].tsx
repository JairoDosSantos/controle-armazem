import Head from 'next/head'

import dynamic from 'next/dynamic'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { wrapper } from '../../../redux/store'
import { fetchSaida } from '../../../redux/slices/auditoriaSlice'
import { fetchObra } from '../../../redux/slices/obraSlice'
import { useRouter } from 'next/router'
import nookies from 'nookies'
const RelatorioMovimentacoes = dynamic(() => import('../../../components/relatorios/Gt'), { ssr: false })


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
    quantidade_devolvida: number;
    estado: string
}
type AuditoriaProps = {
    movimentacoesFiltradas: AuditoriaType[];

}

const GuiaTransporte = ({ movimentacoesFiltradas }: AuditoriaProps) => {

    return (
        <div>
            <Head>
                <title> Guia de transporte</title>
            </Head>

            <RelatorioMovimentacoes auditoria={movimentacoesFiltradas} />


        </div>
    )
}

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(
    (store) =>
        async (context: GetServerSidePropsContext) => {

            const cookie = nookies.get(context);

            const auditoriaDispatch: any = await store.dispatch(fetchSaida());
            const obrasDispatch: any = await store.dispatch(fetchObra())


            const auditoria = auditoriaDispatch.payload
            // const obras = obrasDispatch.payload

            if (!cookie.USER_LOGGED_ARMAZEM) {
                // If no user, redirect to index.
                return { props: {}, redirect: { destination: '/', permanent: false } }
            }
            let movimentacoesFiltradas = []


            const slug = context.params?.slug

            if (slug && slug[0] === 'all') movimentacoesFiltradas = auditoria
            else {
                if (slug && auditoria.length) {
                    movimentacoesFiltradas = auditoria.filter((entradaSaida: AuditoriaType) => entradaSaida.data_retirada.toLowerCase().includes(slug[1].toLowerCase()) && entradaSaida.obra_id.id === Number(slug[0]))
                }
            }

            return {
                props: {
                    movimentacoesFiltradas
                },
            };
        }
);

export default GuiaTransporte
