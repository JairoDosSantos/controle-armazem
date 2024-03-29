import Head from "next/head"
import { useState } from "react"

import Header from "../components/Header"
import SiderBar from "../components/SiderBar"

import nookies from 'nookies'
import { FaEdit } from 'react-icons/fa'

import { GetServerSideProps, GetServerSidePropsContext } from "next"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import ReactPaginate from 'react-paginate'
import EditarModal from "../components/auditoria/EditModal"
import { fetchSaida } from "../redux/slices/auditoriaSlice"
import { fetchObra } from "../redux/slices/obraSlice"
import { wrapper } from "../redux/store"
const SweetAlert2 = dynamic(() => import('react-sweetalert2'), { ssr: false })
const LinkDonwloadMovimentacoes = dynamic(() => import('../components/relatorios/Movimentacoes'), { ssr: false })
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

const Saida = ({ auditoria, obras }: AuditoriaProps) => {


    const [currentPage, setCurrentPage] = useState(0);
    const PER_PAGE = 3;
    const offset = currentPage * PER_PAGE;
    let pageCount = 1;

    let currentPageData: AuditoriaType[] = []
    let currentFilteredData: AuditoriaType[] = []

    const route = useRouter()

    const [filtroPorObra, setFiltroPorObra] = useState(false)
    const [filtroPorMovimentacoes, setFiltroPorMovimentacoes] = useState(false)

    //Estados dos sweetAlerts
    const [showConfirmAlert, setShowConfirmAlert] = useState(false)
    const [showErrorAlert, setShowErrorAlert] = useState(false)
    const [showQuestionAlert, setShowQuestionAlert] = useState(false)
    const [searchObra, setSearchObra] = useState(0)
    const [searchData, setSearchData] = useState('')

    const [showEditModal, setShowEditModal] = useState(false)
    const [auditoriaObject, setAuditoriaObject] = useState<AuditoriaType>({} as AuditoriaType);
    //const { register, handleSubmit, watch, formState: { errors, isValid } } = useForm<FormValues>({ mode: 'onChange' });

    let findedAuditoria: AuditoriaType[] = []
    if (auditoria && auditoria.length && filtroPorObra) {
        if (searchObra !== 0 && searchData === '') findedAuditoria = auditoria.filter((saidaEntrada) => saidaEntrada.obra_id.id === searchObra)
        else if (searchData && searchObra === 0) findedAuditoria = auditoria.filter((entradaSaida) => entradaSaida.data_retirada.toLowerCase().includes(searchData.toLowerCase()))
        else findedAuditoria = auditoria.filter((entradaSaida) => entradaSaida.data_retirada.toLowerCase().includes(searchData.toLowerCase()) && entradaSaida.obra_id.id === searchObra)
    }

    if (findedAuditoria.length) {
        currentFilteredData = findedAuditoria
            ?.slice(offset, offset + PER_PAGE)

        pageCount = Math.ceil(findedAuditoria.length / PER_PAGE);
    } else {
        currentPageData = auditoria
            ?.slice(offset, offset + PER_PAGE)

        pageCount = Math.ceil(auditoria.length / PER_PAGE);
    }

    const handleEdit = (saida: AuditoriaType) => {
        setAuditoriaObject(saida)
        setShowEditModal(true)
    }

    function handlePageClick({ selected: selectedPage }: any) {
        setCurrentPage(selectedPage);
    }
    const toPrint = findedAuditoria.length ? findedAuditoria : auditoria
    return (
        <div className='flex'>
            <SiderBar itemActive="saidas" />
            <main className='flex-1 space-y-6 max-h-screen overflow-hide-scroll-bar overflow-x-hidden'>
                <div>
                    <Header />
                </div>
                <Head>
                    <title>SCA | Auditoría</title>
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

                {showEditModal && <EditarModal data={auditoriaObject} isOpen={showEditModal} setIsOpen={setShowEditModal} />}

                <div className='overflow-auto max-h-[85vh] max-w-4xl mx-auto overflow-hide-scroll-bar'>
                    <div className="bg-white shadow max-w-6xl mx-auto flex flex-col space-y-6 p-6 rounded mt-5 animate__animated animate__fadeIn">
                        <h2 className=" h-5 text-2xl font-semibold">Mov. em armazem geral</h2>
                        <div className="border w-1/5 border-gray-700 ml-4"></div>

                        <div className="flex items-center justify-between ">
                            <div className=" flex gap-2  ">
                                <div>
                                    <label htmlFor="saida" className="bg-white">Saídas&nbsp;</label>
                                    <input
                                        defaultChecked={true}
                                        onClick={() => setFiltroPorMovimentacoes(false)}
                                        type={"radio"}
                                        name='movimentacoes'
                                        id='saida'
                                        className="cursor-pointer" />
                                </div>
                                <div>
                                    <label htmlFor="devolucoes" className="bg-white">Devoluções&nbsp;</label>
                                    <input
                                        onClick={() => setFiltroPorMovimentacoes(true)}

                                        type={"radio"}
                                        name='movimentacoes'
                                        id='devolucoes'
                                        className="cursor-pointer" />
                                </div>
                            </div>
                            <div className=" flex gap-2 ">
                                <div>
                                    <label htmlFor="todas" className="bg-white">Todas&nbsp;</label>
                                    <input
                                        defaultChecked={true}
                                        onClick={() => setFiltroPorObra(false)}
                                        type={"radio"}
                                        name='classificacao'
                                        id='todas'
                                        className="cursor-pointer" />
                                </div>
                                <div>
                                    <label htmlFor="filtro" className="bg-white">Filtrar por&nbsp;</label>
                                    <input
                                        onClick={() => setFiltroPorObra(true)}
                                        type={"radio"}
                                        name='classificacao'
                                        id='filtro'
                                        className="cursor-pointer" />
                                </div>
                            </div>
                        </div>
                        <div className="flex  gap-5">
                            {
                                filtroPorObra && (
                                    <div className="animate__animated animate__fadeIn w-full flex flex-col lg:flex-row gap-4">
                                        <select
                                            onChange={(event) => setSearchObra(Number(event.target.value))}
                                            className='rounded shadow w-full lg:w-1/2 cursor-pointer '>
                                            <option value="#" className='text-gray-400'>Selecione a Obra</option>
                                            {obras?.map((obra, index) => (
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
                                )
                            }
                        </div>
                        <div className=" ml-auto flex gap-2">
                            {/**

                            <LinkDonwloadMovimentacoes
                                auditoria={toPrint}
                                legenda={(searchData.length || searchObra.toString().length) ? 'Imprimir' : 'Imprimir Tudo'} />
                            */}

                            {/**
                             * <button
                                onClick={() => route.push('/relatorio/auditoria/all')}
                                className="bg-gray-700 text-white px-4 py-2 shadow font-bold flex items-center gap-2 hover:brightness-75">
                                <FaPrint />
                                <span>Imprimir tudo</span>
                            </button>
                            <button
                                disabled={!(searchData || searchObra)}
                                onClick={() => route.push(`/relatorio/auditoria/${searchObra}/${searchData}`)}
                                className="bg-gray-200 text-gray-600 px-4 py-2 shadow font-bold flex items-center gap-2 hover:brightness-75 disabled:cursor-not-allowed">
                                <FaPrint />
                                <span>Imprimir</span>
                            </button>
                             */}

                        </div>
                    </div>


                </div >
                <div className='mt-8 text-end px-4 py-2 flex flex-col flex-1 mx-auto bg-white rounded overflow-x-auto overflow-hide-scroll-bar'>
                    <span className='font-semibold text-lg'>Relatório de {filtroPorMovimentacoes ? 'devoluções' : 'saídas'}</span>
                    {
                        ((searchData || searchObra) && !findedAuditoria.length) ? <span className="p-4 block font-bold text-center">... Movimentação não registrada/encontrada</span> :
                            filtroPorMovimentacoes ? (
                                <table className='table w-full text-center mt-2 animate__animated animate__fadeIn'>
                                    <thead>
                                        <tr className='flex justify-between bg-gray-200 px-4 py-2 rounded'>
                                            <th className='text-gray-600 font-bold w-16 text-center'>ID</th>
                                            <th className='text-gray-600 font-bold w-72 text-center '>Descrição</th>
                                            <th className='text-gray-600 font-bold w-52 text-center'>Obra</th>
                                            <th className='text-gray-600 font-bold w-20 text-center'>Qtd. levada</th>
                                            <th className='text-gray-600 font-bold w-20 text-center'>Qtd. devolvida</th>
                                            <th className='text-gray-600 font-bold w-44 text-center'>Data de aquisição</th>
                                            <th className='text-gray-600 font-bold w-40 text-center'>Estado</th>
                                            <th className='text-gray-600 font-bold w-44 text-center'>Data devolução</th>
                                            {/**
                                         *     <th className='text-gray-600 font-bold w-1/5 text-center'>Editar</th>
                                            <th className='text-gray-600 font-bold w-1/5 text-center'>Apagar</th>
                                         */}
                                        </tr>
                                    </thead>
                                    <tbody className=''>

                                        {

                                            auditoria && auditoria.length && !findedAuditoria.length ? currentPageData?.map((devolucao, index) => {
                                                if (devolucao.data_devolucao) {
                                                    return (
                                                        <tr key={index}
                                                            className='flex justify-between border shadow-md mt-4 px-4 py-2'>
                                                            <td className="w-16 text-center">{devolucao.id}</td>
                                                            <td className="w-72 text-center">{devolucao.equipamento_id.descricao}</td>
                                                            <td className="w-52 text-center">{devolucao.obra_id.obra_nome}</td>
                                                            <td className="w-20 text-center">{devolucao.quantidade_retirada}</td>
                                                            <td className="w-20 text-center">{devolucao.quantidade_devolvida === 0 ? 'N/D' : devolucao.quantidade_devolvida}</td>
                                                            <td className="w-44 text-center">{devolucao.data_retirada}</td>
                                                            <td className="w-40 text-center">{devolucao.estado}</td>
                                                            <td className="w-44 text-center">{devolucao.data_devolucao ?? 'N/D'}</td>
                                                            {/**    
                                                        *  <td className="w-1/5 text-center flex justify-center items-center">
                                                                <button
                                                                    onClick={() => handleEdit(devolucao)}
                                                                    className="hover:brightness-75"
                                                                    title="Editar">
                                                                    <FaEdit />
                                                                </button>
                                                            </td>

                                                        *   <td className="w-1/5  flex justify-center items-center">
                                                                <button
                                                                    onClick={() => setShowQuestionAlert(true)}
                                                                    className="hover:brightness-75"
                                                                    title="Apagar">
                                                                    <FaTrash />
                                                                </button>
                                                            </td>
                                                        */}
                                                        </tr>
                                                    )
                                                }
                                            }) : currentFilteredData?.map((findAud, index) => {
                                                if (findAud.quantidade_devolvida) {
                                                    return (<tr key={index}
                                                        className='flex justify-between border shadow-md mt-4 px-4 py-2'>
                                                        <td className="w-16 text-center ">{findAud.id}</td>
                                                        <td className="w-72 text-center ">{findAud.equipamento_id.descricao}</td>
                                                        <td className="w-52 text-center ">{findAud.obra_id.obra_nome}</td>
                                                        <td className="w-20 text-center ">{findAud.quantidade_retirada}</td>
                                                        <td className="w-20 text-center ">{findAud.quantidade_devolvida === 0 ? 'N/D' : findAud.quantidade_devolvida}</td>
                                                        <td className="w-44 text-center ">{findAud.data_retirada}</td>
                                                        <td className="w-40 text-center ">{findAud.estado}</td>
                                                        <td className="w-44 text-center ">{findAud.data_devolucao ?? 'N/D'}</td>
                                                        {
                                                            /**      
                                                            * <td className="w-1/5 text-center  flex justify-center items-center">
                                                                    <button
                                                                        onClick={() => handleEdit(findAud)}
                                                                        className="hover:brightness-75"
                                                                        title="Editar">
                                                                        <FaEdit />
                                                                    </button>
                                                              </td>
         
                                                            * <td className="w-1/5  flex justify-center items-center">
                                                                    <button
                                                                        onClick={() => setShowQuestionAlert(true)}
                                                                        className="hover:brightness-75"
                                                                        title="Apagar">
                                                                        <FaTrash />
                                                                    </button>
                                                              </td>
                                                        */
                                                        }
                                                    </tr>)
                                                }
                                            })
                                        }
                                    </tbody>
                                </table>
                            ) : (
                                <table className='table w-full text-center mt-2 animate__animated animate__fadeIn'>
                                    <thead>
                                        <tr className='flex justify-between bg-gray-200 px-4 py-2 rounded'>
                                            <th className='text-gray-600 font-bold w-16'>ID</th>
                                            <th className='text-gray-600 font-bold w-72'>Descrição</th>
                                            <th className='text-gray-600 font-bold w-52'>Obra</th>
                                            <th className='text-gray-600 font-bold w-20'>Qtd. tirada</th>
                                            <th className='text-gray-600 font-bold w-20 '>Estado</th>
                                            <th className='text-gray-600 font-bold w-40 '>Data de saída</th>

                                            <th className='text-gray-600 font-bold  w-20'>Editar</th>
                                            {/**
                                             * <th className='text-gray-600 font-bold w-1/4 '>Data de Compra</th>
                                            <th className='text-gray-600 font-bold w-1/4 '>Apagar</th>
                                            */}
                                        </tr>
                                    </thead>
                                    <tbody className=''>
                                        {auditoria && auditoria.length && !findedAuditoria.length ? currentPageData?.map((saida, index) => (
                                            <tr
                                                key={index}
                                                className='flex justify-between border shadow-md mt-4 px-4 py-2'>
                                                <td className="w-16  ">{saida.id}</td>
                                                <td className="w-72  ">{saida.equipamento_id.descricao}</td>
                                                <td className="w-52  ">{saida.obra_id.obra_nome}</td>
                                                <td className="w-20  ">{saida.quantidade_retirada}</td>
                                                <td className="w-20  ">{saida.estado}</td>
                                                <td className="w-40  ">{saida.data_retirada}</td>
                                                <td className="w-20   flex justify-center items-center">
                                                    <button
                                                        onClick={() => handleEdit(saida)}
                                                        className="hover:brightness-75"
                                                        title="Editar saída">
                                                        <FaEdit />
                                                    </button>
                                                </td>
                                                {/**
                                                *  
                                                * <td className="w-1/4  ">22-08-2022</td>
                                                * 
                                                <td className="w-1/4   flex justify-center items-center">
                                                    <button
                                                        onClick={() => setShowQuestionAlert(true)}
                                                        className="hover:brightness-75"
                                                        title="Apagar">
                                                        <FaTrash />
                                                    </button>
                                                </td>
                                                */}
                                            </tr>
                                        )) : currentFilteredData?.map((findAud, index) => (
                                            <tr key={index}
                                                className='flex justify-between border shadow-md mt-4 px-4 py-2'>
                                                <td className="w-16">{findAud.id}</td>
                                                <td className="w-72">{findAud.equipamento_id.descricao}</td>
                                                <td className="w-52">{findAud.obra_id.obra_nome}</td>
                                                <td className="w-20">{findAud.quantidade_retirada}</td>
                                                <td className="w-20">{findAud.estado}</td>
                                                <td className="w-40">{findAud.data_retirada}</td>
                                                <td className="w-20 flex justify-center items-center">
                                                    <button
                                                        onClick={() => handleEdit(findAud)}
                                                        className="hover:brightness-75"
                                                        title="Editar saída">
                                                        <FaEdit />
                                                    </button>
                                                </td>
                                                {/**
                                                 *    <td className="w-1/4  ">{findAud.data_devolucao ?? 'N/D'}</td>
                                                *  
                                                <td className="w-1/4   flex justify-center items-center">
                                                    <button
                                                        onClick={() => setShowQuestionAlert(true)}
                                                        className="hover:brightness-75"
                                                        title="Apagar">
                                                        <FaTrash />
                                                    </button>
                                                </td>
                                                */}
                                            </tr>
                                        ))
                                        }



                                    </tbody>
                                </table>
                            )
                    }
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

            </main >
        </div >
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

export default Saida
