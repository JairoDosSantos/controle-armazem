import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'

//Componentes Externos
import { FaEdit, FaSave, FaTrash } from 'react-icons/fa'
const SweetAlert2 = dynamic(() => import('react-sweetalert2'), { ssr: false })
import nookies from 'nookies'

//Componentes Internos
import Header from '../../components/Header'
import SiderBar from '../../components/SiderBar'

//Imagens
import Load from '../../assets/load.gif'
import EditarModal from '../../components/encarregado/EditarModal'
import Head from 'next/head'
import { SubmitHandler, useForm } from 'react-hook-form'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { wrapper } from '../../redux/store'
import { deleteEncarregado, fetchEncarregados, insertEncarregado } from '../../redux/slices/encarregadoSlice'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/router'


//Tipagem do formulário
type FormValues = {
    id: number;
    nome: string;
    telefone: number;
}
type EncarregadoType = {
    encarregados: FormValues[]
}
const Encarregado = ({ encarregados }: EncarregadoType) => {

    const [idEncarregado, setIdEncarregado] = useState(0)
    const [search, setSearch] = useState('')
    const [hideSideBar, setHideSideBar] = useState(false)
    const [load, setLoad] = useState(false)
    const [loadTable, setLoadTable] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [encarregadoObject, setEncarregadoObject] = useState({} as FormValues)
    //Estados dos sweetAlerts
    const [showConfirmAlert, setShowConfirmAlert] = useState(false)
    const [showErrorAlert, setShowErrorAlert] = useState(false)
    const [showQuestionAlert, setShowQuestionAlert] = useState(false)

    const { register, handleSubmit, reset, formState: { errors, isValid } } = useForm<FormValues>({ mode: 'onChange' });
    const dispatch = useDispatch<any>();
    const router = useRouter()


    const handleEditEncarregado = (Encarregado: FormValues) => {
        setEncarregadoObject(Encarregado)
        setShowEditModal(true)
    }

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        setLoad(true)
        const resultDispatch = await dispatch(insertEncarregado({ nome: data.nome, telefone: data.telefone.toString() }))
        setLoad(false)

        if (resultDispatch.payload) {
            setShowConfirmAlert(true)

        } else {
            setShowErrorAlert(true)
        }

    }

    const handleDeleteEncarregado = async () => {
        setLoadTable(true)
        const resultDispatch = await dispatch(deleteEncarregado(idEncarregado))
        setLoadTable(false)
        if (resultDispatch.payload) {
            setShowConfirmAlert(true)
        } else {
            setShowErrorAlert(true)
        }
    }

    const filteredEncarregados = search && encarregados ? encarregados.filter((encarregado) => encarregado.nome.toLowerCase().includes(search.toLowerCase())) : []

    return (
        <div className='flex'>
            <SiderBar itemActive="encarregado" />
            <main className='flex-1 space-y-6 overflow-x-hidden'>
                <div>
                    <Header />
                </div>

                <Head>
                    <title>SCA | Encarregado</title>
                </Head>

                {/**Confirm alert**/}
                <SweetAlert2
                    backdrop={true}
                    show={showConfirmAlert}
                    title='Sucesso'
                    text='Operação efectuada  com sucesso!'
                    onConfirm={() => { setShowConfirmAlert(false); router.reload() }}
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
                    text='Ocorreu um erro ao efectuar a operação. Por favor, verifique se o encarregado já não está cadastrado no sistema!'
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
                    onConfirm={handleDeleteEncarregado}
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


                {/** Modal para editar os encarregados */}

                {showEditModal && (
                    <EditarModal encarregadoData={encarregadoObject} isOpen={showEditModal} setIsOpen={setShowEditModal} />
                )}

                <div className='overflow-auto max-h-[85vh] max-w-4xl mx-auto overflow-hide-scroll-bar'>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="bg-white shadow max-w-2xl mx-auto flex flex-col space-y-6 p-6 rounded mt-10 animate__animated animate__fadeIn">
                        <h2 className="divide-x-2 h-5 text-2xl font-semibold">Cadastro de Encarregado</h2>
                        <div className="border w-1/5 border-gray-700 ml-4"></div>
                        <div className="flex flex-col lg:flex-row gap-5">
                            <input
                                {
                                ...register('nome', {
                                    required: { message: "Por favor, introduza o nome do encarregado.", value: true },
                                    minLength: { message: "Preenchimento obrigatório!", value: 1 },
                                })
                                }
                                type="text" placeholder="Nome do Encarregado" className="w-full lg:w-1/2 rounded shadow" />
                            <input
                                {
                                ...register('telefone', {
                                    required: { message: "Por favor, introduza o telefone do encarregado.", value: true },
                                    minLength: { message: "Preenchimento obrigatório!", value: 1 },
                                })}
                                type="number"
                                placeholder="Telefone"
                                className="w-full lg:w-1/2 rounded shadow" />

                        </div>
                        <div className="flex gap-2 justify-end">
                            <button
                                type={'reset'}
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


                </div>
                <div className='mt-4 text-end px-4 py-2 mx-auto max-w-sm lg:max-w-6xl bg-white rounded relative overflow-x-auto'>
                    <div className='absolute top-32  left-[33rem] z-50'>
                        {loadTable && (<Image src={Load} objectFit={"contain"} width={90} height={75} />)}
                    </div>
                    <div className='flex items-center justify-between'>
                        <input
                            onChange={(e) => setSearch(e.target.value)}
                            type="search"
                            className="w-full lg:w-1/3 rounded shadow "
                            placeholder="Pesq. pelo nome do Encarregado" />
                        <span className='font-semibold text-lg hidden lg:flex'>Lista de Encarregado</span>
                    </div>
                    <table className='table w-full text-center mt-2 animate__animated animate__fadeIn'>
                        <thead>
                            <tr className='flex justify-between bg-gray-200 px-4 py-2 rounded'>
                                <th className='text-gray-600 font-bold w-16'>ID</th>
                                <th className='text-gray-600 font-bold w-52 '>Nome</th>
                                <th className='text-gray-600 font-bold w-52'>Telefone</th>
                                <th className='text-gray-600 font-bold w-20'>Editar</th>
                                <th className='text-gray-600 font-bold w-20'>Apagar</th>
                            </tr>
                        </thead>
                        <tbody className=''>
                            {
                                encarregados && encarregados.length && search === '' ? encarregados.map((encarregado, index) => (
                                    <tr key={index}
                                        className='flex justify-between border shadow-md mt-4 px-4 py-2'>
                                        <td className="w-16 ">{encarregado.id}</td>
                                        <td className="w-52 ">{encarregado.nome}</td>
                                        <td className="w-52 ">{encarregado.telefone}</td>
                                        <td className="w-20  flex justify-center items-center">
                                            <button
                                                onClick={() => handleEditEncarregado(encarregado)}
                                                className="hover:brightness-75"
                                                title="Editar">
                                                <FaEdit />
                                            </button>
                                        </td>
                                        <td className="w-20  flex justify-center items-center">
                                            <button
                                                onClick={() => {
                                                    setShowQuestionAlert(true);
                                                    setIdEncarregado(encarregado.id)
                                                }}
                                                className="hover:brightness-75"
                                                title="Apagar">
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                )) : filteredEncarregados.map((encarregadoFiltered, index) => {
                                    return (
                                        <tr key={index}
                                            className='flex justify-between border shadow-md mt-4 px-4 py-2'>
                                            <td className="w-16 ">{encarregadoFiltered.id}</td>
                                            <td className="w-52 ">{encarregadoFiltered.nome}</td>
                                            <td className="w-52 ">{encarregadoFiltered.telefone}</td>
                                            <td className="w-20  flex justify-center items-center">
                                                <button
                                                    onClick={() => handleEditEncarregado(encarregadoFiltered)}
                                                    className="hover:brightness-75"
                                                    title="Editar">
                                                    <FaEdit />
                                                </button>
                                            </td>
                                            <td className="w-20  flex justify-center items-center">
                                                <button
                                                    onClick={() => {
                                                        setShowQuestionAlert(true);
                                                        setIdEncarregado(encarregadoFiltered.id)
                                                    }}
                                                    className="hover:brightness-75"
                                                    title="Apagar">
                                                    <FaTrash />
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })
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

            //  const cookie = nookies.get(context);

            const encarregadosDispatch: any = await store.dispatch(fetchEncarregados());

            const encarregados: any = encarregadosDispatch.payload

            //if (!cookie.USER_LOGGED_ARMAZEM) return { props: {}, redirect: { destination: '/', permanent: false } }

            return {
                props: {
                    encarregados
                },
            };
        }
);

export default Encarregado
