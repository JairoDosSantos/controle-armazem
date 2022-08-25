import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'

//Componentes Externos
import { FaEdit, FaSave, FaTrash } from 'react-icons/fa'
const SweetAlert2 = dynamic(() => import('react-sweetalert2'), { ssr: false })

//Componentes Internos
import Header from '../components/Header'
import SiderBar from '../components/SiderBar'

//Imagens
import Load from '../assets/load.gif'
import EditarModal from '../components/encarregado/EditarModal'
import Head from 'next/head'

const Encarregado = () => {

    const [hideSideBar, setHideSideBar] = useState(false)
    const [load, setLoad] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)

    //Estados dos sweetAlerts
    const [showConfirmAlert, setShowConfirmAlert] = useState(false)
    const [showErrorAlert, setShowErrorAlert] = useState(false)
    const [showQuestionAlert, setShowQuestionAlert] = useState(false)

    return (
        <div className='flex'>
            <SiderBar itemActive="encarregado" hideSideBar={hideSideBar} />
            <main className='flex-1 space-y-6'>
                <div>
                    <Header hideSideBar={hideSideBar} setHideSideBar={setHideSideBar} />
                </div>

                <Head>
                    <title>SCA | Encarregado</title>
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


                {/** Modal para editar os encarregados */}

                <EditarModal isOpen={showEditModal} setIsOpen={setShowEditModal} />

                <div className='overflow-auto max-h-[85vh] max-w-6xl mx-auto overflow-hide-scroll-bar'>
                    <form className="bg-white shadow max-w-2xl mx-auto flex flex-col space-y-6 p-6 rounded mt-10 animate__animated animate__fadeIn">
                        <h2 className="divide-x-2 h-5 text-2xl font-semibold">Cadastro de Encarregado</h2>
                        <div className="border w-1/5 border-gray-700 ml-4"></div>
                        <div className="flex gap-5">
                            <input type="text" placeholder="Nome do Encarregado" className="w-1/2 rounded shadow" />
                            <input type="text" placeholder="Telefone" className="w-1/2 rounded shadow" />

                        </div>
                        <div className="flex gap-2 justify-end">
                            <button className="bg-gray-700 text-white  font-semibold px-4 py-2 mt-4 hover:brightness-75 rounded">Cancelar</button>
                            <button className="bg-blue-700 text-white font-semibold px-4 py-2 mt-4 hover:brightness-75 rounded flex items-center gap-2" >
                                {load ? (<Image src={Load} objectFit={"contain"} width={20} height={15} />) : (<FaSave />)}
                                <span>Salvar</span>
                            </button>
                        </div>
                    </form>

                    <div className='mt-4 text-end px-4 py-2 max-w-6xl  mx-auto bg-white rounded'>
                        <span className='font-semibold text-lg'>Lista de Encarregado</span>
                        <table className='table w-full text-center mt-2 animate__animated animate__fadeIn'>
                            <thead>
                                <tr className='flex justify-between bg-gray-200 px-4 py-2 rounded'>
                                    <th className='text-gray-600 font-bold w-1/5'>ID</th>
                                    <th className='text-gray-600 font-bold w-1/5 '>Nome</th>
                                    <th className='text-gray-600 font-bold w-1/5'>Telefone</th>
                                    <th className='text-gray-600 font-bold w-1/5'>Editar</th>
                                    <th className='text-gray-600 font-bold w-1/5'>Apagar</th>
                                </tr>
                            </thead>
                            <tbody className=''>
                                <tr className='flex justify-between border shadow-md mt-4 px-4 py-2'>
                                    <td className="w-1/5 ">1</td>
                                    <td className="w-1/5 ">Jairo dos Santos</td>
                                    <td className="w-1/5 ">+244 929-84-89-58</td>
                                    <td className="w-1/5  flex justify-center items-center">
                                        <button
                                            onClick={() => setShowEditModal(true)}
                                            className="hover:brightness-75"
                                            title="Editar">
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
                                </tr>
                                <tr className='flex justify-between border shadow-md mt-4 px-4 py-2'>
                                    <td className="w-1/5 ">2</td>
                                    <td className="w-1/5 ">Avelino Manuel</td>
                                    <td className="w-1/5 ">+244 928-30-80-96</td>
                                    <td className="w-1/5  flex justify-center items-center">
                                        <button
                                            onClick={() => setShowEditModal(true)}
                                            className="hover:brightness-75"
                                            title="Editar">
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
                                </tr>


                            </tbody>
                        </table>
                    </div>
                </div>


            </main>
        </div>
    )
}

export default Encarregado
