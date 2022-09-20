import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useEffect, useState } from 'react'


import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

//Componentes Externos
import { useForm, SubmitHandler } from 'react-hook-form'

//Imagens
import LoadImage from '../../assets/load.gif';
import { FaSave } from 'react-icons/fa'
import Image from 'next/image'
import { useDispatch } from 'react-redux'
import { fetchEncarregados } from '../../redux/slices/encarregadoSlice'
import { unwrapResult } from '@reduxjs/toolkit'
import { updateObra } from '../../redux/slices/obraSlice'
import { useRouter } from 'next/router'

type EditarModalProps = {
    isOpen: boolean;
    setIsOpen: (valor: boolean) => void;
    obraObject: ObraType
}
//Tipagem do formulário
type FormValues = {
    id: number;
    nome: string;
    encarregado: number;
    estado: 'Activa' | 'Inactiva' | 'Concluida'
}
type EncarregadoType = {
    id: number;
    nome: string;
    telefone: string
}
type ObraType = {
    id: number
    obra_nome: string;
    encarregado_id: EncarregadoType;
    estado: 'Activa' | 'Inactiva' | 'Concluida'
}

const EditarModal = ({ isOpen, setIsOpen, obraObject }: EditarModalProps) => {

    const { register, handleSubmit, reset, formState: { errors, isValid } } = useForm<FormValues>({ mode: 'onChange' });

    const [load, setLoad] = useState(false)

    const [encarregados, setEncarregados] = useState<EncarregadoType[]>([])

    const [obras, setObras] = useState<ObraType>({} as ObraType)

    const ESTADOS = ['Activa', 'Inactiva', 'Concluida']

    const dispatch = useDispatch<any>();

    const route = useRouter()
    const getEncarregados = async () => {
        const dispatchEncarregado = await dispatch(fetchEncarregados());
        const result = unwrapResult(dispatchEncarregado)

        setEncarregados(result)
    }

    useEffect(() => {
        setObras(obraObject)
        getEncarregados()

    }, [])


    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        setLoad(true)
        const updateObraDispatch = await dispatch(updateObra({ id: obraObject.id, encarregado_id: data.encarregado, estado: data.estado, obra_nome: data.nome }))
        setLoad(false)
        if (updateObraDispatch.payload) {
            notifySuccess()
        } else {
            notifyError()
        }
    }

    function closeModal() {
        reset()

        setIsOpen(false)
    }

    const notifySuccess = () => {

        setTimeout(function () {
            setIsOpen(false)
            route.reload()
        }, 6500);

        toast.success('Obra alterada com sucesso!', {
            position: 'top-center',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined
        })



    }

    const notifyError = () => toast.error('Erro ao efectuar a operação!', {
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
                                        Alterar informação do encarregado
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
                                                    type="text"
                                                    className='rounded shadow w-1/2'
                                                    placeholder='Nome do Encarregado *'
                                                    {...register('nome', {
                                                        required: { message: "Por favor, introduza a descrição do equipamento.", value: true },
                                                        minLength: { message: "Preenchimento obrigatório!", value: 1 },
                                                    })}
                                                    defaultValue={obras.obra_nome}
                                                />

                                                <select
                                                    {...register('encarregado', {
                                                        required: { message: "Por favor, introduza a descrição do equipamento.", value: true },
                                                        minLength: { message: "Preenchimento obrigatório!", value: 1 },
                                                    })}
                                                    className="w-1/2 rounded shadow cursor-pointer"
                                                    defaultValue={obras?.encarregado_id?.nome}
                                                >
                                                    <option value={obras?.encarregado_id?.id} className='text-gray-400'>{obras?.encarregado_id?.nome}</option>
                                                    {encarregados.length > 0 && encarregados.map((encarregado) => {
                                                        if (encarregado.id !== obras?.encarregado_id?.id) {
                                                            return (
                                                                <option
                                                                    key={encarregado.id}
                                                                    value={encarregado.id}>{encarregado.nome}
                                                                </option>
                                                            )
                                                        }
                                                    })}
                                                </select>


                                            </div>
                                            <div className='flex gap-2 justify-center align-center'>
                                                <select
                                                    {...register('estado', {
                                                        required: { message: "Por favor, introduza a descrição do equipamento.", value: true },
                                                        minLength: { message: "Preenchimento obrigatório!", value: 1 },
                                                    })}
                                                    className="w-full rounded shadow cursor-pointer"
                                                    defaultValue={obras.estado}
                                                >
                                                    <option value={obras.estado} className='text-gray-400'>{obras.estado}</option>
                                                    {
                                                        ESTADOS.map((estado, index) => {
                                                            if (estado !== obras.estado) {
                                                                return (
                                                                    <option
                                                                        key={index}
                                                                        value={estado}>{estado}
                                                                    </option>
                                                                )
                                                            }
                                                        })
                                                    }
                                                </select>
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
                                                    {errors.nome && (errors.nome.message)}
                                                </p>
                                                <p className='text-sm'>
                                                    {errors.encarregado && (errors.encarregado.message)}
                                                </p>

                                            </div>
                                        </form>

                                    </div>


                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog >
            </Transition >
        </>
    )
}

export default EditarModal
