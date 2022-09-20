import { useState } from "react"
import Header from "../../components/Header"
import SiderBar from "../../components/SiderBar"

import { FaSave, FaEdit, FaTrash } from 'react-icons/fa'

import Load from '../../assets/load.gif'
import Image from "next/image"
import EditarModal from "../../components/classificacao/EditarModal"
import dynamic from "next/dynamic"
import Head from "next/head"
import { SubmitHandler, useForm } from "react-hook-form"
import { useDispatch } from "react-redux"
import { unwrapResult } from "@reduxjs/toolkit"
import { GetServerSideProps, GetServerSidePropsContext } from "next"

import { wrapper } from "../../redux/store"

import nookies from 'nookies'

import { useRouter } from "next/router"
import { deleteClassificacao, fetchClassificacao, insertClassificacao } from "../../redux/slices/classificacaoSlice"

const SweetAlert2 = dynamic(() => import('react-sweetalert2'), { ssr: false })


type ClassificacaoType = {
    id: number
    tipo: string;
}

type ObraProps = {
    classificacao: ClassificacaoType[];
}

const Classificacao = ({ classificacao }: ObraProps) => {

    const [idClassificacao, setClassificacao] = useState(0)

    const [search, setSearch] = useState('')
    const [hideSideBar, setHideSideBar] = useState(false)
    const [load, setLoad] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)

    //Estados dos sweetAlerts
    const [showConfirmAlert, setShowConfirmAlert] = useState(false)
    const [showErrorAlert, setShowErrorAlert] = useState(false)
    const [showQuestionAlert, setShowQuestionAlert] = useState(false)

    const [ClassificacaoObject, setClassificacaoObject] = useState({} as ClassificacaoType)

    const { register, handleSubmit, reset, formState: { errors, isValid } } = useForm<ClassificacaoType>({ mode: 'onChange' });

    const dispatch = useDispatch<any>()
    const route = useRouter()

    const onSubmit: SubmitHandler<ClassificacaoType> = async (data) => {
        setLoad(true)

        const resultDispatch = await dispatch(insertClassificacao({ tipo: data.tipo }))
        const dataResult = unwrapResult(resultDispatch)

        if (dataResult) {
            setShowConfirmAlert(true)
        } else {
            setShowErrorAlert(true)
        }
        setLoad(false)
        reset()
    }

    const filteredObras = (search && classificacao) ? classificacao.filter((classific) => classific.tipo.toLowerCase().includes(search.toLocaleLowerCase())) : [];

    const handleEditarClassificacao = (classificacao: ClassificacaoType) => {
        setClassificacaoObject(classificacao)
        setShowEditModal(true)
    }

    const handleDeleteObra = async () => {
        const resultDispatch = await dispatch(deleteClassificacao(idClassificacao))

        if (resultDispatch.payload) {
            setShowConfirmAlert(true)
        }
    }

    return (
        <div className='flex'>
            {
                showEditModal && (
                    <EditarModal
                        ClassificacaoObject={ClassificacaoObject}
                        isOpen={showEditModal}
                        setIsOpen={setShowEditModal} />
                )

            }

            <SiderBar itemActive="classificacao" />

            <main className='flex-1 space-y-6 overflow-x-hidden'>
                <div>
                    <Header />
                </div>

                <Head>
                    <title>SCA | Classificação de equipamentos</title>
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
                        <h2 className="divide-x-2 h-5 text-2xl font-semibold">Cadastro de Classificação</h2>
                        <div className="border w-1/5 border-gray-700 ml-4"></div>
                        <div className="flex gap-5">
                            <input
                                {...register('tipo', {
                                    required: { message: "Por favor, introduza o tipo de classificação.", value: true },
                                    minLength: { message: "Preenchimento obrigatório!", value: 1 },
                                })}
                                type="text"
                                placeholder="Classificação"
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
                                title="Salvar a classificação"
                                className="bg-blue-700 text-white font-semibold px-4 py-2 mt-4 hover:brightness-75 rounded flex items-center gap-2 disabled:cursor-not-allowed disabled:bg-blue-500" >
                                {load ? (<Image src={Load} objectFit={"contain"} width={20} height={15} />) : (<FaSave />)}
                                <span>Salvar</span>
                            </button>
                        </div>
                    </form>

                    
                </div>
                <div className='mt-4 text-end px-4 py-2 max-w-sm lg:max-w-6xl  mx-auto bg-white rounded overflow-x-auto'>
                    <div className="flex justify-between items-center">
                        <input
                            onChange={(e) => setSearch(e.target.value)}
                            type="search"
                            className=" w-full lg:w-1/3 rounded shadow "
                            placeholder="Pesquise pela classificação" />
                        <span className='font-semibold text-lg hidden lg:flex'>Lista de Classificações</span>
                    </div>
                    <table className='table w-full text-center mt-2 animate__animated animate__fadeIn'>
                        <thead>
                            <tr className='flex justify-between bg-gray-200 px-4 py-2 rounded'>
                                <th className='text-gray-600 font-bold w-16'>ID</th>
                                <th className='text-gray-600 font-bold w-72 '>Tipo</th>
                                <th className='text-gray-600 font-bold w-20'>Editar</th>
                                <th className='text-gray-600 font-bold w-20'>Apagar</th>
                            </tr>
                        </thead>
                        <tbody className=''>

                            {

                                (classificacao && classificacao.length && search === '') ? classificacao.map((classific) => (
                                    <tr key={classific.id} className='flex justify-between border shadow-md mt-4 px-4 py-2'>
                                        <td className="w-16 ">{classific.id}</td>
                                        <td className="w-72 ">{classific.tipo}</td>
                                        <td className="w-20  flex justify-center items-center">
                                            <button
                                                onClick={() => handleEditarClassificacao(classific)}
                                                className="hover:brightness-75"
                                                title="Editar">
                                                <FaEdit />
                                            </button>
                                        </td>
                                        <td className="w-20  flex justify-center items-center">
                                            <button
                                                onClick={() => { setShowQuestionAlert(true); setClassificacao(classific.id) }}
                                                className="hover:brightness-75"
                                                title="Apagar">
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                )) : filteredObras.map((filteredObra) => (
                                    <tr key={filteredObra.id} className='flex justify-between border shadow-md mt-4 px-4 py-2'>
                                        <td className="w-16 ">{filteredObra.id}</td>
                                        <td className="w-72 ">{filteredObra.tipo}</td>
                                        <td className="w-20  flex justify-center items-center">
                                            <button
                                                onClick={() => handleEditarClassificacao(filteredObra)}
                                                className="hover:brightness-75"
                                                title="Editar">
                                                <FaEdit />
                                            </button>
                                        </td>
                                        <td className="w-20  flex justify-center items-center">
                                            <button
                                                onClick={() => { setShowQuestionAlert(true); setClassificacao(filteredObra.id) }}
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
                </div>
            </main>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(
    (store) =>
        async (context: GetServerSidePropsContext) => {

            //   const cookie = nookies.get(context);

            const classificacoesDispatch: any = await store.dispatch(fetchClassificacao());


            const classificacao = classificacoesDispatch.payload

            //   if (!cookie.USER_LOGGED_ARMAZEM) return { props: {}, redirect: { destination: '/', permanent: false } }

            return {
                props: {
                    classificacao
                },
            };
        }
);



export default Classificacao
