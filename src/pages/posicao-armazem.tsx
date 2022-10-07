import { useState } from "react"
import Head from "next/head"

import Header from "../components/Header"
import SiderBar from "../components/SiderBar"

import { FaPrint } from 'react-icons/fa'
import nookies from 'nookies'


import dynamic from "next/dynamic"
import EditarModal from "../components/equipamento/EditModal"
import { wrapper } from "../redux/store"
import { GetServerSideProps, GetServerSidePropsContext } from "next"

import { fetchArmGeral } from "../redux/slices/armGeralSlice"
import { fetchClassificacao } from "../redux/slices/classificacaoSlice"
import { fetchDuracao } from "../redux/slices/duracaoSlice.ts"
import { useRouter } from "next/router"
const SweetAlert2 = dynamic(() => import('react-sweetalert2'), { ssr: false })
import AES from 'crypto-js/aes';
import ReactPaginate from 'react-paginate'


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
    equipamentosARM: EquipamentosARMType[];
    duracao: DuracaoType[];
    classificacao: ClassificacaoType[]
}

const PosicaoArmazem = ({ equipamentosARM, classificacao, duracao }: PosicaoArmazemProps) => {

    const route = useRouter()

    //Pagination
    const [currentPage, setCurrentPage] = useState(0);
    const PER_PAGE = 3;
    const offset = currentPage * PER_PAGE;
    let pageCount = 1;

    let currentPageData: EquipamentosARMType[] = []
    let currentFilteredData: EquipamentosARMType[] = []

    //Estados dos sweetAlerts
    const [showConfirmAlert, setShowConfirmAlert] = useState(false)
    const [showErrorAlert, setShowErrorAlert] = useState(false)
    const [showQuestionAlert, setShowQuestionAlert] = useState(false)
    const [search, setSearch] = useState('')
    const [searchByClassificacao, setSearchByClassificacao] = useState(0)

    const [showEditModal, setShowEditModal] = useState(false)

    const [armazemObject, setArmazemObject] = useState<EquipamentosARMType>({} as EquipamentosARMType)



    //Funções
    const findDuracao = (id: number) => {
        const duration = (duracao && duracao.length) ? duracao.find((dur) => (dur.id === id)) : []

        return duration as DuracaoType
    }

    const findClassificacao = (id: number) => {
        const classification = (classificacao && classificacao.length) ? classificacao.find((classific) => (classific.id === id)) : []
        return classification as ClassificacaoType
    }

    let findedEquipamento: EquipamentosARMType[] = []


    if (equipamentosARM) {
        if (search && searchByClassificacao === 0) {
            findedEquipamento = equipamentosARM.filter((equipamento) => equipamento.equipamento_id.descricao.toLowerCase().includes(search.toLowerCase()))
        } else if (searchByClassificacao !== 0 && search === '') {
            findedEquipamento = equipamentosARM.filter((equipamento) => equipamento.equipamento_id.classificacao_id === searchByClassificacao)
        } else {

            findedEquipamento = equipamentosARM.filter((equipamento) => equipamento.equipamento_id.descricao.toLowerCase().includes(search.toLowerCase()) && equipamento.equipamento_id.classificacao_id === searchByClassificacao)
        }

    }


    if (findedEquipamento.length) {
        currentFilteredData = findedEquipamento
            .slice(offset, offset + PER_PAGE)

        pageCount = Math.ceil(findedEquipamento.length / PER_PAGE);
    } else {
        currentPageData = equipamentosARM
            .slice(offset, offset + PER_PAGE)

        pageCount = Math.ceil(equipamentosARM.length / PER_PAGE);
    }

    const handleEdit = (armazem: EquipamentosARMType) => {
        setArmazemObject(armazem);
        setShowEditModal(true)
    }

    /**
  * Função para criptografar uma string
  */
    const encriptSTR = (params: string) => {

        const encriptedParams = AES.encrypt(params, 'AES-256-CBC').toString()

        return encodeURIComponent(encriptedParams)

    }

    function handlePageClick({ selected: selectedPage }: any) {
        setCurrentPage(selectedPage);
    }

    return (
        <div className='flex'>
            <SiderBar itemActive="posicao-armazem" />
            <main className='flex-1 space-y-6 max-h-screen overflow-hide-scroll-bar overflow-x-hidden'>
                <div>
                    <Header />
                </div>
                <Head>
                    <title>SCA | Posição em armazem</title>
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
                {showEditModal && <EditarModal isOpen={showEditModal} setIsOpen={setShowEditModal} data={armazemObject} />}
                <div className='overflow-auto max-h-[85vh] max-w-4xl mx-auto overflow-hide-scroll-bar'>
                    <div className="bg-white shadow max-w-6xl mx-auto flex flex-col space-y-6 p-6 rounded mt-5 animate__animated animate__fadeIn">
                        <h2 className=" h-5 text-2xl font-semibold">Posição Armazem geral</h2>
                        <div className="border w-1/5 border-gray-700 ml-4"></div>
                        <div className="lg:ml-auto  flex gap-2 -mt-4">

                            <select
                                onChange={(event) => setSearchByClassificacao(Number(event.target.value))}
                                className="rounded shadow cursor-pointer w-full" >
                                <option value={0} className='text-gray-400'>Selecione a classificação</option>
                                {
                                    (classificacao && classificacao.length) && classificacao.map((classific, index) => (
                                        <option
                                            key={index}
                                            value={classific.id}>{classific.tipo}</option>
                                    ))
                                }
                            </select>

                        </div>
                        <div className="flex gap-5">
                            <input
                                onChange={(event) => setSearch(event.target.value)}
                                type="search"
                                placeholder="Pesquise pelo equipamento"
                                className="w-full rounded shadow" />

                        </div>
                        <div className=" ml-auto flex gap-2">
                            <button
                                onClick={() => route.push('/relatorio/armazem/all')}
                                className="bg-gray-700 text-white px-4 py-2 shadow font-bold flex items-center gap-2 hover:brightness-75">
                                <FaPrint />
                                <span>Imprimir tudo</span>
                            </button>
                            <button
                                disabled={!(search || searchByClassificacao)}
                                onClick={() => route.push(`/relatorio/armazem/${search === '' ? encriptSTR('equipamento') : encriptSTR(search)}/${searchByClassificacao}`)}
                                className="bg-gray-200 text-gray-600 px-4 py-2 shadow font-bold flex items-center gap-2 hover:brightness-75 disabled:cursor-not-allowed">
                                <FaPrint />
                                <span>Imprimir</span>
                            </button>
                        </div>
                    </div>


                </div>
                <div className='mt-8 text-end px-4 py-2 flex flex-col flex-1 mx-auto bg-white rounded overflow-x-auto overflow-hide-scroll-bar'>
                    <span className='font-semibold text-lg'>Relatório armazem geral</span>
                    <table className='table w-full text-center mt-2 animate__animated animate__fadeIn'>
                        <thead>
                            <tr className='flex justify-between bg-gray-200 px-4 py-2 rounded'>
                                <th className='text-gray-600 font-bold w-16'>ID</th>
                                <th className='text-gray-600 font-bold w-72 '>Descrição</th>
                                <th className='text-gray-600 font-bold w-52'>Classificação</th>
                                <th className='text-gray-600 font-bold w-44'>Tempo de duração</th>
                                <th className='text-gray-600 font-bold w-40'>Quantidade</th>
                                <th className='text-gray-600 font-bold w-40'>Estado</th>
                            </tr>
                        </thead>
                        <tbody className=''>
                            {
                                ((search || searchByClassificacao) && findedEquipamento.length === 0) ? <tr><td className="p-3 font-bold ">... Equipamento não encontrado</td></tr> :
                                    (equipamentosARM && equipamentosARM.length && findedEquipamento.length === 0) ? currentPageData?.map((equipamento, index) => (
                                        <tr
                                            key={index}
                                            className='flex justify-between border shadow-md mt-4 px-4 py-2'>
                                            <td className="w-16 ">{equipamento.id}</td>
                                            <td className="w-72 ">{equipamento.equipamento_id.descricao}</td>
                                            <td className="w-52 ">{findClassificacao(equipamento.equipamento_id.classificacao_id).tipo}</td>
                                            <td className="w-44 ">{findDuracao(equipamento.equipamento_id.duracao_id).tempo}</td>

                                            <td className="w-40 ">{equipamento.quantidade}</td>
                                            <td className="w-40 ">{equipamento.estado}</td>

                                        </tr>
                                    )) : currentFilteredData?.map((finded, index) => (
                                        <tr
                                            key={index}
                                            className='flex justify-between border shadow-md mt-4 px-4 py-2'>
                                            <td className="w-16 ">{finded.id}</td>
                                            <td className="w-72 ">{finded.equipamento_id.descricao}</td>
                                            <td className="w-52 ">{findClassificacao(finded.equipamento_id.classificacao_id).tipo}</td>
                                            <td className="w-44 ">{findDuracao(finded.equipamento_id.duracao_id).tempo}</td>
                                            <td className="w-40 ">{finded.quantidade}</td>
                                            <td className="w-40 ">{finded.estado}</td>
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

            //const equipamentoDispatch = await store.dispatch(fetchEquipamento());
            const classificacaoDispatch: any = await store.dispatch(fetchClassificacao());
            const duracaoDispatch: any = await store.dispatch(fetchDuracao());
            const equipamentoARM: any = await store.dispatch(fetchArmGeral());


            // const equipamentos = equipamentoDispatch.payload
            const classificacao = classificacaoDispatch.payload
            const duracao = duracaoDispatch.payload
            const equipamentosARM = equipamentoARM.payload
            if (!cookie.USER_LOGGED_ARMAZEM) return { props: {}, redirect: { destination: '/', permanent: false } }

            return {
                props: {
                    equipamentosARM,
                    classificacao,
                    duracao
                },
            };
        }
);

export default PosicaoArmazem
