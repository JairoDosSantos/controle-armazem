import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'


import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

//Componentes Externos
import { useForm, SubmitHandler } from 'react-hook-form'

//Imagens
import LoadImage from '../../assets/load.gif';
import { FaSave } from 'react-icons/fa'
import Image from 'next/image'

type EditarModalProps = {
    isOpen: boolean;
    setIsOpen: (valor: boolean) => void;
    data: []
}

//Tipagem do formulário
type FormValues = {
    id: number;
    descricao_equipamento: string;
    quantidade: number;
    classificacao_id: number;
    tempo_duracao: string
}


const EditarModal = ({ isOpen, setIsOpen, data }: EditarModalProps) => {

    const { register, handleSubmit, reset, formState: { errors, isValid } } = useForm<FormValues>({ mode: 'onChange' });
    const [load, setLoad] = useState(false)




    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        console.log(data)
    }

    function closeModal() {
        reset()
        setIsOpen(false)
    }

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
                                        Alterar informação do equipamento
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
                                                    className='rounded shadow w-full read-only:ring-0 read-only:border-0'
                                                    placeholder='Descrição do equipamento *'
                                                    {...register('descricao_equipamento')}
                                                />

                                            </div>

                                            {/**
                                           *   <div className='flex gap-2 justify-center align-center'>

                                                <select
                                                    {...register('classificacao_id', {
                                                        required: { message: "Por favor, introduza a descrição do equipamento.", value: true },
                                                        minLength: { message: "Preenchimento obrigatório!", value: 1 },
                                                    })}
                                                    className="w-1/2 rounded shadow cursor-pointer" >
                                                    <option value="#" className='text-gray-400'>Classsificação</option>
                                                    <option value="1">EPI</option>
                                                    <option value="2">Material</option>
                                                    <option value="3">Ferramenta</option>
                                                </select>
                                                <select
                                                    {...register('tempo_duracao', {
                                                        required: { message: "Por favor, introduza a descrição do equipamento.", value: true },
                                                        minLength: { message: "Preenchimento obrigatório!", value: 1 },
                                                    })}
                                                    className="w-1/2 rounded shadow cursor-pointer" >
                                                    <option value="#" className='text-gray-400'>Tempo de duração</option>
                                                    <option value="0.5 à 1 ano">0.5 à 1 ano</option>
                                                    <option value="1 à 2 anos">1 à 2 anos</option>
                                                    <option value="2 à 3 anos">2 à 3 anos</option>
                                                </select>


                                            </div>
                                           */}
                                            <div className='flex gap-2 justify-center align-center'>
                                                <input
                                                    min={0}
                                                    type="number"
                                                    className='rounded shadow w-full'
                                                    placeholder='Quantidade *'
                                                    {...register('quantidade', {
                                                        required: { message: "Por favor, introduza a número de telefone.", value: true },
                                                        minLength: { message: "Quantidade insuficiente", value: 1 },
                                                        min: { message: 'Quantidade insuficiente', value: 0 }
                                                    })}
                                                />

                                                {/**
                                                *  <input
                                                    type={'date'}
                                                    placeholder="Data de compra"
                                                    className="w-1/2 rounded shadow"
                                                />
                                                */}
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

export default EditarModal
