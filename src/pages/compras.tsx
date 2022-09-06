import { useState } from "react"
import Head from "next/head"

import Header from "../components/Header"
import SiderBar from "../components/SiderBar"

import { FaPrint } from 'react-icons/fa'

import Load from '../assets/load.gif'
import EditarModal from "../components/equipamento/EditModal"
import Image from "next/image"

import dynamic from "next/dynamic"
import { GetServerSideProps, GetServerSidePropsContext } from "next"
import { wrapper } from "../redux/store"
import { fetchCompra } from "../redux/slices/compraSlice"
import { fetchClassificacao } from "../redux/slices/classificacaoSlice"
import { fetchDuracao } from "../redux/slices/duracaoSlice.ts"
import nookies from 'nookies'

const SweetAlert2 = dynamic(() => import('react-sweetalert2'), { ssr: false })

//const ComprasReport = dynamic(() => import('../components/relatorios/ComprasReport'), { ssr: false })


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
    quantidade_comprada: number
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

    const [hideSideBar, setHideSideBar] = useState(false)
    const [load, setLoad] = useState(false)

    const [filtroTipo, setFiltroTipo] = useState(false)

    //Estados dos sweetAlerts
    const [showConfirmAlert, setShowConfirmAlert] = useState(false)
    const [showErrorAlert, setShowErrorAlert] = useState(false)
    const [showQuestionAlert, setShowQuestionAlert] = useState(false)
    const [searchByEquipamento, setSearchByEquipamento] = useState('')
    const [searchByDate, setSearchByDate] = useState('')

    const [showEditModal, setShowEditModal] = useState(false)

    const findDuracao = (id: number) => {
        const duration = (duracao && duracao.length) ? duracao.find((dur) => (dur.id === id)) : []

        return duration as DuracaoType
    }

    const findClassificacao = (id: number) => {
        const classification = (classificacao && classificacao.length) ? classificacao.find((classific) => (classific.id === id)) : []
        return classification as ClassificacaoType
    }
    let findedCompras: CompraType[] = []
    if (compras.length && filtroTipo) {
        if (searchByEquipamento && searchByDate === '') findedCompras = compras.filter((compra) => compra.equipamento_id.descricao.toLowerCase().includes(searchByEquipamento.toLowerCase()))
        else if (searchByEquipamento === '' && searchByDate) findedCompras = compras.filter((compra) => compra.data_compra.toLowerCase().includes(searchByDate.toLowerCase()))
        else findedCompras = compras.filter((compra) => compra.equipamento_id.descricao.toLowerCase().includes(searchByEquipamento.toLowerCase()) && compra.data_compra.toLowerCase().includes(searchByDate.toLowerCase()))
    }

    return (
        <div className='flex'>
            <SiderBar itemActive="devolucoes" hideSideBar={hideSideBar} />
            <main className='flex-1 space-y-6'>
                <div>
                    <Header hideSideBar={hideSideBar} setHideSideBar={setHideSideBar} />
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
                {
                    //showEditModal && <EditarModal isOpen={showEditModal} setIsOpen={setShowEditModal} />
                }

                <div className='overflow-auto max-h-[85vh] max-w-4xl mx-auto overflow-hide-scroll-bar'>

                    <div className="bg-white shadow max-w-6xl mx-auto flex flex-col space-y-6 p-6 rounded mt-5 animate__animated animate__fadeIn">
                        <h2 className=" h-5 text-2xl font-semibold">Compras de Eq. do Armazem geral</h2>
                        <div className="border w-1/4 border-gray-700 ml-4"></div>
                        <div className="ml-auto flex gap-2 -mt-4">
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
                                    <>
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
                                    </>
                                )
                            }
                        </div>
                        <div className=" ml-auto flex gap-2">
                            <button className="bg-gray-700 text-white px-4 py-2 shadow font-bold flex items-center gap-2 hover:brightness-75">
                                <FaPrint />
                                <span>Imprimir tudo</span>
                            </button>
                            <button className="bg-gray-200 text-gray-600 px-4 py-2 shadow font-bold flex items-center gap-2 hover:brightness-75">
                                <FaPrint />
                                <span>Imprimir</span>
                            </button>
                        </div>
                    </div>

                    <div className='mt-8 text-end px-4 py-2 max-w-6xl  mx-auto bg-white rounded'>
                        <span className='font-semibold text-lg'>Relatório de Compras</span>
                        <table className='table w-full text-center mt-2 animate__animated animate__fadeIn'>
                            <thead>
                                <tr className='flex justify-between items-center bg-gray-200 px-4 py-2 rounded'>
                                    <th className='text-gray-600 font-bold w-1/4 '>ID</th>
                                    <th className='text-gray-600 font-bold w-1/4  '>Descrição</th>
                                    <th className='text-gray-600 font-bold w-1/4 '>Classificação</th>
                                    <th className='text-gray-600 font-bold w-1/4 '>Duração</th>
                                    <th className='text-gray-600 font-bold w-1/4 '>Qtd. comprada</th>
                                    <th className='text-gray-600 font-bold w-1/4 '>Preço</th>
                                    <th className='text-gray-600 font-bold w-1/4 '>Data de compra</th>
                                    {/**
                             *         <th className='text-gray-600 font-bold w-1/4 '>Editar</th>
                                    <th className='text-gray-600 font-bold w-1/4 '>Apagar</th>
                             */}
                                </tr>
                            </thead>
                            <tbody className=''>
                                {
                                    compras && compras.length && !findedCompras.length ? compras.map((compra, index) => (
                                        <tr
                                            key={index}
                                            className='flex justify-between items-center border shadow-md mt-4 px-4 py-2'>
                                            <td className="w-1/4  ">{compra.id}</td>
                                            <td className="w-1/4  ">{compra.equipamento_id.descricao}</td>
                                            <td className="w-1/4  ">{findClassificacao(compra.equipamento_id.classificacao_id).tipo}</td>
                                            <td className="w-1/4  ">{findDuracao(compra.equipamento_id.duracao_id).tempo}</td>
                                            <td className="w-1/4  ">{compra.quantidade_comprada}</td>
                                            <td className="w-1/4  ">{compra.preco}</td>
                                            <td className="w-1/4  ">{compra.data_compra}</td>
                                            {/**
                                             * <td className="w-1/4   flex justify-center items-center">
                                                <button
                                                    onClick={() => setShowEditModal(true)}
                                                    className="hover:brightness-75"
                                                    title="Editar">
                                                    <FaEdit />
                                                </button>
                                            </td>
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
                                    )) : findedCompras.map((compra, index) => (
                                        <tr
                                            key={index}
                                            className='flex justify-between items-center border shadow-md mt-4 px-4 py-2'>
                                            <td className="w-1/4  ">{compra.id}</td>
                                            <td className="w-1/4  ">{compra.equipamento_id.descricao}</td>
                                            <td className="w-1/4  ">{findClassificacao(compra.equipamento_id.classificacao_id).tipo}</td>
                                            <td className="w-1/4  ">{findDuracao(compra.equipamento_id.duracao_id).tempo}</td>
                                            <td className="w-1/4  ">{compra.quantidade_comprada}</td>
                                            <td className="w-1/4  ">{compra.preco.toLocaleString('pt', {
                                                style: 'currency',
                                                currency: 'KWZ'
                                            })}</td>
                                            <td className="w-1/4  ">{compra.data_compra}</td>
                                            {/**
                                            *  <td className="w-1/4   flex justify-center items-center">
                                                <button
                                                    onClick={() => setShowEditModal(true)}
                                                    className="hover:brightness-75"
                                                    title="Editar">
                                                    <FaEdit />
                                                </button>
                                            </td>
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
                    </div>
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

            if (!cookie.USER_LOGGED_ARMAZEM) {
                // If no user, redirect to index.
                return { props: {}, redirect: { destination: '/', permanent: false } }
            }
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
