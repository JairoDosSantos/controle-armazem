import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'


import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

//Componentes Externos
import { SubmitHandler, useForm } from 'react-hook-form'

//Imagens
import Image from 'next/image'
import { useRouter } from 'next/router'
import { FaSave } from 'react-icons/fa'
import { useDispatch } from 'react-redux'
import LoadImage from '../../assets/load.gif'
import { updateArmGeral } from '../../redux/slices/armGeralSlice'

type EquipamentoType = {
    id: number;
    descricao: string;
    duracao_id: number;
    classificacao_id: number;
    data: string
}

type EquipamentosARMType = {
    id: number;
    quantidade: number;
    equipamento_id: EquipamentoType;
    data_aquisicao: string;
    estado: string;
    mes: string
}

type EditarModalProps = {
    isOpen: boolean;
    setIsOpen: (valor: boolean) => void;
    data: EquipamentosARMType
}

//Tipagem do formulário
type FormValues = {
    id: number;
    descricao_equipamento: string;
    quantidade: number;
    classificacao_id: number;
    tempo_duracao: string;
    mes: string
}
const EditarModal = ({ isOpen, setIsOpen, data }: EditarModalProps) => {

    const dispatch = useDispatch<any>();
    const { register, handleSubmit, reset, formState: { errors, isValid } } = useForm<FormValues>({ mode: 'onChange' });
    const [load, setLoad] = useState(false)
    const route = useRouter();

    const onSubmit: SubmitHandler<FormValues> = async (arm) => {

        setLoad(true)

        const editEquipamentoDispatch = await dispatch(updateArmGeral({ ...data, equipamento_id: data.equipamento_id.id, quantidade_entrada: arm.quantidade }))

        setLoad(false)
        if (editEquipamentoDispatch.payload !== null) notifySuccess()
        else notifyError()

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

        toast.success('Quantidade alterada com sucesso!', {
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
                                                    defaultValue={data.equipamento_id.descricao}
                                                />

                                            </div>

                                            <div className='flex gap-2 justify-center align-center'>
                                                <input
                                                    min={0}
                                                    type="number"
                                                    className='rounded shadow w-full'
                                                    placeholder='Quantidade *'
                                                    {...register('quantidade', {
                                                        required: { message: "Por favor, introduza a quantidade.", value: true },
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
