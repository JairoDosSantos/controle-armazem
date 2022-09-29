import { useState } from "react"
import Head from "next/head"

import Header from "../components/Header"
import SiderBar from "../components/SiderBar"

import { FaEdit, FaTrash, FaPrint } from 'react-icons/fa'
import nookies from 'nookies'
//Imagens
//import Load from '../assets/load.gif'
//import Image from "next/image"
import dynamic from "next/dynamic"
import EditarModalPorObra from "../components/equipamento/EditarModalPorObra"
import { GetServerSideProps, GetServerSidePropsContext } from "next"
import { wrapper } from "../redux/store"
import { fetchDuracao } from "../redux/slices/duracaoSlice.ts"
import { fetchClassificacao } from "../redux/slices/classificacaoSlice"
import { fetchAlmoxarifario } from "../redux/slices/almoxarifarioSlice"
import { fetchObra } from "../redux/slices/obraSlice"
import { useRouter } from "next/router"

const SweetAlert2 = dynamic(() => import('react-sweetalert2'), { ssr: false })

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
type PosicaoObraProps = {
    almoxarifarios: Almoxarifario[];
    classificacao: ClassificacaoType[];
    duracao: DuracaoType[];
    obras: ObraType[]
}

const PosicaoObra = ({ almoxarifarios, classificacao, duracao, obras }: PosicaoObraProps) => {

    const [hideSideBar, setHideSideBar] = useState(false)
    const [load, setLoad] = useState(false)
    const route = useRouter()

    //Estados dos sweetAlerts
    const [showConfirmAlert, setShowConfirmAlert] = useState(false)
    const [showErrorAlert, setShowErrorAlert] = useState(false)
    const [showQuestionAlert, setShowQuestionAlert] = useState(false)
    const [search, setSearch] = useState('')
    const [searchByObraId, setSearchByObraId] = useState(0)
    const [searchClassificacao, setSearchClassificacao] = useState(0)

    const [showEditModal, setShowEditModal] = useState(false)
    const [almoxarifarioObject, setAlmoxarifarioObject] = useState({} as Almoxarifario)
    const findDuracao = (id: number) => {
        const duration = (duracao && duracao.length) ? duracao.find((dur) => (dur.id === id)) : []

        return duration as DuracaoType
    }

    const findClassificacao = (id: number) => {
        const classification = (classificacao && classificacao.length) ? classificacao.find((classific) => (classific.id === id)) : []
        return classification as ClassificacaoType
    }

    let findedEquipamento: Almoxarifario[] = []


    if (almoxarifarios) {
        if (search && searchByObraId === 0 && searchClassificacao === 0) {

            findedEquipamento = almoxarifarios.filter((almoxarifario) => almoxarifario.equipamento_id.descricao.toLowerCase().includes(search.toLowerCase()))
        }
        else if

            (searchClassificacao !== 0 && search === '' && searchByObraId === 0) {
            findedEquipamento = almoxarifarios.filter((almoxarifario) => almoxarifario.equipamento_id.classificacao_id === searchClassificacao)
        }

        else if (searchByObraId !== 0 && search === '' && searchClassificacao === 0) {
            findedEquipamento = almoxarifarios.filter((almoxarifario) => almoxarifario.obra_id.id === searchByObraId)
        }
        else if (searchByObraId !== 0 && search && searchClassificacao === 0) {
            findedEquipamento = almoxarifarios.filter((almoxarifario) => almoxarifario.obra_id.id === searchByObraId && almoxarifario.equipamento_id.descricao.toLowerCase().includes(search.toLowerCase()))
        }
        else if

            (searchClassificacao !== 0 && search && searchByObraId === 0) {
            findedEquipamento = almoxarifarios.filter((almoxarifario) => almoxarifario.equipamento_id.classificacao_id === searchClassificacao && almoxarifario.equipamento_id.descricao.toLowerCase().includes(search.toLowerCase()))
        }
        else { findedEquipamento = almoxarifarios.filter((almoxarifario) => almoxarifario.equipamento_id.descricao.toLowerCase().includes(search.toLowerCase()) && almoxarifario.obra_id.id === (searchByObraId) && almoxarifario.equipamento_id.classificacao_id === searchClassificacao) }

    }
    const handleEdit = (equipamentoObra: Almoxarifario) => {
        setAlmoxarifarioObject(equipamentoObra)
        setShowEditModal(true)
    }

    return (
        <div className='flex'>
            <SiderBar itemActive="posicao-obra" />
            <main className='flex-1 space-y-6 max-h-screen overflow-hide-scroll-bar overflow-x-hidden'>
                <div>
                    <Header />
                </div>

                <Head>
                    <title>SCA | Posição em obras</title>
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
                    {showEditModal && <EditarModalPorObra data={almoxarifarioObject} isOpen={showEditModal} setIsOpen={setShowEditModal} />}
                    <div className="bg-white shadow max-w-6xl mx-auto flex flex-col space-y-6 p-6 rounded mt-5 animate__animated animate__fadeIn">
                        <h2 className="divide-x-2 h-5 text-2xl font-semibold">Posição Armazem por obra</h2>
                        <div className="border w-1/5 border-gray-700 ml-4"></div>
                        <div className="lg:ml-auto flex gap-2 -mt-4">


                            <select
                                onChange={(event) => setSearchClassificacao(Number(event.target.value))}
                                className="rounded shadow cursor-pointer w-full" >
                                <option value={0}>Selecione a classificação</option>
                                {
                                    (classificacao && classificacao.length) && classificacao.map((classific, index) => (
                                        <option
                                            key={index}
                                            value={classific.id}> {classific.tipo}</option>
                                    ))}
                            </select>


                        </div>
                        <div className="flex flex-col lg:flex-row gap-5">
                            <input
                                onChange={(event) => setSearch(event.target.value)}
                                type="search"
                                placeholder="Pesquise pelo equipamento"
                                className="lg:w-1/2 w-full rounded shadow" />
                            {/** Lista apenas na tabela se no mínimo uma obra for selecionada, caso contrário a tabela deve ser vazia */}
                            <select
                                onChange={(event) => setSearchByObraId(Number(event.target.value))}
                                id="obra"
                                className="lg:w-1/2 w-full rounded shadow cursor-pointer">
                                <option value={0}>Selecione a obra</option>
                                {
                                    (obras && obras.length) && obras.map((obr, index) => (
                                        <option
                                            key={index}
                                            value={obr.id}>{obr.obra_nome}</option>
                                    ))
                                }
                            </select>
                        </div>

                        <div className=" ml-auto flex gap-2">
                            <button
                                onClick={() => route.push('/relatorio/almoxarifado/all')}
                                className="bg-gray-700 text-white px-4 py-2 shadow font-bold flex items-center gap-2 hover:brightness-75">
                                <FaPrint />
                                <span>Imprimir tudo</span>
                            </button>
                            <button
                                disabled={!(search || searchByObraId || searchClassificacao)}
                                onClick={() => route.push(`/relatorio/almoxarifado/${search === '' ? 'equipamento' : search}/${searchByObraId}/${searchClassificacao}`)}
                                className="bg-gray-200 text-gray-600 px-4 py-2 shadow font-bold flex items-center gap-2 hover:brightness-75 disabled:cursor-not-allowed">
                                <FaPrint />
                                <span>Imprimir</span>
                            </button>
                        </div>
                    </div>


                </div>
                <div className='mt-8 text-end px-4 py-2 max-w-sm lg:max-w-6xl mx-auto bg-white rounded overflow-x-auto overflow-hide-scroll-bar'>
                    <span className='font-semibold text-lg '>Relatório almoxarifário</span>
                    <table className='table w-full text-center mt-2 animate__animated animate__fadeIn'>
                        <thead>

                            <tr className='flex justify-between bg-gray-200 px-4 py-2 rounded'>
                                <th className='text-gray-600 font-bold w-16'>ID</th>
                                <th className='text-gray-600 font-bold w-72 '>Descrição</th>
                                <th className='text-gray-600 font-bold w-52'>Classificação</th>
                                <th className='text-gray-600 font-bold w-42'>Duração</th>
                                <th className='text-gray-600 font-bold w-20'>Qtd</th>
                                <th className='text-gray-600 font-bold w-52'>Obra</th>
                                <th className='text-gray-600 font-bold w-40'>Estado</th>
                                {/**<th className='text-gray-600 font-bold w-1/5'>Data de Compra</th> */}
                                {/**  <th className='text-gray-600 font-bold w-1/5'>Editar</th>
                                    <th className='text-gray-600 font-bold w-1/5'>Apagar</th> */}
                            </tr>
                        </thead>
                        <tbody className=''>
                            {
                                (almoxarifarios && almoxarifarios.length && search === '' && searchByObraId === 0 && searchClassificacao === 0) ? almoxarifarios.map((almoxarifario, index) => (
                                    <tr
                                        key={index}
                                        className='flex justify-between border shadow-md mt-4 px-4 py-2'>
                                        <td className="w-16 ">{almoxarifario.id}</td>
                                        <td className="w-72 ">{almoxarifario.equipamento_id.descricao}</td>

                                        <td className="w-52"> {findClassificacao(almoxarifario.equipamento_id.classificacao_id).tipo} </td>

                                        <td className="w-42 "> {findDuracao(almoxarifario.equipamento_id.duracao_id).tempo} </td>
                                        <td className="w-20 ">{almoxarifario.quantidade}</td>
                                        <td className="w-52 ">{almoxarifario.obra_id.obra_nome}</td>
                                        <td className="w-40 ">{almoxarifario.estado}</td>
                                        {/**   <td className="w-1/5 ">22-08-2022</td> */}
                                        {/**
                                             *    <td className="w-1/5  flex justify-center items-center">
                                                <button onClick={() => handleEdit(almoxarifario)} className="hover:brightness-75" title="Editar">
                                                    <FaEdit />
                                                </button>
                                            </td>
                                           <td className="w-1/5  flex justify-center items-center">
                                                    <button
                                                        onClick={() => setShowQuestionAlert(true)}
                                                        className="hover:brightness-75"
                                                        title="Apagar">
                                                        <FaTrash />
                                                    </button>
                                                </td>
                                             */}
                                    </tr>
                                )) : findedEquipamento.map((finded, index) => (
                                    <tr
                                        key={index}
                                        className='flex justify-between border shadow-md mt-4 px-4 py-2'>
                                        <td className="w-16 ">{finded.id}</td>
                                        <td className="w-72 ">{finded.equipamento_id.descricao}</td>

                                        <td className="w-52"> {findClassificacao(finded.equipamento_id.classificacao_id).tipo} </td>

                                        <td className="w-52 "> {findDuracao(finded.equipamento_id.duracao_id).tempo} </td>
                                        <td className="w-20 ">{finded.quantidade}</td>
                                        <td className="w-52 ">{finded.obra_id.obra_nome}</td>
                                        <td className="w-40 ">{finded.estado}</td>
                                        {/**   <td className="w-1/5 ">22-08-2022</td> */}
                                        {/**
                                            *  <td className="w-1/5  flex justify-center items-center">
                                                <button onClick={() => handleEdit(finded)} className="hover:brightness-75" title="Editar">
                                                    <FaEdit />
                                                </button>
                                            </td>
                                             <td className="w-1/5  flex justify-center items-center">
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

            </main >
        </div >
    )
}
export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(
    (store) =>
        async (context: GetServerSidePropsContext) => {

            const cookie = nookies.get(context);

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
            if (!cookie.USER_LOGGED_ARMAZEM) return { props: {}, redirect: { destination: '/', permanent: false } }
            return {
                props: {
                    almoxarifarios,
                    classificacao,
                    duracao,
                    obras
                },
            };
        }
);


export default PosicaoObra
