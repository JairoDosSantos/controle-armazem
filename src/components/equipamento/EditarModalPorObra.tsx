import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState, useEffect } from 'react'


import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

//Componentes Externos
import { useForm, SubmitHandler } from 'react-hook-form'

//Imagens
import LoadImage from '../../assets/load.gif';
import { FaSave } from 'react-icons/fa'
import Image from 'next/image'
import { useDispatch } from 'react-redux'
import { updateAlmoxarifario } from '../../redux/slices/almoxarifarioSlice'
import { useRouter } from 'next/router'
import { fetchObra, fetchObraActiva } from '../../redux/slices/obraSlice'
import { unwrapResult } from '@reduxjs/toolkit'

type AddObraProps = {
    isOpen: boolean;
    setIsOpen: (valor: boolean) => void;
    data: Almoxarifario
}

//Tipagem do formulário
type FormValues = {
    id: number;
    descricao_equipamento: string;
    quantidade: number;
    obra_id: number;
    data_compra: string
}
type ObraType = {
    id: number
    obra_nome: string;
    encarregado_id: number;
    estado: 'Activa' | 'Inactiva' | 'Concluida'
}
type EquipamentoType = {
    id: number;
    descricao: string;
    duracao_id: number;
    classificacao_id: number;
    data: string
}
type Almoxarifario = {
    id: number;
    equipamento_id: EquipamentoType;
    quantidade: number;
    obra_id: ObraType;
    data_aquisicao: string
}
const EditarModalPorObra = ({ isOpen, setIsOpen, data }: AddObraProps) => {

    const route = useRouter()
    const dispatch = useDispatch<any>()
    const { register, handleSubmit, formState: { errors, isValid } } = useForm<FormValues>({ mode: 'onChange' });
    const [obras, setObras] = useState<ObraType[]>([])
    const [load, setLoad] = useState(false)

    const onSubmit: SubmitHandler<FormValues> = async (almoxaroifario) => {
        //Na auditoria também deve alterar as informações que se altera aquí

        setLoad(true)
        const almoxarifarioUpadate = await dispatch(updateAlmoxarifario({ ...data, equipamento_id: data.equipamento_id.id, obra_id: almoxaroifario.obra_id, quantidade_a_levar: almoxaroifario.quantidade }))
        if (almoxarifarioUpadate.payload !== null) notifySuccess()
        else notifyError()
        setLoad(false)
    }

    const getAllObras = async () => {
        const dispatchObras = await dispatch(fetchObraActiva());
        const unwrap = unwrapResult(dispatchObras)
        setObras(unwrap)
    }

    useEffect(() => {
        getAllObras()
    }, [])

    function closeModal() {
        setIsOpen(false)
    }

    const notifySuccess = () => {

        setTimeout(function () {
            setIsOpen(false)
            route.reload()
        }, 6500);

        toast.success('Quantidade alterada com sucesso! 😁', {
            position: 'top-center',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined
        })



    }

    const notifyError = () => toast.error('Erro ao efectuar a operação! 😥', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
    })
    return (
        <>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={closeModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-bold leading-6 text-gray-900 text-center mb-5"
                                    >
                                        Editar equip. de obra
                                    </Dialog.Title>
                                    <div className="mt-2 flex flex-col justify-center">
                                        <div className='w-[552px]'>
                                            <ToastContainer
                                                position='top-center'
                                                autoClose={5000}
                                                hideProgressBar={false}
                                                newestOnTop={false}
                                                closeOnClick
                                                rtl={false}
                                                pauseOnFocusLoss
                                                draggable
                                                pauseOnHover
                                            />
                                        </div>
                                        <form
                                            className='flex flex-col gap-3 justify-center align-center w-[552px] mx-auto'
                                            onSubmit={handleSubmit(onSubmit)}>
                                            <div className='flex gap-2 justify-center align-center'>
                                                <input
                                                    readOnly={true}
                                                    type="text"
                                                    className='rounded shadow w-full read-only:text-gray-300 read-only:border read-only:border-gray-300 focus:ring-0'
                                                    placeholder='Descrição do Equipamento *'
                                                    {...register('descricao_equipamento')}
                                                    defaultValue={data.equipamento_id.descricao}
                                                />


                                            </div>
                                            <div className='flex gap-2 justify-center align-center'>
                                                <select
                                                    {...register('obra_id')}
                                                    className='rounded shadow w-1/2 cursor-pointer'>
                                                    <option value={data.obra_id.id} className='text-gray-400'>{data.obra_id.obra_nome}</option>

                                                    {obras && obras.map((obra, index) => {
                                                        if (obra.obra_nome !== data.obra_id.obra_nome) {
                                                            return (
                                                                <option key={index} value={obra.id}>{obra.obra_nome}</option>
                                                            )
                                                        }
                                                    })}

                                                </select>
                                                <input
                                                    min={0}
                                                    type="number"
                                                    className='rounded shadow w-1/2'
                                                    placeholder='Quantidade a transferir *'
                                                    {...register('quantidade', {
                                                        required: { message: "Por favor, introduza a quantidade a transferir.", value: true },
                                                        minLength: { message: "Quantidade insuficiente", value: 1 },
                                                        min: { message: 'Quantidade insuficiente', value: 0 }
                                                    })}
                                                    defaultValue={data.quantidade}
                                                />
                                            </div>

                                            <div className="mt-4 flex justify-end">
                                                <button
                                                    disabled={!isValid}
                                                    className="flex items-center justify-center gap-2 rounded-md border border-transparent 
                          bg-blue-700 px-4 py-2 text-sm font-bold text-white hover:bg-blue-500 
                          focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 
                          focus-visible:ring-offset-2 disabled:bg-blue-400 disabled:text-gray-200 disabled:cursor-not-allowed"
                                                >
                                                    {
                                                        load ? (
                                                            <Image src={LoadImage} height={20} width={20} objectFit='cover' />
                                                        ) : (

                                                            <FaSave />
                                                        )
                                                    }
                                                    <span>Salvar</span>
                                                </button>
                                            </div>
                                            <div className='text-red-700 mt-2 text-center'>
                                                <p className='text-sm '>Os campos com * o seu preenchimento é de carácter obrigatório.</p>
                                                <p className='text-sm'>
                                                    {errors.descricao_equipamento && (errors.descricao_equipamento.message)}
                                                </p>
                                                <p className='text-sm'>
                                                    {errors.obra_id && (errors.obra_id.message)}
                                                </p>
                                                <p className='text-sm'>
                                                    {errors.quantidade && (errors.quantidade.message)}
                                                </p>
                                            </div>
                                        </form>

                                    </div>


                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}

export default EditarModalPorObra
