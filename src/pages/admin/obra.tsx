import { useState } from "react"
import Header from "../../components/Header"
import SiderBar from "../../components/SiderBar"

import { FaSave, FaEdit, FaTrash } from 'react-icons/fa'

import Load from '../../assets/load.gif'
import Image from "next/image"
import EditarModal from "../../components/obra/EditModal"
import dynamic from "next/dynamic"
import Head from "next/head"
import { SubmitHandler, useForm } from "react-hook-form"
import { useDispatch } from "react-redux"
import { deleteObra, fetchObra, insertObra } from "../../redux/slices/obraSlice"
import { unwrapResult } from "@reduxjs/toolkit"
import { GetServerSideProps, GetServerSidePropsContext } from "next"

import { wrapper } from "../../redux/store"
import { fetchEncarregados } from "../../redux/slices/encarregadoSlice"

import nookies from 'nookies'
import { supabase } from "../../utils/supabaseClient"
import { useRouter } from "next/router"
import { useSelector } from "react-redux"

const SweetAlert2 = dynamic(() => import('react-sweetalert2'), { ssr: false })

//Tipagem do formulário
type FormValues = {
    id: number
    descricao: string;
    encarregado: number;
}
type ObraType = {
    id: number
    obra_nome: string;
    encarregado_id: EncarregadoType;
    estado: 'Activa' | 'Inactiva' | 'Concluida'
}

type EncarregadoType = {
    id: number;
    nome: string;
    telefone: string
}

type ObraProps = {
    obras: ObraType[];
    encarregados: EncarregadoType[];
}

const Obra = ({ obras, encarregados }: ObraProps) => {


    /**
     * const Obras = useSelector((state: any) => state.Obra)
       console.log(Obras)
     */


    const [idObra, setIdObra] = useState(0)

    const [search, setSearch] = useState('')

    const [load, setLoad] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)

    //Estados dos sweetAlerts
    const [showConfirmAlert, setShowConfirmAlert] = useState(false)
    const [showErrorAlert, setShowErrorAlert] = useState(false)
    const [showQuestionAlert, setShowQuestionAlert] = useState(false)

    const [obraObject, setObraObject] = useState({} as ObraType)

    const { register, handleSubmit, reset, formState: { errors, isValid } } = useForm<FormValues>({ mode: 'onChange' });

    const dispatch = useDispatch<any>()
    const route = useRouter()

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        setLoad(true)

        const resultDispatch = await dispatch(insertObra({ encarregado_id: data.encarregado, estado: 'Activa', obra_nome: data.descricao, id: data.id }))
        const dataResult = unwrapResult(resultDispatch)

        if (dataResult) {
            setShowConfirmAlert(true)
        } else {
            setShowErrorAlert(true)
        }
        setLoad(false)
        reset()
    }

    const filteredObras = (search && obras) ? obras.filter((obra) => obra.obra_nome.toLowerCase().includes(search.toLocaleLowerCase())) : [];

    const handleEditObra = (obra: ObraType) => {
        setObraObject(obra)
        setShowEditModal(true)
    }
    const handleDeleteObra = async () => {
        const resultDispatch = await dispatch(deleteObra(idObra))

        if (resultDispatch.payload) {
            setShowConfirmAlert(true)
        }
    }
    return (

        <div className='flex'>
            {
                showEditModal && (
                    <EditarModal
                        obraObject={obraObject}
                        isOpen={showEditModal}
                        setIsOpen={setShowEditModal} />
                )
            }

            <SiderBar itemActive="obra" />
            <main className='flex-1 space-y-6'>
                <div>
                    <Header />
                </div>

                <Head>
                    <title>SCA | Obra</title>
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
                        <h2 className="divide-x-2 h-5 text-2xl font-semibold">Cadastro de Obra</h2>
                        <div className="border w-1/5 border-gray-700 ml-4"></div>
                        <div className="flex flex-col lg:flex-row gap-5">
                            <input
                                {...register('descricao', {
                                    required: { message: "Por favor, introduza a descrição da Obra.", value: true },
                                    minLength: { message: "Preenchimento obrigatório!", value: 1 },
                                })}
                                type="text"
                                placeholder="Obra"
                                className="w-full lg:w-1/2 rounded shadow" />
                            <select
                                id="encarregado"
                                {...register('encarregado', {
                                    required: { message: "Por favor, introduza o nome do encarregado.", value: true },
                                    minLength: { message: "Preenchimento obrigatório!", value: 1 },
                                })}
                                className="w-full lg:w-1/2 rounded shadow cursor-pointer"
                            >

                                <option value='' className='text-gray-400' >Selecione o encarregado</option>
                                {
                                    encarregados && encarregados.length && encarregados.map((encarregado) =>
                                    (<option
                                        key={encarregado.id}
                                        value={encarregado.id}>{encarregado.nome}
                                    </option>)
                                    )
                                }
                            </select>

                        </div>
                        <div className="flex gap-2 justify-end">
                            <button
                                onClick={() => reset()}
                                type="button"
                                className="bg-gray-700 text-white  font-semibold px-4 py-2 mt-4 hover:brightness-75 rounded">Cancelar
                            </button>
                            <button
                                disabled={!isValid}
                                className="bg-blue-700 text-white font-semibold px-4 py-2 mt-4 hover:brightness-75 rounded flex items-center gap-2 disabled:cursor-not-allowed disabled:bg-blue-500" >
                                {load ? (<Image src={Load} objectFit={"contain"} width={20} height={15} />) : (<FaSave />)}
                                <span>Salvar</span>
                            </button>
                        </div>
                    </form>

                    <div className='mt-4 text-end px-4 py-2 max-w-6xl  mx-auto bg-white rounded'>
                        <div className="flex justify-between items-center">
                            <input
                                onChange={(e) => setSearch(e.target.value)}
                                type="search"
                                className="w-full lg:w-1/3 rounded shadow"
                                placeholder="Pesquise pelo nome da obra" />
                            <span className='font-semibold text-lg hidden lg:flex'>Lista de Obras</span>
                        </div>
                        <table className='table w-full text-center mt-2 animate__animated animate__fadeIn'>
                            <thead>
                                <tr className='flex justify-between bg-gray-200 px-4 py-2 rounded'>
                                    <th className='text-gray-600 font-bold w-1/5'>ID</th>
                                    <th className='text-gray-600 font-bold w-1/5 '>Obra</th>
                                    <th className='text-gray-600 font-bold w-1/5'>Encarregado</th>
                                    <th className='text-gray-600 font-bold w-1/5'>Estado</th>
                                    <th className='text-gray-600 font-bold w-1/5'>Editar</th>
                                    <th className='text-gray-600 font-bold w-1/5'>Apagar</th>
                                </tr>
                            </thead>
                            <tbody className=''>

                                {

                                    (obras && obras.length && search === '') ? obras.map((obra) => (
                                        <tr key={obra.id} className='flex justify-between border shadow-md mt-4 px-4 py-2'>
                                            <td className="w-1/5 ">{obra.id}</td>
                                            <td className="w-1/5 ">{obra.obra_nome}</td>
                                            <td className="w-1/5 ">{obra.encarregado_id.nome}</td>
                                            <td className="w-1/5 ">{obra.estado}</td>
                                            <td className="w-1/5  flex justify-center items-center">
                                                <button
                                                    onClick={() => handleEditObra(obra)}
                                                    className="hover:brightness-75"
                                                    title="Editar">
                                                    <FaEdit />
                                                </button>
                                            </td>
                                            <td className="w-1/5  flex justify-center items-center">
                                                <button
                                                    onClick={() => { setShowQuestionAlert(true); setIdObra(obra.id) }}
                                                    className="hover:brightness-75"
                                                    title="Apagar">
                                                    <FaTrash />
                                                </button>
                                            </td>
                                        </tr>
                                    )) : filteredObras.map((filteredObra) => (
                                        <tr key={filteredObra.id} className='flex justify-between border shadow-md mt-4 px-4 py-2'>
                                            <td className="w-1/5 ">{filteredObra.id}</td>
                                            <td className="w-1/5 ">{filteredObra.obra_nome}</td>
                                            <td className="w-1/5 ">{filteredObra.encarregado_id.nome}</td>
                                            <td className="w-1/5 ">{filteredObra.estado}</td>
                                            <td className="w-1/5  flex justify-center items-center">
                                                <button
                                                    onClick={() => handleEditObra(filteredObra)}
                                                    className="hover:brightness-75"
                                                    title="Editar">
                                                    <FaEdit />
                                                </button>
                                            </td>
                                            <td className="w-1/5  flex justify-center items-center">
                                                <button
                                                    onClick={() => { setShowQuestionAlert(true); setIdObra(filteredObra.id) }}
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
                </div>
            </main>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(
    (store) =>
        async (context: GetServerSidePropsContext) => {

            //  const cookie = nookies.get(context);

            const obrasDispatch: any = await (await store.dispatch(fetchObra()));

            const encarregadosDispatch: any = await store.dispatch(fetchEncarregados());

            const obras = obrasDispatch.payload
            const encarregados = encarregadosDispatch.payload

            //  if (!cookie.USER_LOGGED_ARMAZEM) return { props: {}, redirect: { destination: '/', permanent: false } }

            return {
                props: {
                    obras,
                    encarregados
                },
            };
        }
);



export default Obra
