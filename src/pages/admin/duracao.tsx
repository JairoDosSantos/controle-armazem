import { useState } from "react"
import Header from "../../components/Header"
import SiderBar from "../../components/SiderBar"

import { FaSave, FaEdit, FaTrash } from 'react-icons/fa'

import Load from '../../assets/load.gif'
import Image from "next/image"
import EditarModal from "../../components/duracao/EditarModal"
import dynamic from "next/dynamic"
import Head from "next/head"
import { SubmitHandler, useForm } from "react-hook-form"
import { useDispatch } from "react-redux"
import { unwrapResult } from "@reduxjs/toolkit"
import { GetServerSideProps, GetServerSidePropsContext } from "next"

import { wrapper } from "../../redux/store"

import nookies from 'nookies'

import { useRouter } from "next/router"
import { deleteDuracao, fetchDuracao, insertDuracao } from "../../redux/slices/duracaoSlice.ts"
import ReactPaginate from "react-paginate"

const SweetAlert2 = dynamic(() => import('react-sweetalert2'), { ssr: false })


type DuracaoType = {
    id: number
    tempo: string;
}


type DuracaoProps = {
    duracoes: DuracaoType[];
}

const Classificacao = ({ duracoes }: DuracaoProps) => {


    //Pagination
    const [currentPage, setCurrentPage] = useState(0);
    const PER_PAGE = 2;
    const offset = currentPage * PER_PAGE;
    let pageCount = 1;
    let currentFilteredData: DuracaoType[] = []
    let currentPageData: DuracaoType[] = []

    const [idDuracao, setDuracao] = useState(0)

    const [search, setSearch] = useState('')
    const [hideSideBar, setHideSideBar] = useState(false)
    const [load, setLoad] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)

    //Estados dos sweetAlerts
    const [showConfirmAlert, setShowConfirmAlert] = useState(false)
    const [showErrorAlert, setShowErrorAlert] = useState(false)
    const [showQuestionAlert, setShowQuestionAlert] = useState(false)

    const [duracaoObject, setDuracaoObject] = useState({} as DuracaoType)

    const { register, handleSubmit, reset, formState: { errors, isValid } } = useForm<DuracaoType>({ mode: 'onChange' });

    const dispatch = useDispatch<any>()
    const route = useRouter()

    const onSubmit: SubmitHandler<DuracaoType> = async (data) => {
        setLoad(true)

        const resultDispatch = await dispatch(insertDuracao({ tempo: data.tempo }))
        const dataResult = unwrapResult(resultDispatch)

        if (dataResult) {
            setShowConfirmAlert(true)
        } else {
            setShowErrorAlert(true)
        }
        setLoad(false)
        reset()
    }

    const filteredObras = (search && duracoes.length) ? duracoes.filter((duracao) => duracao.tempo.toLowerCase().includes(search.toLocaleLowerCase())) : [];

    const handleEditarDuracao = (duracao: DuracaoType) => {
        setDuracaoObject(duracao)
        setShowEditModal(true)
    }
    const handleDeleteObra = async () => {
        const resultDispatch = await dispatch(deleteDuracao(idDuracao))

        if (resultDispatch.payload) {
            setShowConfirmAlert(true)
        }
    }

    if (filteredObras.length) {
        currentFilteredData = filteredObras
            .slice(offset, offset + PER_PAGE)

        pageCount = Math.ceil(filteredObras.length / PER_PAGE);
    } else {

        currentPageData = duracoes
            .slice(offset, offset + PER_PAGE)

        pageCount = Math.ceil(duracoes.length / PER_PAGE);
    }

    function handlePageClick({ selected: selectedPage }: any) {
        setCurrentPage(selectedPage);
    }
    return (

        <div className='flex'>
            {
                showEditModal && (
                    <EditarModal
                        duracaoObject={duracaoObject}
                        isOpen={showEditModal}
                        setIsOpen={setShowEditModal} />
                )

            }

            <SiderBar itemActive="duracao" />
            <main className='flex-1 space-y-6 overflow-x-hidden'>
                <div>
                    <Header />
                </div>

                <Head>
                    <title>SCA | Duração dos materiais</title>
                </Head>

                {/**Confirm alert**/}
                <SweetAlert2
                    backdrop={true}
                    show={showConfirmAlert}
                    title='Sucesso'
                    text='Operação efectuada com sucesso!'
                    onConfirm={() => { setShowConfirmAlert(false); route.reload() }}
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
                    text='Ocorreu um erro ao efectuar a operação. Por favor, verifique se o objecto que está a cadastrar já não está cadastrado no sistema!'
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
                    onConfirm={handleDeleteObra}
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
                    <form

                        onSubmit={handleSubmit(onSubmit)}
                        className="bg-white shadow max-w-2xl mx-auto flex flex-col space-y-6 p-6 rounded mt-10 animate__animated animate__fadeIn">
                        <h2 className="divide-x-2 h-5 text-2xl font-semibold truncate py-7">Cadastro de Tempos  extimados para equipamentos</h2>
                        <div className="border w-1/5 border-gray-700 ml-4"></div>
                        <div className="flex gap-5">
                            <input
                                {...register('tempo', {
                                    required: { message: "Por favor, introduza o tempo extimado.", value: true },
                                    minLength: { message: "Preenchimento obrigatório!", value: 1 },
                                })}
                                type="text"
                                placeholder="Tempo de Duração"
                                className="w-full rounded shadow" />
                        </div>
                        <div className="flex gap-2 justify-end">
                            <button
                                title="Limpar formulário"
                                onClick={() => reset()}
                                type="button"
                                className="bg-gray-700 text-white  font-semibold px-4 py-2 mt-4 hover:brightness-75 rounded">Cancelar
                            </button>
                            <button
                                disabled={!isValid}
                                title="Salvar o tempo extimado"
                                className="bg-blue-700 text-white font-semibold px-4 py-2 mt-4 hover:brightness-75 rounded flex items-center gap-2 disabled:cursor-not-allowed disabled:bg-blue-500" >
                                {load ? (<Image src={Load} objectFit={"contain"} width={20} height={15} />) : (<FaSave />)}
                                <span>Salvar</span>
                            </button>
                        </div>
                    </form>


                </div>
                <div className='mt-4 text-end px-4 py-2 mx-auto bg-white rounded max-w-sm lg:max-w-6xl overflow-x-auto'>
                    <div className="flex justify-between items-center">
                        <input
                            onChange={(e) => setSearch(e.target.value)}
                            type="search"
                            className="w-full lg:w-1/3 rounded shadow "
                            placeholder="Pesquise pelo tempo extimado" />
                        <span className='font-semibold text-lg hidden lg:flex'>Lista de tempos extimados dos Equipamentos</span>
                    </div>
                    <table className='table w-full text-center mt-2 animate__animated animate__fadeIn'>
                        <thead>
                            <tr className='flex justify-between bg-gray-200 px-4 py-2 rounded'>
                                <th className='text-gray-600 font-bold w-16'>ID</th>
                                <th className='text-gray-600 font-bold w-52 '>Tempo</th>
                                <th className='text-gray-600 font-bold w-20'>Editar</th>
                                <th className='text-gray-600 font-bold w-20'>Apagar</th>
                            </tr>
                        </thead>
                        <tbody className=''>

                            {

                                (duracoes && duracoes.length && search === '') ? currentPageData?.map((duracao) => (
                                    <tr key={duracao.id} className='flex justify-between border shadow-md mt-4 px-4 py-2'>
                                        <td className="w-16 ">{duracao.id}</td>
                                        <td className="w-52 ">{duracao.tempo}</td>
                                        <td className="w-20  flex justify-center items-center">
                                            <button
                                                onClick={() => handleEditarDuracao(duracao)}
                                                className="hover:brightness-75"
                                                title="Editar">
                                                <FaEdit />
                                            </button>
                                        </td>
                                        <td className="w-20  flex justify-center items-center">
                                            <button
                                                onClick={() => { setShowQuestionAlert(true); setDuracao(duracao.id) }}
                                                className="hover:brightness-75"
                                                title="Apagar">
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                )) : currentFilteredData?.map((filteredObra) => (
                                    <tr key={filteredObra.id} className='flex justify-between border shadow-md mt-4 px-4 py-2'>
                                        <td className="w-16 ">{filteredObra.id}</td>
                                        <td className="w-52 ">{filteredObra.tempo}</td>
                                        <td className="w-20  flex justify-center items-center">
                                            <button
                                                onClick={() => handleEditarDuracao(filteredObra)}
                                                className="hover:brightness-75"
                                                title="Editar">
                                                <FaEdit />
                                            </button>
                                        </td>
                                        <td className="w-20  flex justify-center items-center">
                                            <button
                                                onClick={() => { setShowQuestionAlert(true); setDuracao(filteredObra.id) }}
                                                className="hover:brightness-75"
                                                title="Apagar">
                                                <FaTrash />
                                            </button>
                                        </td>
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
            if (!cookie.USER_LOGGED_ARMAZEM) return { props: {}, redirect: { destination: '/', permanent: false } }

            const duracoesDispatch: any = await store.dispatch(fetchDuracao());


            const duracoes = duracoesDispatch.payload


            return {
                props: {
                    duracoes
                },
            };
        }
);



export default Classificacao
