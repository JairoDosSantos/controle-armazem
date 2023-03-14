import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'


import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

//Componentes Externos
import { SubmitHandler, useForm } from 'react-hook-form'

//Imagens
import Image from 'next/image'
import { useRouter } from 'next/router'
import { FaPlusCircle, FaSave } from 'react-icons/fa'
import { useDispatch } from 'react-redux'
import LoadImage from '../../assets/load.gif'
import { insertEquipamento } from '../../redux/slices/equipamentoSlice'

type EditarModalProps = {
    isOpen: boolean;
    setIsOpen: (valor: boolean) => void;
    duracao: DuracaoType[];
    classificacao: ClassificacaoType[];
    especialidade: Especialidade[]
}

//Tipagem do formulário
type FormValues = {
    id: number;
    descricao_equipamento: string;
    classificacao_id: number;
    tempo_duracao: number;
    stock_emergencia: number;
    especialidade_id: number;
}
type DuracaoType = {
    id: number;
    tempo: string;

}
type ClassificacaoType = {
    id: number;
    tipo: string;

}
type Especialidade = {
    id: number;
    especialidade: string
}


const AddNovoModal = ({ isOpen, setIsOpen, classificacao, duracao, especialidade }: EditarModalProps) => {

    const { register, handleSubmit, reset, formState: { errors, isValid } } = useForm<FormValues>({ mode: 'onChange' });
    const [load, setLoad] = useState(false)


    const dispatch = useDispatch<any>()
    const route = useRouter()


    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        setLoad(true)

        const dispatchResult = await dispatch(insertEquipamento(
            {
                classificacao_id: data.classificacao_id,
                especialidade_id: data.especialidade_id,
                descricao: data.descricao_equipamento,
                duracao_id: data.tempo_duracao,
                stock_emergencia: data.stock_emergencia
            }
        ))

        if (dispatchResult.payload) notifySuccess()
        else notifyError()

        setLoad(false)
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

        toast.success('Equipamento adicionado com sucesso!', {
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
                                        className="text-lg font-bold leading-6 text-gray-900 text-center mb-5 flex space-x-3 items-center justify-center"
                                    >
                                        <FaPlusCircle /> <span>Adicionar nova descrição de equipamento</span>
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
                                            autoComplete={'off'}
                                            className='flex flex-col gap-3 justify-center align-center lg:w-[552px] mx-auto'
                                            onSubmit={handleSubmit(onSubmit)}>

                                            <div className='flex gap-2 justify-center align-center'>
                                                <input
                                                    type="text"
                                                    className='rounded shadow w-full'
                                                    placeholder='Descrição do equipamento *'
                                                    {...register('descricao_equipamento', {
                                                        required: { message: "Por favor, introduza a descrição do equipamento.", value: true },
                                                        minLength: { message: "Preenchimento obrigatório!", value: 1 },
                                                    })}
                                                />

                                            </div>

                                            <div className='flex lg:flex-row flex-col gap-2 justify-center align-center'>

                                                <select
                                                    {...register('especialidade_id', {
                                                        required: { message: "Por favor, introduza a especilaidade do equipamento.", value: true },
                                                        minLength: { message: "Preenchimento obrigatório!", value: 1 },
                                                    })}
                                                    className="w-full rounded shadow cursor-pointer" >
                                                    <option value={0} className='text-gray-400'>Selecione a especialidade</option>
                                                    {
                                                        especialidade.map((espec, index) => (
                                                            <option
                                                                key={index}
                                                                value={espec.id}>{espec.especialidade}</option>
                                                        ))
                                                    }

                                                </select>

                                                <select
                                                    {...register('classificacao_id', {
                                                        required: { message: "Por favor, introduza a classificação do equipamento.", value: true },
                                                        minLength: { message: "Preenchimento obrigatório!", value: 1 },
                                                    })}
                                                    className="w-full rounded shadow cursor-pointer" >
                                                    <option value="#" className='text-gray-400'>Classsificação</option>
                                                    {classificacao.length && classificacao.map((classific, index) => (
                                                        <option
                                                            key={classific.id}
                                                            value={classific.id}>{classific.tipo}</option>
                                                    ))}

                                                </select>



                                            </div>
                                            <div className='flex lg:flex-row flex-col gap-2 justify-center align-center'>

                                                <select
                                                    {...register('tempo_duracao', {
                                                        required: { message: "Por favor, introduza a durabilidade do equipamento.", value: true },
                                                        minLength: { message: "Preenchimento obrigatório!", value: 1 },
                                                    })}
                                                    className="lg:w-1/2 w-full rounded shadow cursor-pointer" >
                                                    <option value="#" className='text-gray-400'>Tempo de duração</option>
                                                    {duracao.length && duracao.map((time, index) => (
                                                        <option
                                                            key={index}
                                                            value={time.id}>{time.tempo}</option>
                                                    )

                                                    )}

                                                </select>
                                                <input
                                                    type={'number'}
                                                    placeholder="Stock de emergência"
                                                    min={0}
                                                    className="lg:w-1/2 w-full rounded shadow"
                                                    {...register('stock_emergencia', {
                                                        required: { message: "Por favor, introduza o Stock de emergência.", value: true },
                                                        minLength: { message: "Preenchimento obrigatório!", value: 1 },
                                                    })}
                                                />
                                            </div>
                                            <div className="mt-4 flex lg:justify-end justify-center">
                                                <button
                                                    disabled={!isValid || load}
                                                    className="flex items-center justify-center gap-2 rounded-md border border-transparent 
                          bg-blue-700 px-4 py-2 text-sm font-bold text-white hover:bg-blue-500 
                          focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 
                          focus-visible:ring-offset-2 disabled:bg-blue-400 disabled:text-gray-200 disabled:cursor-not-allowed"
                                                >
                                                    {
                                                        load ? (
                                                            <Image src={LoadImage} width={20} height={15} objectFit='cover' />
                                                        ) : (

                                                            <FaSave />
                                                        )
                                                    }
                                                    <span>Salvar</span>
                                                </button>
                                            </div>
                                            <div className='text-red-700 mt-2 text-center'>
                                                {
                                                    !(errors.descricao_equipamento || errors.tempo_duracao || errors.stock_emergencia || errors.classificacao_id) && (
                                                        <p className='text-sm '>Os campos com * o seu preenchimento é de carácter obrigatório.</p>
                                                    )

                                                }
                                                <p className='text-sm'>
                                                    {errors.descricao_equipamento && (errors.descricao_equipamento.message)}
                                                </p>
                                                <p className='text-sm'>
                                                    {errors.tempo_duracao && (errors.tempo_duracao.message)}
                                                </p>
                                                <p className='text-sm'>
                                                    {errors.stock_emergencia && (errors.stock_emergencia.message)}
                                                </p>
                                                <p className='text-sm'>
                                                    {errors.classificacao_id && (errors.classificacao_id.message)}
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

export default AddNovoModal
