import { useState } from "react"
import dynamic from "next/dynamic"
import Head from "next/head"

import Header from "../components/Header"
import SiderBar from "../components/SiderBar"

import { FaPrint, FaEdit, FaTrash } from 'react-icons/fa'

import Load from '../assets/load.gif'
import Image from "next/image"
import { GetServerSideProps, GetServerSidePropsContext } from "next"
import { wrapper } from "../redux/store"
import { fetchEsgotar } from "../redux/slices/armGeralSlice"
import nookies from 'nookies'

const SweetAlert2 = dynamic(() => import('react-sweetalert2'), { ssr: false })
type EquipamentoType = {
    id: number;
    descricao: string;
    duracao_id: number;
    classificacao_id: number;
    data: string;
    stock_emergencia: number
}
type ArmType = {
    id: number;
    equipamento_id: EquipamentoType;
    quantidade_entrada: number;
    data_aquisicao: string
}
type EsgotarProps = {
    esgotar: ArmType[]
}

const Esgotar = ({ esgotar }: EsgotarProps) => {

    console.log(esgotar)

    const [hideSideBar, setHideSideBar] = useState(false)
    const [load, setLoad] = useState(false)


    //Estados dos sweetAlerts
    const [showConfirmAlert, setShowConfirmAlert] = useState(false)
    const [showErrorAlert, setShowErrorAlert] = useState(false)
    const [showQuestionAlert, setShowQuestionAlert] = useState(false)

    return (
        <div className='flex'>
            <SiderBar itemActive="esgotar" />
            <main className='flex-1 space-y-6'>
                <div>
                    <Header />
                </div>
                <Head>
                    <title>SCA | À esgostar</title>
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

                <div className='overflow-auto max-h-[85vh] max-w-4xl mx-auto overflow-hide-scroll-bar'>
                    <div className="bg-white shadow max-w-6xl mx-auto flex flex-col space-y-6 p-6 rounded mt-5 animate__animated animate__fadeIn">
                        <h2 className="divide-x-2 h-5 text-2xl font-semibold">À esgotar</h2>
                        <div className="border w-1/12 border-gray-700 ml-4"></div>
                        <div className="flex gap-5">
                            <input type="search" placeholder="Pesquise por equipamento" className="w-full rounded shadow" />

                        </div>
                        <div className=" ml-auto">
                            <button className="bg-gray-200 text-gray-600 px-4 py-2 shadow font-bold flex items-center gap-2 hover:brightness-75">
                                <FaPrint />
                                <span>Imprimir</span>
                            </button>
                        </div>
                    </div>

                    <div className='mt-8 text-end px-4 py-2 max-w-6xl  mx-auto bg-white rounded'>
                        <span className='font-semibold text-lg'>Lista geral à esgotar</span>
                        <table className='table w-full text-center mt-2 animate__animated animate__fadeIn'>
                            <thead>
                                <tr className='flex justify-between bg-gray-200 px-4 py-2 rounded'>
                                    <th className='text-gray-600 font-bold w-1/5'>ID</th>
                                    <th className='text-gray-600 font-bold w-1/5 '>Descrição</th>
                                    <th className='text-gray-600 font-bold w-1/5'>Classificação</th>
                                    <th className='text-gray-600 font-bold w-1/5'>Tempo de duração</th>
                                    <th className='text-gray-600 font-bold w-1/5'>Quantidade</th>
                                    <th className='text-gray-600 font-bold w-1/5'>Data de Compra</th>
                                    {/**
                                  * <th className='text-gray-600 font-bold w-1/5'>Editar</th>
                                    <th className='text-gray-600 font-bold w-1/5'>Apagar</th>
                                  */}
                                </tr>
                            </thead>
                            <tbody className=''>
                                <tr className='flex justify-between border shadow-md mt-4 px-4 py-2'>
                                    <td className="w-1/5 ">1</td>
                                    <td className="w-1/5 ">Cimento Cola</td>
                                    <td className="w-1/5 ">Material</td>
                                    <td className="w-1/5 ">uso imediato</td>
                                    <td className="w-1/5 ">2</td>
                                    <td className="w-1/5 ">22-08-2022</td>
                                    {/**
                                  *    <td className="w-1/5  flex justify-center items-center">
                                        <button className="hover:brightness-75" title="Editar">
                                            <FaEdit />
                                        </button>
                                    </td>
                                    <td className="w-1/5  flex justify-center items-center">
                                        <button
                                            onClick={() => setShowQuestionAlert(true)}
                                            className="hover:brightness-75" title="Apagar">
                                            <FaTrash />
                                        </button>
                                    </td>
                                  */}
                                </tr>
                                <tr className='flex justify-between border shadow-md mt-4 px-4 py-2'>
                                    <td className="w-1/5 ">2</td>
                                    <td className="w-1/5 ">Martelo de burracha</td>
                                    <td className="w-1/5 ">Ferramenta</td>
                                    <td className="w-1/5 ">2 à 5 anos</td>
                                    <td className="w-1/5 ">3</td>
                                    <td className="w-1/5 ">22-08-2022</td>
                                    {/**
                                   *   <td className="w-1/5  flex justify-center items-center">
                                        <button className="hover:brightness-75" title="Editar">
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
                                   */}
                                </tr>
                                <tr className='flex justify-between border shadow-md mt-4 px-4 py-2'>
                                    <td className="w-1/5 ">3</td>
                                    <td className="w-1/5 ">Capacete</td>
                                    <td className="w-1/5 ">EPI</td>
                                    <td className="w-1/5 ">0.5 à 1 ano</td>
                                    <td className="w-1/5 ">5</td>
                                    <td className="w-1/5 ">24-08-2022</td>
                                    {/**
                                *      <td className="w-1/5  flex justify-center items-center">
                                        <button className="hover:brightness-75" title="Editar">
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
                                */}
                                </tr>

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

            const cookie = nookies.get(context);
            //const equipamentoDispatch = await store.dispatch(fetchEquipamento());
            const esgotarDispatch: any = await store.dispatch(fetchEsgotar())

            if (!cookie.USER_LOGGED_ARMAZEM) {
                // If no user, redirect to index.
                return { props: {}, redirect: { destination: '/', permanent: false } }
            }
            // const equipamentos = equipamentoDispatch.payload
            const esgotar = esgotarDispatch.payload

            return {
                props: {
                    esgotar
                },
            };
        }
);

export default Esgotar
