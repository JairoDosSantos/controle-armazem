import { GetServerSideProps, GetServerSidePropsContext } from "next"
import dynamic from "next/dynamic"
import Head from "next/head"
import { useRouter } from "next/router"
import { useState } from "react"

import Header from "../components/Header"
import SiderBar from "../components/SiderBar"

import { FaEdit } from 'react-icons/fa'

//import Load from '../assets/load.gif'
import EditarModal from "../components/compras/EditarModal"


import AES from 'crypto-js/aes'
//import { enc } from 'crypto-js';

import nookies from 'nookies'
import ReactPaginate from 'react-paginate'
import { fetchClassificacao } from "../redux/slices/classificacaoSlice"
import { fetchCompra } from "../redux/slices/compraSlice"
import { fetchDuracao } from "../redux/slices/duracaoSlice.ts"
import { wrapper } from "../redux/store"
const LinkDonwloadExtratoDeCarregamentoDeCartao = dynamic(() => import("../components/relatorios/Compras"), { ssr: false })
const SweetAlert2 = dynamic(() => import('react-sweetalert2'), { ssr: false })

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
    quantidade_comprada: number;
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

type CompraProps = {
    compras: CompraType[];
    classificacao: ClassificacaoType[];
    duracao: DuracaoType[]
}

const Devolucoes = ({ compras, classificacao, duracao }: CompraProps) => {

    //const [load, setLoad] = useState(false)
    const [currentPage, setCurrentPage] = useState(0);
    const PER_PAGE = 3;
    const offset = currentPage * PER_PAGE;
    let pageCount = 1;

    let currentPageData: CompraType[] = []
    let currentFilteredData: CompraType[] = []

    const [filtroTipo, setFiltroTipo] = useState(false)
    const route = useRouter()
    //Estados dos sweetAlerts
    const [showConfirmAlert, setShowConfirmAlert] = useState(false)
    const [showErrorAlert, setShowErrorAlert] = useState(false)
    const [showQuestionAlert, setShowQuestionAlert] = useState(false)
    const [searchByEquipamento, setSearchByEquipamento] = useState('')
    const [searchByDate, setSearchByDate] = useState('')

    const [showEditModal, setShowEditModal] = useState(false)
    const [compraObject, setCompraObject] = useState<CompraType>({} as CompraType)


    /**
     * 
     * @param id 
     * @returns 
     */
    const findDuracao = (id: number) => {
        const duration = (duracao && duracao.length) ? duracao.find((dur) => (dur.id === id)) : []
        return duration as DuracaoType
    }
    /**
     * 
     * @param id 
     * @returns 
     */
    const findClassificacao = (id: number) => {

        const classification = (classificacao && classificacao.length) ?
            classificacao.
                find((classific) => (classific.id === id))
            : []

        return classification as ClassificacaoType
    }

    let findedCompras: CompraType[] = []

    if (compras.length && filtroTipo) {

        if (searchByEquipamento && searchByDate === '') findedCompras = compras.
            filter((compra) => compra.equipamento_id.descricao.toLowerCase().includes(searchByEquipamento.toLowerCase()))

        else if (searchByEquipamento === '' && searchByDate) findedCompras = compras.
            filter((compra) => compra.data_compra.toLowerCase().includes(searchByDate.toLowerCase()))

        else findedCompras = compras.
            filter((compra) => compra.equipamento_id.descricao.toLowerCase().includes(searchByEquipamento.toLowerCase()) &&
                compra.data_compra.toLowerCase().includes(searchByDate.toLowerCase()))
    }


    if (findedCompras.length) {
        currentFilteredData = findedCompras
            .slice(offset, offset + PER_PAGE)

        pageCount = Math.ceil(findedCompras.length / PER_PAGE);
    } else {
        currentPageData = compras
            .slice(offset, offset + PER_PAGE)

        pageCount = Math.ceil(compras.length / PER_PAGE);
    }

    /**
     * @param compra 
     */

    const handleEdit = (compra: CompraType) => {

        setCompraObject(compra)
        setShowEditModal(true)
    }


    const encriptSTR = (params: string) => {

        const encriptedParams = AES.encrypt(params, 'AES-256-CBC').toString()

        return encodeURIComponent(encriptedParams)

    }

    function handlePageClick({ selected: selectedPage }: any) {
        setCurrentPage(selectedPage);
    }

    const toPrint = findedCompras.length ? findedCompras : compras

    return (
        <div className='flex overflow-x-hidden'>
            {/**    <RelatorioCompras compras={compras} /> */}

            <SiderBar itemActive="devolucoes" />
            <main className='flex-1 space-y-6 max-h-screen overflow-hide-scroll-bar overflow-x-hidden'>
                <div>
                    <Header />
                </div>
                <Head>
                    <title>SCA | Compras</title>
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
                    text='Ocorreu um erro ao efectuar a operação. Por favor, 
                    verifique se o fornecedor já não está cadastrado no sistema!'
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
                {
                    showEditModal && <EditarModal compraData={compraObject} isOpen={showEditModal} setIsOpen={setShowEditModal}
                    />
                }
                <div className='overflow-y-auto max-h-[85vh] max-w-4xl mx-auto'>
                    <div className="bg-white shadow max-w-6xl mx-auto flex flex-col space-y-6 p-6 
                    rounded mt-5 animate__animated animate__fadeIn">
                        <h2 className=" h-5 text-2xl font-semibold">Compras de Equipamentos</h2>
                        <div className="border w-1/5 border-gray-700 ml-4"></div>
                        <div className="flex justify-end items-center gap-2 -mt-4">
                            <div>
                                <label htmlFor="ferramenta" className="bg-white">Todas&nbsp;</label>
                                <input
                                    defaultChecked={true}
                                    onClick={() => setFiltroTipo(false)}
                                    type={"radio"}
                                    name='classificacao'
                                    id='ferramenta'
                                    className="cursor-pointer" />
                            </div>
                            <div>
                                <label htmlFor="material" className="bg-white">Por eq. / data&nbsp;</label>
                                <input
                                    onClick={() => setFiltroTipo(true)}
                                    type={"radio"}
                                    name='classificacao'
                                    id='material'
                                    className="cursor-pointer" />
                            </div>
                        </div>
                        <div className="flex gap-5">

                            {
                                filtroTipo && (
                                    <div className="flex flex-col lg:flex-row gap-2 w-full">
                                        <input
                                            onChange={(event) => setSearchByEquipamento(event.target.value)}
                                            className="rounded shadow w-full lg:w-1/2 animate__animated animate__fadeIn"
                                            type={"search"}
                                            placeholder='Descrição do equipamento'
                                        />
                                        <input
                                            onChange={(event) => setSearchByDate(event.target.value)}
                                            type="date"
                                            className="rounded shadow w-full lg:w-1/2 animate__animated animate__fadeIn"
                                        />
                                    </div>
                                )
                            }
                        </div>
                        <div className=" flex justify-end gap-2">

                            <LinkDonwloadExtratoDeCarregamentoDeCartao
                                compras={toPrint}
                                legenda={(searchByEquipamento.length || searchByDate.length) ? 'Imprimir' : 'Imprimir Tudo'} />

                        </div>
                    </div>

                </div>

                {/** Relatório- tabela de compras */}
                <div className=' mt-8 text-end px-4 pt-4 pb-2 mx-auto flex flex-col flex-1 bg-white rounded overflow-x-auto 
                overflow-hide-scroll-bar'>

                    <table className='table w-full text-center mt-2 animate__animated animate__fadeIn'>
                        <thead>
                            <tr className='flex justify-between items-center bg-gray-200 px-4 py-2 rounded'>
                                <th className='text-gray-600 font-bold w-16 '>ID</th>
                                <th className='text-gray-600 font-bold w-72  '>Descrição</th>
                                <th className='text-gray-600 font-bold w-52 '>Classificação</th>
                                <th className='text-gray-600 font-bold w-52 '>Duração</th>
                                <th className='text-gray-600 font-bold w-40 '>Qtd. comprada</th>
                                <th className='text-gray-600 font-bold w-40 '>Estado</th>
                                <th className='text-gray-600 font-bold w-40 '>Preço</th>
                                <th className='text-gray-600 font-bold w-44 '>Data de compra</th>
                                <th className='text-gray-600 font-bold w-16 '>Editar</th>
                                {/**
                                     *  <th className='text-gray-600 font-bold w-1/4 '>Apagar</th>
                                */}
                            </tr>
                        </thead>
                        <tbody className=''>
                            {
                                ((searchByEquipamento || searchByDate) && !findedCompras.length) ? <tr>
                                    <td className="w-full text-center py-6 font-bold ">... Compra não encontrada</td>
                                </tr> :

                                    compras && compras.length && !findedCompras.length ? currentPageData?.map((compra, index) => (
                                        <tr
                                            key={index}
                                            className='flex justify-between items-center border shadow-md mt-4 px-4 py-2'>
                                            <td className="w-16">{compra.id}</td>
                                            <td className="w-72">{compra.equipamento_id.descricao}</td>
                                            <td className="w-52">
                                                {findClassificacao(compra.equipamento_id.classificacao_id).tipo}
                                            </td>
                                            <td className="w-52">{findDuracao(compra.equipamento_id.duracao_id).tempo}</td>
                                            <td className="w-40">{compra.quantidade_comprada}</td>
                                            <td className="w-40">{compra.estado}</td>
                                            <td className="w-40">{compra.preco.toLocaleString('pt', {
                                                style: 'currency',
                                                currency: 'KWZ'
                                            })}</td>
                                            <td className="w-44">{compra.data_compra}</td>
                                            <td className="w-16 flex justify-center items-center">
                                                <button
                                                    onClick={() => handleEdit(compra)}
                                                    className="hover:brightness-75"
                                                    title="Editar">
                                                    <FaEdit />
                                                </button>
                                            </td>
                                            {
                                                /**
                                                 * 
                                                   <td className="w-1/4   flex justify-center items-center">
                                                        <button
                                                            onClick={() => setShowQuestionAlert(true)}
                                                            className="hover:brightness-75"
                                                            title="Apagar">
                                                            <FaTrash />
                                                        </button>
                                                    </td>
                                                */
                                            }
                                        </tr>
                                    )) : currentFilteredData?.map((compra, index) => (
                                        <tr
                                            key={index}
                                            className='flex justify-between items-center border shadow-md mt-4 px-4 py-2'>
                                            <td className="w-16  ">{compra.id}</td>
                                            <td className="w-72  ">{compra.equipamento_id.descricao}</td>
                                            <td className="w-52  ">
                                                {findClassificacao(compra.equipamento_id.classificacao_id).tipo}
                                            </td>
                                            <td className="w-52  ">{findDuracao(compra.equipamento_id.duracao_id).tempo}</td>
                                            <td className="w-40  ">{compra.quantidade_comprada}</td>
                                            <td className="w-40  ">{compra.estado}</td>
                                            <td className="w-40  ">{compra.preco.toLocaleString('pt', {
                                                style: 'currency',
                                                currency: 'KWZ'
                                            })}</td>
                                            <td className="w-44  ">{compra.data_compra}</td>
                                            <td className="w-16   flex justify-center items-center">
                                                <button
                                                    onClick={() => handleEdit(compra)}
                                                    className="hover:brightness-75"
                                                    title="Editar">
                                                    <FaEdit />
                                                </button>
                                            </td>
                                            {/**
                                            *     <td className="w-1/4   flex justify-center items-center">
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
            const compraDispatch: any = await store.dispatch(fetchCompra());

            const classificacaoDispatch: any = await store.dispatch(fetchClassificacao());
            const duracaoDispatch: any = await store.dispatch(fetchDuracao());

            const compras = compraDispatch.payload
            const classificacao = classificacaoDispatch.payload
            const duracao = duracaoDispatch.payload

            if (!cookie.USER_LOGGED_ARMAZEM) return { props: {}, redirect: { destination: '/', permanent: false } }
            return {
                props: {
                    compras,
                    classificacao,
                    duracao
                },
            };
        }
);

export default Devolucoes
