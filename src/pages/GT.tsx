import Head from "next/head"
import { useState } from "react"

import Header from "../components/Header"
import SiderBar from "../components/SiderBar"

import nookies from 'nookies'

import { GetServerSideProps, GetServerSidePropsContext } from "next"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import ReactPaginate from 'react-paginate'
import { fetchSaida } from "../redux/slices/auditoriaSlice"
import { fetchObra } from "../redux/slices/obraSlice"
import { wrapper } from "../redux/store"
const SweetAlert2 = dynamic(() => import('react-sweetalert2'), { ssr: false })
const LinkDonwloadGT = dynamic(() => import('../components/relatorios/Gt'), { ssr: false })
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
    auditoria: AuditoriaType[];
    obras: ObraType[]
}

const GT = ({ auditoria, obras }: AuditoriaProps) => {

    const [currentPage, setCurrentPage] = useState(0);
    const PER_PAGE = 3;
    const offset = currentPage * PER_PAGE;
    let pageCount = 1;

    let currentFilteredData: AuditoriaType[] = []

    const route = useRouter()


    //Estados dos sweetAlerts
    const [showConfirmAlert, setShowConfirmAlert] = useState(false)
    const [showErrorAlert, setShowErrorAlert] = useState(false)
    const [showQuestionAlert, setShowQuestionAlert] = useState(false)
    const [searchObra, setSearchObra] = useState(0)
    const [searchData, setSearchData] = useState('')

    let findedAuditoria: AuditoriaType[] = []

    if (auditoria.length) {
        if (searchObra !== 0 && searchData === '') findedAuditoria = auditoria.filter((saidaEntrada) => saidaEntrada.obra_id.id === searchObra)
        else if (searchData && searchObra === 0) findedAuditoria = auditoria.filter((entradaSaida) => entradaSaida.data_retirada.toLowerCase().includes(searchData.toLowerCase()))
        else findedAuditoria = auditoria.filter((entradaSaida) => entradaSaida.data_retirada.toLowerCase().includes(searchData.toLowerCase()) && entradaSaida.obra_id.id === searchObra)
    }


    currentFilteredData = findedAuditoria
        ?.slice(offset, offset + PER_PAGE)

    pageCount = Math.ceil(findedAuditoria.length / PER_PAGE);


    function handlePageClick({ selected: selectedPage }: any) {
        setCurrentPage(selectedPage);
    }

    return (
        <div className='flex'>
            <SiderBar itemActive="gt" />
            <main className='flex-1 space-y-6 max-h-screen overflow-hide-scroll-bar overflow-x-hidden'>
                <div>
                    <Header />
                </div>
                <Head>
                    <title>SCA | Guia de Transporte</title>
                </Head>

                {/**Confirm alert**/}
                <SweetAlert2
                    backdrop={true}
                    show={showConfirmAlert}
                    title='Sucesso'
                    text='Novo fornecedor criado com sucesso!'
                    onConfirm={() => setShowConfirmAlert(false)}
                    didClose={() => setShowConfirmAlert(false)}
                    didDestroy={() => setShowConfirmAlert(false)}
                    icon='success'
                    allowOutsideClick={true}
                    allowEnterKey={true}
                    allowEscapeKey={true}
                    showConfirmButton={true}
                    confirmButtonColor="#4051ef"
                />
                {/**Error Alert */}
                <SweetAlert2
                    backdrop={true}
                    show={showErrorAlert}
                    title='Erro'
                    text='Ocorreu um erro ao efectuar a operação. Por favor, verifique se o fornecedor já não está cadastrado no sistema!'
                    icon='error'
                    onConfirm={() => setShowErrorAlert(false)}
                    didClose={() => setShowErrorAlert(false)}
                    didDestroy={() => setShowErrorAlert(false)}
                    allowOutsideClick={true}
                    allowEnterKey={true}
                    allowEscapeKey={true}
                    showConfirmButton={true}
                    confirmButtonColor="#4051ef"

                />

                {/** Question Alert */}
                <SweetAlert2
                    backdrop={true}
                    show={showQuestionAlert}
                    title='Atenção'
                    text='Tem a certeza que deseja efectuar esta operação?'
                    icon='question'
                    onConfirm={() => setShowQuestionAlert(false)}
                    didClose={() => setShowQuestionAlert(false)}
                    didDestroy={() => setShowQuestionAlert(false)}
                    allowOutsideClick={true}
                    allowEnterKey={true}
                    allowEscapeKey={true}
                    showConfirmButton={true}
                    showCancelButton={true}
                    cancelButtonText='Cancelar'
                    confirmButtonColor="#4051ef"
                    confirmButtonText="Sim"

                />

                <div className='overflow-auto max-h-[85vh] max-w-4xl mx-auto overflow-hide-scroll-bar'>
                    <div className="bg-white shadow max-w-6xl mx-auto flex flex-col space-y-6 p-6 rounded mt-5 animate__animated animate__fadeIn">
                        <h2 className=" h-5 text-2xl font-semibold">Guia de Transporte - GT</h2>
                        <div className="border w-1/5 border-gray-700 ml-4"></div>

                        <div className="flex gap-5">

                            <div className="animate__animated animate__fadeIn w-full flex flex-col lg:flex-row gap-4">
                                <select
                                    onChange={(event) => setSearchObra(Number(event.target.value))}
                                    className='rounded shadow w-full lg:w-1/2 cursor-pointer '>
                                    <option value="#" className='text-gray-400'>Selecione a Obra</option>
                                    {obras && obras.map((obra, index) => (
                                        <option
                                            key={index}
                                            value={obra.id}>{obra.obra_nome}</option>
                                    ))}
                                </select>
                                <input
                                    onChange={(event) => setSearchData(event.target.value)}
                                    type="date"
                                    className="rounded shadow w-full lg:w-1/2 cursor-pointer " />
                            </div>

                        </div>
                        <div className=" ml-auto flex gap-2">
                            {
                                (searchData && searchObra && findedAuditoria.length) ?
                                    (<LinkDonwloadGT auditoria={findedAuditoria} />) : ""
                            }

                        </div>
                    </div>


                </div>
                <div className='mt-8 text-end px-4 py-2 flex flex-col flex-1 mx-auto bg-white rounded overflow-x-auto overflow-hide-scroll-bar'>
                    <span className='font-semibold text-lg'>Guia de Transporte</span>

                    <table className='table w-full text-center mt-2 animate__animated animate__fadeIn'>
                        <thead>
                            <tr className='flex justify-between bg-gray-200 px-4 py-2 rounded'>
                                <th className='text-gray-600 font-bold w-16'>ID</th>
                                <th className='text-gray-600 font-bold w-72 '>Descrição</th>
                                <th className='text-gray-600 font-bold w-40 '>Estado</th>
                                <th className='text-gray-600 font-bold w-52'>Centro de Custo</th>
                                <th className='text-gray-600 font-bold w-44'>Qtd.</th>
                                <th className='text-gray-600 font-bold w-40'>Data de saída</th>
                            </tr>
                        </thead>
                        <tbody className=''>
                            {
                                ((searchData || searchObra) && findedAuditoria.length === 0) ? <tr><td className="p-4 font-bold">... G.T. não localizada</td></tr> :
                                    currentFilteredData?.map((findAud, index) => (
                                        <tr key={index}
                                            className='flex justify-between border shadow-md mt-4 px-4 py-2'>
                                            <td className="w-16">{findAud.id}</td>
                                            <td className="w-72">{findAud.equipamento_id.descricao}</td>
                                            <td className="w-40">{findAud.estado}</td>
                                            <td className="w-52">{findAud.obra_id.obra_nome}</td>
                                            <td className="w-44">{findAud.quantidade_retirada}</td>
                                            <td className="w-40">{findAud.data_retirada}</td>
                                        </tr>
                                    ))
                            }

                        </tbody>
                    </table>
                    <ReactPaginate
                        previousLabel={"←"}
                        nextLabel={"→"}
                        breakLabel={'...'}
                        containerClassName={"pagination"}
                        previousLinkClassName={"pagination__link"}
                        nextLinkClassName={"pagination__link"}
                        disabledClassName={"pagination__link--disabled"}
                        activeClassName={"pagination__link--active"}

                        pageCount={pageCount}
                        onPageChange={handlePageClick}
                    />
                </div>
            </main>
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

            if (!cookie.USER_LOGGED_ARMAZEM) return { props: {}, redirect: { destination: '/', permanent: false } }

            return {
                props: {
                    auditoria,
                    obras
                },
            };
        }
);

export default GT
