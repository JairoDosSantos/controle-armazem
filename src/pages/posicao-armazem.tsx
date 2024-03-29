import Head from "next/head"
import { useState } from "react"

import Header from "../components/Header"
import SiderBar from "../components/SiderBar"

import nookies from 'nookies'


import { GetServerSideProps, GetServerSidePropsContext } from "next"
import dynamic from "next/dynamic"
import EditarModal from "../components/equipamento/EditModal"
import { wrapper } from "../redux/store"

import AES from 'crypto-js/aes'
import Image from "next/image"
import { useRouter } from "next/router"
import ReactPaginate from 'react-paginate'
import { useDispatch } from "react-redux"
import Load from '../assets/load.gif'
import { fetchArmGeral } from "../redux/slices/armGeralSlice"
import { fetchClassificacao } from "../redux/slices/classificacaoSlice"
import { fetchDuracao } from "../redux/slices/duracaoSlice.ts"
import api from "../services/api"
const SweetAlert2 = dynamic(() => import('react-sweetalert2'), { ssr: false })
const LinkDonwloadArmazem = dynamic(() => import('../components/relatorios/Armazem'), { ssr: false })

type EquipamentoType = {
    id: number;
    descricao: string;
    duracao_id: number;
    classificacao_id: number;
    data: string;
    especialidade_id: number;

}

type EquipamentosARMType = {
    id: number;
    quantidade: number;
    equipamento_id: EquipamentoType;
    data_aquisicao: string;
    estado: string;
    mes: string
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
    classificacao: ClassificacaoType[];
    especialidade: EspecialidadeType[]
}
type EspecialidadeType = {
    id: number;
    especialidade: string
}
const PosicaoArmazem = ({ equipamentosARM, classificacao, duracao, especialidade }: PosicaoArmazemProps) => {
    const dispatch = useDispatch();
    const route = useRouter()
    //const queryClient = new QueryClient()



    //const query = useQuery('posicaoArmazem', getAllClassifications)

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
    const [searchEspecialidade, setSearchByEspecialidade] = useState(0)
    const [loading, setLoading] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [searchByDateMonth, setSearchByDateMonth] = useState('')
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

    const findEspecialidade = (id: number) => {
        const especialidades = especialidade.length ? especialidade.find((especial) => (especial.id === id)) : []
        return especialidades as EspecialidadeType
    }

    let findedEquipamento: EquipamentosARMType[] = []
    let EquipamentoEmArmazemfiltradoPorMesAno: EquipamentosARMType[] = []
    if (equipamentosARM) {
        EquipamentoEmArmazemfiltradoPorMesAno = searchByDateMonth ? equipamentosARM.filter((equipamentoEmArmazem) => equipamentoEmArmazem.mes?.trim() === searchByDateMonth.trim()).sort((materialEmArmazemA, materialEmArmazemB) => {
            if (materialEmArmazemA.equipamento_id.especialidade_id > materialEmArmazemB.equipamento_id.especialidade_id)
                return 1
            else
                return -1
        }) : equipamentosARM

        if (search && searchByClassificacao === 0 && searchEspecialidade === 0) {
            findedEquipamento = EquipamentoEmArmazemfiltradoPorMesAno.filter((equipamento) => equipamento.equipamento_id.descricao.toLowerCase().includes(search.toLowerCase()))
        } else if (searchByClassificacao !== 0 && search === '' && searchEspecialidade === 0) {
            findedEquipamento = EquipamentoEmArmazemfiltradoPorMesAno.filter((equipamento) => equipamento.equipamento_id.classificacao_id === searchByClassificacao)
        } else if (searchByClassificacao === 0 && search === '' && searchEspecialidade !== 0) {
            findedEquipamento = EquipamentoEmArmazemfiltradoPorMesAno.filter((equipamento) => equipamento.equipamento_id.especialidade_id === searchEspecialidade)

        } else {
            findedEquipamento = EquipamentoEmArmazemfiltradoPorMesAno.filter((equipamento) => equipamento.equipamento_id.descricao.toLowerCase().includes(search.toLowerCase()) && equipamento.equipamento_id.classificacao_id === searchByClassificacao && equipamento.equipamento_id.especialidade_id === searchEspecialidade)
        }
    }

    if (findedEquipamento.length) {
        currentFilteredData = findedEquipamento
            .slice(offset, offset + PER_PAGE)

        pageCount = Math.ceil(findedEquipamento?.length / PER_PAGE);
    } else {
        currentPageData = EquipamentoEmArmazemfiltradoPorMesAno
            ?.slice(offset, offset + PER_PAGE)

        pageCount = Math.ceil(EquipamentoEmArmazemfiltradoPorMesAno?.length / PER_PAGE);
    }

    const handleEdit = (armazem: EquipamentosARMType) => {
        setArmazemObject(armazem);
        setShowEditModal(true)
    }

    /**
        *Função para criptografar uma string
     */
    const encriptSTR = (params: string) => {

        const encriptedParams = AES.encrypt(params, 'AES-256-CBC').toString()

        return encodeURIComponent(encriptedParams)

    }

    function handlePageClick({ selected: selectedPage }: any) {
        setCurrentPage(selectedPage);
    }
    const toPrint = findedEquipamento.length ? findedEquipamento : equipamentosARM
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
                        <div className="flex gap-5 -mt-4">

                            <select
                                onChange={(event) => setSearchByEspecialidade(Number(event.target.value))}
                                className="rounded shadow cursor-pointer w-full lg:w-1/3 uppercase" >
                                <option value={0} className='text-gray-400'>Selecione a especialidade</option>
                                {
                                    especialidade?.map((especialidadeEquipamento, index) => (
                                        <option
                                            key={index}
                                            value={especialidadeEquipamento.id}>
                                            {especialidadeEquipamento.especialidade}
                                        </option>
                                    ))
                                }
                            </select>

                            <select
                                onChange={(event) => setSearchByClassificacao(Number(event.target.value))}
                                className="rounded shadow cursor-pointer w-full lg:w-1/3 uppercase" >
                                <option value={0} className='text-gray-400'>Selecione a classificação</option>
                                {
                                    (classificacao && classificacao.length) && classificacao.map((classific, index) => (
                                        <option
                                            key={index}
                                            value={classific.id}>{classific.tipo}</option>
                                    ))
                                }
                            </select>

                            <input
                                onChange={(event) => setSearchByDateMonth(event.target.value)}
                                type="month"
                                className="rounded shadow uppercase w-full lg:w-1/3" />
                        </div>

                        <div className="flex gap-5">
                            <input
                                onChange={(event) => setSearch(event.target.value)}
                                type="search"
                                placeholder="Pesquise pelo equipamento"
                                className="w-full rounded shadow placeholder:uppercase" />

                        </div>
                        {
                            loading ? (
                                <div className="flex justify-self-center self-center absolute h-50 w-50">
                                    <Image src={Load} className='' objectFit="cover" />
                                </div>
                            ) : <></>
                        }

                        <div className=" ml-auto flex gap-2">
                            <LinkDonwloadArmazem
                                legenda={(search.length || searchByClassificacao) ? 'Imprimir' : 'Imprimir Tudo'}
                                classificacao={classificacao}
                                duracao={duracao}
                                especialidade={especialidade}
                                equipamentosARM={toPrint} />
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
                                <th className='text-gray-600 font-bold w-52'>Especialidade</th>
                                <th className='text-gray-600 font-bold w-44'>Tempo de duração</th>
                                <th className='text-gray-600 font-bold w-40'>Quantidade</th>
                                <th className='text-gray-600 font-bold w-40'>Estado</th>
                            </tr>
                        </thead>
                        <tbody className=''>
                            {
                                ((search || searchByClassificacao || searchEspecialidade) && findedEquipamento.length === 0) ? <tr><td className="p-3 font-bold ">... Equipamento não encontrado</td></tr> :
                                    (equipamentosARM && equipamentosARM.length && findedEquipamento.length === 0) ? currentPageData?.map((equipamento, index) => (
                                        <tr
                                            key={index}
                                            className='flex justify-between border shadow-md mt-4 px-4 py-2'>
                                            <td className="w-16 ">{equipamento.id}</td>
                                            <td className="w-72 ">{equipamento.equipamento_id.descricao}</td>
                                            <td className="w-52 ">{findClassificacao(equipamento.equipamento_id.classificacao_id).tipo}</td>
                                            <td className="w-52 ">{findEspecialidade(equipamento.equipamento_id.especialidade_id).especialidade}</td>
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
                                            <td className="w-52 ">{findEspecialidade(finded.equipamento_id.especialidade_id).especialidade}</td>
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

            const especialidades = await api.get('api/especialidade')
            const { data } = especialidades.data

            //const equipamentos = equipamentoDispatch.payload
            const classificacao = classificacaoDispatch.payload
            const duracao = duracaoDispatch.payload
            const equipamentosARM = equipamentoARM.payload

            if (!cookie.USER_LOGGED_ARMAZEM) return { props: {}, redirect: { destination: '/', permanent: false } }

            return {
                props: {
                    equipamentosARM,
                    classificacao,
                    duracao,
                    especialidade: data
                },
            };
        }
);

export default PosicaoArmazem
