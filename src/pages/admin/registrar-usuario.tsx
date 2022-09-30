import React, { useState } from 'react'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'

//Componentes Externos
import { SubmitHandler, useForm } from 'react-hook-form'
import { FaEdit, FaSave, FaTrash } from 'react-icons/fa'
import { useDispatch } from 'react-redux'
const SweetAlert2 = dynamic(() => import('react-sweetalert2'), { ssr: false })
import nookies from 'nookies'

//Componentes Internos
import Header from '../../components/Header'
import SiderBar from '../../components/SiderBar'
import EditarModal from '../../components/usuario/EditarModal'
import { wrapper } from '../../redux/store'

//Imagens
import Load from '../../assets/load.gif'
import { deleteUsuario, fetchUsuarios, insertUsuario } from '../../redux/slices/usuarioSlice'
import api from '../../services/api'

//Tipagem do formulário
type UsuarioType = {
    id: number;
    nome: string;
    permissao: string;
    email: string;
    password: string
}

type UsuarioProps = {
    usuarios: UsuarioType[]
}

const RegistrarUsuario = ({ usuarios }: UsuarioProps) => {

    const [idUsuario, setIdUsuario] = useState(0)
    const [search, setSearch] = useState('')
    const [hideSideBar, setHideSideBar] = useState(false)
    const [load, setLoad] = useState(false)
    const [loadTable, setLoadTable] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [usuarioObject, setUsuarioObject] = useState({} as UsuarioType)
    //Estados dos sweetAlerts
    const [showConfirmAlert, setShowConfirmAlert] = useState(false)
    const [showErrorAlert, setShowErrorAlert] = useState(false)
    const [showQuestionAlert, setShowQuestionAlert] = useState(false)

    const { register, handleSubmit, reset, formState: { errors, isValid } } = useForm<UsuarioType>({ mode: 'onChange' });
    const dispatch = useDispatch<any>();
    const router = useRouter()

    const handleEditarUsuario = (Usuario: UsuarioType) => {
        setUsuarioObject(Usuario)
        setShowEditModal(true)
    }

    const onSubmit: SubmitHandler<UsuarioType> = async (data) => {
        try {
            setLoad(true)

            const response = await api.post('/register', {
                email: data.email,
                password: data.password,
                permissao: data.permissao
            })
            const { error, user } = response.data

            if (error) {
                setLoad(false)
                setShowErrorAlert(true)
                return
            }

            const resultDispatch = await dispatch(insertUsuario({ nome: data.nome, permissao: data.permissao, email: data.email, password: data.password }))

            setLoad(false)

            if (resultDispatch.payload) {

                setShowConfirmAlert(true)

            } else {

                setShowErrorAlert(true)
            }
        } catch (error) {
            setLoad(false)
        }

    }

    const handleDeleteUsuario = async () => {
        setLoadTable(true)
        const resultDispatch = await dispatch(deleteUsuario(idUsuario))
        setLoadTable(false)
        if (resultDispatch.payload) {
            setShowConfirmAlert(true)
        } else {
            setShowErrorAlert(true)
        }
    }

    const usuariosFiltrados = search && usuarios ? usuarios.filter((usuario) => usuario.nome.toLowerCase().includes(search.toLowerCase())) : []

    return (
        <div className='flex'>
            <SiderBar itemActive="usuario" />
            <main className='flex-1 space-y-6 overflow-x-hidden'>
                <div>
                    <Header />
                </div>

                <Head>
                    <title>SCA | Registrar Usuário</title>
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
                    onConfirm={handleDeleteUsuario}
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
                    <EditarModal usuarioData={usuarioObject} isOpen={showEditModal} setIsOpen={setShowEditModal} />
                )}

                <div className='overflow-auto max-h-[85vh] max-w-4xl mx-auto overflow-hide-scroll-bar'>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="bg-white shadow max-w-2xl mx-auto flex flex-col space-y-6 p-6 rounded mt-10 animate__animated animate__fadeIn">
                        <h2 className="divide-x-2 h-5 text-2xl font-semibold">Cadastro de usuário</h2>
                        <div className="border w-1/5 border-gray-700 ml-4"></div>
                        <div className='flex flex-col lg:flex-row gap-2 justify-center align-center'>
                            <input
                                type="text"
                                className='rounded shadow  w-full lg:w-1/2'
                                placeholder='Nome do usuário *'
                                {...register('nome', {
                                    required: { message: "Por favor, introduza o nome do usuário.", value: true },
                                    minLength: { message: "Preenchimento obrigatório!", value: 1 },
                                })}
                            />
                            <input
                                required
                                type="email"
                                className='rounded shadow w-full lg:w-1/2'
                                placeholder='exemplo@gmail.com *'
                                {...register('email', {
                                    required: { message: "Por favor, introduza o email do usuário.", value: true },

                                })}
                            />
                        </div>
                        <div className='flex flex-col lg:flex-row gap-2 justify-center align-center'>
                            <input
                                type={'password'}
                                className='rounded shadow w-full lg:w-1/2'
                                placeholder='**********'
                                {...register('password', {
                                    required: { message: "Por favor, introduza a senha do usuário.", value: true },
                                    minLength: { message: "Preenchimento obrigatório!", value: 1 },
                                })}
                            />
                            <select
                                id="permissao"
                                {...register('permissao', {
                                    required: { message: "Por favor, introduza a permissão do usuário.", value: true },
                                    minLength: { message: "Preenchimento obrigatório!", value: 1 },
                                })}
                                className="w-full lg:w-1/2 rounded shadow cursor-pointer"
                            >

                                <option value='' className='text-gray-400' >Selecione o tipo de permissão</option>

                                <option
                                    value='Administrador'>Administrador
                                </option>
                                <option
                                    value='Administrador'>Normal
                                </option>

                            </select>
                        </div>
                        <div className="flex gap-2 justify-end">
                            <button
                                title='Limpar os dados do formulário'
                                onClick={() => reset()}
                                className="bg-gray-700 text-white  font-semibold px-4 py-2 mt-4 hover:brightness-75 rounded">Cancelar
                            </button>
                            <button
                                disabled={!isValid}
                                title='Salvar usuário'
                                className="bg-blue-700 text-white font-semibold px-4 py-2 mt-4 hover:brightness-75 rounded flex items-center gap-2 disabled:cursor-not-allowed disabled:bg-blue-500" >
                                {load ? (<Image src={Load} objectFit={"contain"} width={20} height={15} />) : (<FaSave />)}
                                <span>Salvar</span>
                            </button>
                        </div>
                    </form>


                </div>
                <div className='mt-4 text-end px-4 py-2 max-w-sm lg:max-w-6xl  mx-auto bg-white rounded overflow-x-auto relative'>
                    <div className='absolute top-32  left-[33rem] z-50'>
                        {loadTable && (<Image src={Load} objectFit={"contain"} width={90} height={75} />)}
                    </div>
                    <div className='flex items-center justify-between'>
                        <input
                            onChange={(e) => setSearch(e.target.value)}
                            type="search"
                            className="w-full lg:w-1/3 rounded shadow "
                            placeholder="Pesq. pelo nome do usuário" />
                        <span className='font-semibold text-lg hidden lg:flex'>Lista de Usuários do sistema</span>
                    </div>
                    <table className='table w-full text-center mt-2 animate__animated animate__fadeIn'>
                        <thead>
                            <tr className='flex justify-between bg-gray-200 px-4 py-2 rounded'>
                                <th className='text-gray-600 font-bold w-16'>ID</th>
                                <th className='text-gray-600 font-bold w-52 '>Nome</th>
                                <th className='text-gray-600 font-bold w-52 '>E-mail</th>
                                <th className='text-gray-600 font-bold w-52'>Permissão</th>
                                <th className='text-gray-600 font-bold w-20'>Editar</th>
                                <th className='text-gray-600 font-bold w-20'>Apagar</th>
                            </tr>
                        </thead>
                        <tbody className=''>
                            {
                                usuarios && usuarios.length && search === '' ? usuarios.map((usuario, index) => (
                                    <tr key={index}
                                        className='flex justify-between border shadow-md mt-4 px-4 py-2'>
                                        <td className="w-16 ">{usuario.id}</td>
                                        <td className="w-52 ">{usuario.nome}</td>
                                        <td className="w-52 ">{usuario.email}</td>
                                        <td className="w-52 ">{usuario.permissao}</td>
                                        <td className="w-20  flex justify-center items-center">
                                            <button
                                                onClick={() => handleEditarUsuario(usuario)}
                                                className="hover:brightness-75"
                                                title="Editar">
                                                <FaEdit />
                                            </button>
                                        </td>
                                        <td className="w-20  flex justify-center items-center">
                                            <button
                                                onClick={() => {
                                                    setShowQuestionAlert(true);
                                                    setIdUsuario(usuario.id)
                                                }}
                                                className="hover:brightness-75"
                                                title="Apagar">
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                )) : usuariosFiltrados.map((usuarioFiltered, index) => {
                                    return (
                                        <tr key={index}
                                            className='flex justify-between border shadow-md mt-4 px-4 py-2'>
                                            <td className="w-16 ">{usuarioFiltered.id}</td>
                                            <td className="w-52 ">{usuarioFiltered.nome}</td>
                                            <td className="w-52 ">{usuarioFiltered.email}</td>
                                            <td className="w-52 ">{usuarioFiltered.permissao}</td>
                                            <td className="w-20  flex justify-center items-center">
                                                <button
                                                    onClick={() => handleEditarUsuario(usuarioFiltered)}
                                                    className="hover:brightness-75"
                                                    title="Editar">
                                                    <FaEdit />
                                                </button>
                                            </td>
                                            <td className="w-20  flex justify-center items-center">
                                                <button
                                                    onClick={() => {
                                                        setShowQuestionAlert(true);
                                                        setIdUsuario(usuarioFiltered.id)
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

            const cookie = nookies.get(context);
            if (!cookie.USER_LOGGED_ARMAZEM) return { props: {}, redirect: { destination: '/', permanent: false } }

            const usuariosDispatch: any = await store.dispatch(fetchUsuarios());

            const usuarios: any = usuariosDispatch.payload

            return {
                props: {
                    usuarios
                },
            };
        }
);

export default RegistrarUsuario
