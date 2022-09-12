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
import { FaSave, FaPlusCircle } from 'react-icons/fa'
import nookies from 'nookies'
import { useDispatch } from 'react-redux'
import { unwrapResult } from '@reduxjs/toolkit'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
const SweetAlert2 = dynamic(() => import('react-sweetalert2'), { ssr: false })


import AddNovoModal from '../components/equipamento/AddNovoModal'
import { SubmitHandler, useForm } from 'react-hook-form'
import { wrapper } from '../redux/store'
import { fetchEquipamento } from '../redux/slices/equipamentoSlice'
import EquipamentoAutoComplete from '../components/EquipamentoAutoComplete'
import { fetchClassificacao } from '../redux/slices/classificacaoSlice'
import { fetchDuracao } from '../redux/slices/duracaoSlice.ts'
import { fetchArmGeral, fetchOne, insertArmGeral, updateArmGeral } from '../redux/slices/armGeralSlice'
import { insertCompra } from '../redux/slices/compraSlice'



//Tipagem do formulário
type FormValues = {
    id: number;
    descricao_equipamento_id: number;
    quantidade: number;
    data_aquisicao: string;
    preco: number
}
type EquipamentoType = {
    id: number;
    descricao: string;
    duracao_id: number;
    classificacao_id: number;
    data: string
}
type DuracaoType = {
    id: number;
    tempo: string;

}
type ClassificacaoType = {
    id: number;
    tipo: string;

}
type ArmGeralType = {
    id: number;
    equipamento_id: EquipamentoType;
    quantidade: number;
    data_aquisicao: string
}

type EquipamentoProps = {
    equipamentos: EquipamentoType[];
    duracao: DuracaoType[];
    classificacao: ClassificacaoType[]
    armazem: ArmGeralType[]
}

const Equipamento = ({ equipamentos, duracao, classificacao, armazem }: EquipamentoProps) => {

    const [hideSideBar, setHideSideBar] = useState(false)
    const [load, setLoad] = useState(false)

    const [isOpenRemove, setIsOpenRemove] = useState(false)
    const [isOpenAddObra, setIsOpenAddObra] = useState(false)
    const [isOpenRemoveObraAddAMG, setIsOpenRemoveObraAddAMG] = useState(false)
    const [isOpenAddNovoModal, setIsOpenAddNovoModal] = useState(false)
    const [armazemObject, setAmazemObject] = useState<ArmGeralType>({} as ArmGeralType)
    const [showEditModal, setShowEditModal] = useState(false)

    const [idEquipamento, setIdEquipamento] = useState(0)
    const dispatch = useDispatch<any>()
    //Estados dos sweetAlerts
    const [showConfirmAlert, setShowConfirmAlert] = useState(false)
    const [showErrorAlert, setShowErrorAlert] = useState(false)
    const [showQuestionAlert, setShowQuestionAlert] = useState(false)

    const { register, handleSubmit, reset, formState: { errors, isValid } } = useForm<FormValues>({ mode: 'onChange' });

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        setLoad(true)
        data.descricao_equipamento_id = idEquipamento;

        const resultDispatch = await dispatch(fetchOne(data.descricao_equipamento_id))
        const equipamentoQuantidade = unwrapResult(resultDispatch);

        if (equipamentoQuantidade.length > 0) {

            //Trecho de código acrescentado hoje 01-09-2022
            const comprasInsert = await dispatch(insertCompra({ data_compra: data.data_aquisicao, equipamento_id: data.descricao_equipamento_id, preco: data.preco, quantidade_comprada: data.quantidade }))

            if (!comprasInsert.payload) {
                setShowErrorAlert(true)
                return
            }

            //Insert nas Compras primeiro
            let qtd = Number(equipamentoQuantidade[0].quantidade) + Number(data.quantidade);

            const resultDispatchArmGeral = await dispatch(updateArmGeral({ ...equipamentoQuantidade[0], quantidade_entrada: qtd }))

            if (resultDispatchArmGeral.meta.arg) {
                setShowConfirmAlert(true)
            } else {
                setShowErrorAlert(true)
            }
        } else {
            //Insert nas Compras primeiro
            const resultDispatch = await dispatch(insertArmGeral({ equipamento_id: data.descricao_equipamento_id, quantidade_entrada: data.quantidade, data_aquisicao: data.data_aquisicao }))
            // const unwrapresultado = unwrapResult(resultDispatch)
            if (resultDispatch.meta.arg) {
                setShowConfirmAlert(true)
            } else {
                setShowErrorAlert(true)
            }
        }

        setLoad(false)
        reset()
    }
    const findDuracao = (id: number) => {
        const duration = (duracao && duracao.length) ? duracao.find((dur) => (dur.id === id)) : []

        return duration as DuracaoType
    }

    const findClassificacao = (id: number) => {
        const classification = (classificacao && classificacao.length) ? classificacao.find((classific) => (classific.id === id)) : []
        return classification as ClassificacaoType
    }

    const handleEdit = (armazem: ArmGeralType) => {
        setAmazemObject(armazem)
        setShowEditModal(true)
    }
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
                    text='Operação realizada com sucesso!'
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
                    text='Ocorreu um erro ao efectuar a operação. Por favor, verifique se o equipamento já não está cadastrado no sistema!'
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
                    {showEditModal && (<EditarModal data={armazemObject} isOpen={showEditModal} setIsOpen={setShowEditModal} />)}
                    <div className="flex  w-full bg-white p-5 justify-between">

                        <div className="flex gap-4  ">
                            <button
                                onClick={() => setIsOpenRemoveObraAddAMG(true)}
                                type="button"
                                className="bg-gray-700 text-white font-bold px-4 py-2 hover:brightness-75">Devolver ao armazem geral
                            </button>
                            {isOpenRemoveObraAddAMG && (<DevolverAMG
                                equipamentos={equipamentos} isOpen={isOpenRemoveObraAddAMG}
                                setIsOpen={setIsOpenRemoveObraAddAMG} />)}

                            {/** Aqui o equipamento será cadastrado directamente ao armazem da obra */}
                            <AddObra isOpen={isOpenAddObra} setIsOpen={setIsOpenAddObra} />
                            <button
                                onClick={() => setIsOpenRemove(true)}
                                type="button"
                                className="bg-gray-200 text-gray-600 font-bold px-4 py-2 hover:brightness-75">Transferir para almoxarifado
                            </button>
                            {/** Aqui o equipamento será diminuído do armazem para ser cadastrado ao armazem da obra */}
                            {isOpenRemove && (
                                <RemoveArmGeralParaObra
                                    equipamentos={equipamentos}
                                    isOpen={isOpenRemove}
                                    setIsOpen={setIsOpenRemove}
                                />
                            )}
                        </div>

                        <button
                            onClick={() => setIsOpenAddNovoModal(true)}
                            type="button"
                            className="bg-blue-700 text-white font-bold px-4 py-2 hover:brightness-75 flex items-center gap-2">
                            <FaPlusCircle /><span>Adicionar novo equipamento</span>
                        </button>
                        {isOpenAddNovoModal && (
                            <AddNovoModal
                                duracao={duracao}
                                classificacao={classificacao}
                                isOpen={isOpenAddNovoModal}
                                setIsOpen={setIsOpenAddNovoModal} />
                        )}

                    </div>

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="bg-white shadow max-w-2xl mx-auto flex flex-col space-y-5 p-6 rounded mt-10 animate__animated animate__fadeIn">
                        <h2 className="divide-x-2 h-5 text-2xl font-semibold select-none">Cadastro de Eq. no armazem geral</h2>
                        <div className="border w-1/5 border-gray-700 ml-4"></div>
                        <div className="flex gap-3">
                            <EquipamentoAutoComplete equipamentos={equipamentos} setIdEquipamento={setIdEquipamento} />
                        </div>

                        <div className="flex gap-3">
                            <input
                                {...register('preco', {
                                    required: { message: "Por favor, introduza a descrição do equipamento.", value: true },
                                    minLength: { message: "Preenchimento obrigatório!", value: 1 },
                                })}
                                type="number"
                                placeholder="Preço"
                                className="w-full rounded shadow"
                                min={0}
                            />
                        </div>

                        <div className="flex gap-3">
                            <input
                                type={'number'}
                                {...register('quantidade', {
                                    required: { message: "Por favor, introduza a a quantidade que pretende adicionar.", value: true },
                                    minLength: { message: "Preenchimento obrigatório!", value: 1 },
                                })}
                                placeholder="Quantidade"
                                className="w-1/2 rounded shadow"
                                min={0}
                            />
                            <input
                                type={'date'}
                                {...register('data_aquisicao', {
                                    required: { message: "Por favor, introduza a data de aquisição do produto.", value: true },
                                })}
                                className="w-1/2 rounded shadow"
                            />
                        </div>

                        <div className="flex gap-2 justify-end">
                            <button
                                type={'reset'}
                                className="bg-gray-700 text-white  font-semibold px-4 py-2 mt-4 hover:brightness-75 rounded">Cancelar
                            </button>
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

                                    {
                                        /*
                                            *
                                            *   <th className='text-gray-600 font-bold w-1/5'>Editar</th>
                                            *   <th className='text-gray-600 font-bold w-1/5'>Apagar</th>
                                        */
                                    }
                                </tr>
                            </thead>
                            <tbody >

                                {armazem && armazem.map((arm, index) => {
                                    if (index < 5) {
                                        return <tr
                                            key={index}
                                            className='flex justify-between border shadow-md mt-4 px-4 py-2' >
                                            <td className="w-1/5 ">{arm.id}</td>
                                            <td className="w-1/5 ">{arm.equipamento_id.descricao}</td>
                                            <td className="w-1/5 "> {findClassificacao(arm.equipamento_id.classificacao_id).tipo} </td>
                                            <td className="w-1/5 "> {findDuracao(arm.equipamento_id.duracao_id).tempo} </td>
                                            <td className="w-1/5 ">{arm.quantidade}</td>
                                            <td className="w-1/5 ">{arm.data_aquisicao}</td>

                                            {
                                                /**
                                                   *<td className="w-1/5  flex justify-center items-center">
                                                        <button
                                                            onClick={() => handleEdit(arm)}
                                                            className="hover:brightness-75" title="Editar">
                                                            <FaEdit />
                                                        </button>
                                                    </td>
                                                    *<td className="w-1/5  flex justify-center items-center">
                                                        <button
                                                            onClick={() => setShowQuestionAlert(true)}
                                                            className="hover:brightness-75"
                                                            title="Apagar">
                                                            <FaTrash />
                                                        </button>
                                                    </td>
                                                */
                                            }
                                        </tr>
                                    }
                                }
                                )}

                            </tbody>
                        </table>
                    </div>
                </div>
            </main >
        </div >
    )
}

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(
    (store) =>
        async (context: GetServerSidePropsContext) => {

            const cookie = nookies.get(context);
            const equipamentoDispatch: any = await store.dispatch(fetchEquipamento());
            const classificacaoDispatch: any = await store.dispatch(fetchClassificacao());
            const duracaoDispatch: any = await store.dispatch(fetchDuracao());
            const armazemDispatch: any = await store.dispatch(fetchArmGeral());

            const equipamentos = equipamentoDispatch.payload
            const classificacao = classificacaoDispatch.payload
            const duracao = duracaoDispatch.payload
            const armazem = armazemDispatch.payload
            if (!cookie.USER_LOGGED_ARMAZEM) {
                // If no user, redirect to index.
                return { props: {}, redirect: { destination: '/', permanent: false } }
            }
            return {
                props: {
                    equipamentos,
                    classificacao,
                    duracao,
                    armazem
                },
            };
        }
);

export default Equipamento
