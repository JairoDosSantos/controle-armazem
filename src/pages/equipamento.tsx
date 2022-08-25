import React, { useState } from 'react'
import Image from 'next/image'
import Head from 'next/head'
import dynamic from 'next/dynamic'

//Imagens
import Load from '../assets/load.gif'

//Componentes internos
import Header from '../components/Header'
import AddObra from '../components/equipamento/AddObra'
import DevolverAMG from '../components/equipamento/DevolverAMG'
import EditarModal from '../components/equipamento/EditModal'
import SiderBar from '../components/SiderBar'
import RemoveArmGeralParaObra from '../components/equipamento/RemoveArmGeralParaObra'

//Componentes Externos
import { FaEdit, FaSave, FaTrash } from 'react-icons/fa'
const SweetAlert2 = dynamic(() => import('react-sweetalert2'), { ssr: false })

const Equipamento = () => {

    const [hideSideBar, setHideSideBar] = useState(false)
    const [load, setLoad] = useState(false)

    const [isOpenRemove, setIsOpenRemove] = useState(false)
    const [isOpenAddObra, setIsOpenAddObra] = useState(false)
    const [isOpenRemoveObraAddAMG, setIsOpenRemoveObraAddAMG] = useState(false)

    const [showEditModal, setShowEditModal] = useState(false)


    //Estados dos sweetAlerts
    const [showConfirmAlert, setShowConfirmAlert] = useState(false)
    const [showErrorAlert, setShowErrorAlert] = useState(false)
    const [showQuestionAlert, setShowQuestionAlert] = useState(false)

    return (
        <div className='flex'>

            <SiderBar itemActive="equipamento" hideSideBar={hideSideBar} />
            <main className='flex-1 space-y-6'>
                <div>
                    <Header hideSideBar={hideSideBar} setHideSideBar={setHideSideBar} />
                </div>
                <Head>
                    <title>SCA | Equipamento</title>
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

                <div className='overflow-auto max-h-[85vh] max-w-6xl mx-auto overflow-hide-scroll-bar'>
                    <EditarModal isOpen={showEditModal} setIsOpen={setShowEditModal} />
                    <div className="flex gap-4 w-full bg-white p-5">

                        <button
                            onClick={() => setIsOpenRemoveObraAddAMG(true)}
                            type="button"
                            className="bg-blue-700 text-white font-bold px-4 py-2 hover:brightness-75">Devolver ao armazem geral
                        </button>
                        <DevolverAMG isOpen={isOpenRemoveObraAddAMG} setIsOpen={setIsOpenRemoveObraAddAMG} />
                        <button
                            onClick={() => setIsOpenAddObra(true)}
                            type="button"
                            className="bg-gray-700 text-white font-bold px-4 py-2 hover:brightness-75">Add armazem Obra
                        </button>
                        {/** Aqui o equipamento será cadastrado directamente ao armazem da obra */}
                        <AddObra isOpen={isOpenAddObra} setIsOpen={setIsOpenAddObra} />
                        <button
                            onClick={() => setIsOpenRemove(true)}
                            type="button"
                            className="bg-gray-200 text-gray-600 font-bold px-4 py-2 hover:brightness-75">Tirar do armazem geral para Obra
                        </button>
                        {/** Aqui o equipamento será diminuído do armazem para ser cadastrado ao armazem da obra */}
                        <RemoveArmGeralParaObra isOpen={isOpenRemove} setIsOpen={setIsOpenRemove} />

                    </div>

                    <form className="bg-white shadow max-w-2xl mx-auto flex flex-col space-y-6 p-6 rounded mt-10 animate__animated animate__fadeIn">
                        <h2 className="divide-x-2 h-5 text-2xl font-semibold">Cadastro de Eq. no armazem geral</h2>
                        <div className="border w-1/5 border-gray-700 ml-4"></div>
                        <div className="flex gap-5">
                            <input type="text" placeholder="Descrição" className="w-1/2 rounded shadow" />
                            <select id="" className="w-1/2 rounded shadow cursor-pointer" >
                                <option value="#">Classsificação</option>
                                <option value="#">EPI</option>
                                <option value="#">Material</option>
                                <option value="#">Ferramenta</option>
                            </select>

                        </div>
                        <div className="flex gap-5">
                            <select id="" className="w-1/2 rounded shadow cursor-pointer" >
                                <option value="#">Tempo de duração</option>
                                <option value="#">0.5 à 1 ano</option>
                                <option value="#">1 à 2 anos</option>
                                <option value="#">2 à 3 anos</option>
                            </select>
                            <input
                                type={'number'}
                                defaultValue={0}
                                placeholder="Quantidade"
                                className="w-1/2 rounded shadow"
                                min={0}
                            />

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
                        <span className='font-semibold text-lg'>Lista de Equipamentos arm. geral</span>
                        <table className='table w-full text-center mt-2 animate__animated animate__fadeIn'>
                            <thead>
                                <tr className='flex justify-between bg-gray-200 px-4 py-2 rounded'>
                                    <th className='text-gray-600 font-bold w-1/5'>ID</th>
                                    <th className='text-gray-600 font-bold w-1/5 '>Descrição</th>
                                    <th className='text-gray-600 font-bold w-1/5'>Classificação</th>
                                    <th className='text-gray-600 font-bold w-1/5'>Tempo de duração</th>
                                    <th className='text-gray-600 font-bold w-1/5'>Quantidade</th>
                                    <th className='text-gray-600 font-bold w-1/5'>Data de Compra</th>
                                    <th className='text-gray-600 font-bold w-1/5'>Editar</th>
                                    <th className='text-gray-600 font-bold w-1/5'>Apagar</th>
                                </tr>
                            </thead>
                            <tbody className=''>
                                <tr className='flex justify-between border shadow-md mt-4 px-4 py-2'>
                                    <td className="w-1/5 ">1</td>
                                    <td className="w-1/5 ">Cimento Cola</td>
                                    <td className="w-1/5 ">Material</td>
                                    <td className="w-1/5 ">uso imediato</td>
                                    <td className="w-1/5 ">30</td>
                                    <td className="w-1/5 ">22-08-2022</td>
                                    <td className="w-1/5  flex justify-center items-center">
                                        <button
                                            onClick={() => setShowEditModal(true)}
                                            className="hover:brightness-75" title="Editar">
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
                                    <td className="w-1/5 ">Ferramenta</td>
                                    <td className="w-1/5 ">2 à 5 anos</td>
                                    <td className="w-1/5 ">3</td>
                                    <td className="w-1/5 ">22-08-2022</td>
                                    <td className="w-1/5  flex justify-center items-center">
                                        <button
                                            onClick={() => setShowEditModal(true)}
                                            className="hover:brightness-75" title="Editar">
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
                                    <td className="w-1/5 ">Capacete</td>
                                    <td className="w-1/5 ">EPI</td>
                                    <td className="w-1/5 ">0.5 à 1 ano</td>
                                    <td className="w-1/5 ">5</td>
                                    <td className="w-1/5 ">24-08-2022</td>
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

export default Equipamento
