import { useState } from "react"
import Head from "next/head"

import Header from "../components/Header"
import SiderBar from "../components/SiderBar"

import { FaEdit, FaTrash, FaPrint } from 'react-icons/fa'


import dynamic from "next/dynamic"
import EditarModal from "../components/equipamento/EditModal"

const SweetAlert2 = dynamic(() => import('react-sweetalert2'), { ssr: false })


const Saida = () => {

    const [hideSideBar, setHideSideBar] = useState(false)
    const [load, setLoad] = useState(false)

    const [filtroPorObra, setFiltroPorObra] = useState(false)


    //Estados dos sweetAlerts
    const [showConfirmAlert, setShowConfirmAlert] = useState(false)
    const [showErrorAlert, setShowErrorAlert] = useState(false)
    const [showQuestionAlert, setShowQuestionAlert] = useState(false)


    const [showEditModal, setShowEditModal] = useState(false)

    //const { register, handleSubmit, watch, formState: { errors, isValid } } = useForm<FormValues>({ mode: 'onChange' });


    return (
        <div className='flex'>
            <SiderBar itemActive="saidas" hideSideBar={hideSideBar} />
            <main className='flex-1 space-y-6'>
                <div>
                    <Header hideSideBar={hideSideBar} setHideSideBar={setHideSideBar} />
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
                <EditarModal isOpen={showEditModal} setIsOpen={setShowEditModal} />
                <div className='overflow-auto max-h-[85vh] max-w-6xl mx-auto overflow-hide-scroll-bar'>
                    <div className="bg-white shadow max-w-6xl mx-auto flex flex-col space-y-6 p-6 rounded mt-5 animate__animated animate__fadeIn">
                        <h2 className=" h-5 text-2xl font-semibold">Saídas do armazem geral</h2>
                        <div className="border w-1/5 border-gray-700 ml-4"></div>
                        <div className="ml-auto flex gap-2 -mt-4">
                            <div>
                                <label htmlFor="ferramenta" className="bg-white">Todas&nbsp;</label>
                                <input
                                    defaultChecked={true}
                                    onClick={() => setFiltroPorObra(false)}
                                    type={"radio"}
                                    name='classificacao'
                                    id='ferramenta'
                                    className="cursor-pointer" />
                            </div>
                            <div>
                                <label htmlFor="material" className="bg-white">Por obra&nbsp;</label>
                                <input
                                    onClick={() => setFiltroPorObra(true)}

                                    type={"radio"}
                                    name='classificacao'
                                    id='material'
                                    className="cursor-pointer" />
                            </div>
                        </div>
                        <div className="flex gap-5">
                            {/**    <input type="search" placeholder="Pesquise pelo equipamento" className="w-full rounded shadow" /> */}
                            {
                                filtroPorObra && (
                                    <select
                                        className='rounded shadow w-full cursor-pointer'>
                                        <option value="#" className='text-gray-400'>Selecione a Obra</option>
                                        <option value={1}>Sinse Kilamba</option>
                                        <option value={2}>Sinse Maianga</option>
                                        <option value={3}>Hotel Académico</option>
                                    </select>
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
                        <span className='font-semibold text-lg'>Relatório de saídas</span>
                        <table className='table w-full text-center mt-2 animate__animated animate__fadeIn'>
                            <thead>
                                <tr className='flex justify-between bg-gray-200 px-4 py-2 rounded'>
                                    <th className='text-gray-600 font-bold w-1/5'>ID</th>
                                    <th className='text-gray-600 font-bold w-1/5 '>Descrição</th>
                                    <th className='text-gray-600 font-bold w-1/5'>Obra</th>
                                    <th className='text-gray-600 font-bold w-1/5'>Quantidade tirada</th>
                                    <th className='text-gray-600 font-bold w-1/5'>Data de saída</th>
                                    <th className='text-gray-600 font-bold w-1/5'>Data de Compra</th>
                                    <th className='text-gray-600 font-bold w-1/5'>Editar</th>
                                    <th className='text-gray-600 font-bold w-1/5'>Apagar</th>
                                </tr>
                            </thead>
                            <tbody className=''>
                                <tr className='flex justify-between border shadow-md mt-4 px-4 py-2'>
                                    <td className="w-1/5 ">1</td>
                                    <td className="w-1/5 ">Cimento Cola</td>
                                    <td className="w-1/5 ">Sinse Kilamba</td>
                                    <td className="w-1/5 ">4</td>
                                    <td className="w-1/5 ">25-08-2022</td>
                                    <td className="w-1/5 ">22-08-2022</td>
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
                                    <td className="w-1/5 ">Martelo de burracha</td>
                                    <td className="w-1/5 ">Sinse Maianga</td>
                                    <td className="w-1/5 ">1</td>
                                    <td className="w-1/5 ">26-08-2022</td>
                                    <td className="w-1/5 ">22-08-2022</td>
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

export default Saida