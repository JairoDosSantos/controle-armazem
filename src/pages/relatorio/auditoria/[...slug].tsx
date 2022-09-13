import Head from 'next/head'

import dynamic from 'next/dynamic'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { wrapper } from '../../../redux/store'
import { fetchSaida } from '../../../redux/slices/auditoriaSlice'
import { fetchObra } from '../../../redux/slices/obraSlice'
import { useRouter } from 'next/router'
import nookies from 'nookies'
const RelatorioMovimentacoes = dynamic(() => import('../../../components/relatorios/Movimentacoes'), { ssr: false })


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

    let movimentacoesFiltradas: AuditoriaType[] = []

    const route = useRouter();
    const { slug } = route.query

    if (slug?.length === 1 && slug[0] === 'all') movimentacoesFiltradas = auditoria
    else {
        if (slug && auditoria) {
            if (Number(slug[0]) !== 0 && slug[1] === '') movimentacoesFiltradas = auditoria.filter((saidaEntrada) => saidaEntrada.obra_id.id === Number(slug[0]))
            else if (slug[1] && Number(slug[0]) === 0) movimentacoesFiltradas = auditoria.filter((entradaSaida) => entradaSaida.data_retirada.toLowerCase().includes(slug[1].toLowerCase()))
            else movimentacoesFiltradas = auditoria.filter((entradaSaida) => entradaSaida.data_retirada.toLowerCase().includes(slug[1].toLowerCase()) && entradaSaida.obra_id.id === Number(slug[0]))
        }
    }

    return (
        <div>
            <Head>
                <title>Relatório de Movimentações</title>
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
            const obras = obrasDispatch.payload

            if (!cookie.USER_LOGGED_ARMAZEM) {
                // If no user, redirect to index.
                return { props: {}, redirect: { destination: '/', permanent: false } }
            }


            return {
                props: {
                    auditoria,
                    obras
                },
            };
        }
);

export default AlmoxarifadoRelatorio
