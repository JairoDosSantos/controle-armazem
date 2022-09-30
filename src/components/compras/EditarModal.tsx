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
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import { updateCompra } from '../../redux/slices/compraSlice'
import { fetchOne, updateArmGeral } from '../../redux/slices/armGeralSlice'
import { unwrapResult } from '@reduxjs/toolkit'

type EditarModalProps = {
    isOpen: boolean;
    setIsOpen: (valor: boolean) => void;
    compraData: CompraType
}
//Tipagem do formulário
type FormValues = {
    id: number;
    quantidadeAlterada: number;
    nome: string
}
//Tipagem do formulário
type EquipamentoType = {
    id: number;
    descricao: string;
    duracao_id: number;
    classificacao_id: number;
    data: string;
    stock_emergencia: number
}

type CompraType = {
    id: number;
    equipamento_id: EquipamentoType;
    preco: number;
    data_compra: string;
    quantidade_comprada: number;
    estado: string
}

const EditarModal = ({ isOpen, setIsOpen, compraData }: EditarModalProps) => {

    const { register, handleSubmit, reset, formState: { errors, isValid } } = useForm<FormValues>({ mode: 'onChange' });
    const [load, setLoad] = useState(false)
    const route = useRouter()
    const dispatch = useDispatch<any>();


    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        setLoad(true)
        const retirar = await retirarARMG(compraData.quantidade_comprada, compraData.equipamento_id.id, compraData.estado)
        if (!retirar) { notifyError(); return }
        const somar = await colocarARMG(data.quantidadeAlterada, compraData.equipamento_id.id, compraData.estado)
        if (!somar) { notifyError(); return }
        // data_compra, equipamento_id, id, preco
        const resultDispatch = await dispatch(updateCompra({ ...compraData, equipamento_id: compraData.equipamento_id.id, quantidade_comprada: data.quantidadeAlterada }));
        setLoad(false)
        if (resultDispatch.payload !== null) {
            notifySuccess()
        } else {
            notifyError()
        }

    }

    const retirarARMG = async (quantidade: number, equipamento_id: number, estado: string) => {

        const dispatchFetchARMG = await dispatch(fetchOne({ estado, id: equipamento_id }))

        const ARMUNWRAP = unwrapResult(dispatchFetchARMG)

        if (Number(ARMUNWRAP[0].quantidade) < Number(quantidade)) return false

        console.log('Resultado QTD TOTAL ORIGINAL', ARMUNWRAP[0])

        let newQTD = Number(ARMUNWRAP[0].quantidade) - Number(quantidade)

        console.log('SUBTRAÇÃO', newQTD)

        const dispatchUpdateARMG = await dispatch(updateArmGeral({ ...ARMUNWRAP[0], equipamento_id, quantidade_entrada: newQTD }))

        if (dispatchUpdateARMG.payload === null) return false

        return true
    }

    const colocarARMG = async (quantidade: number, equipamento_id: number, estado: string) => {

        const dispatchFetchARMG = await dispatch(fetchOne({ id: equipamento_id, estado }))
        const ARMUNWRAP = unwrapResult(dispatchFetchARMG)
        let newQTD = Number(ARMUNWRAP[0].quantidade) + Number(quantidade)
        console.log('Resultado QTD TOTAL SUBTRAIDA', ARMUNWRAP[0])
        console.log('SOMA', newQTD)
        const dispatchUpdateARMG = await dispatch(updateArmGeral({ ...ARMUNWRAP[0], equipamento_id, quantidade_entrada: newQTD }))

        if (dispatchUpdateARMG.payload === null) return false

        return true
    }


    function closeModal() {
        reset()
        setIsOpen(false)
    }
    const notifySuccess = () => {

        setTimeout(function () {
            setIsOpen(false)
            //route.reload()
        }, 6500);

        toast.success('Compra alterada com sucesso! 😁', {
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

                                            <div className='flex flex-col gap-2 justify-center align-center'>
                                                <input
                                                    readOnly={true}
                                                    type="text"
                                                    className='rounded shadow w-full border border-gray-300 ring-0 focus:ring-0 focus:border-0'
                                                    placeholder='Nome do Encarregado *'
                                                    {...register('nome', {
                                                        required: { message: "Por favor, introduza a descrição do equipamento.", value: true },
                                                        minLength: { message: "Preenchimento obrigatório!", value: 1 },
                                                    })}
                                                    defaultValue={compraData.equipamento_id.descricao}
                                                />
                                                <input
                                                    min={0}
                                                    type="number"
                                                    className='rounded shadow w-full'
                                                    placeholder='Quantidade comprada *'
                                                    {...register('quantidadeAlterada', {
                                                        required: { message: "Por favor, introduza a número de telefone.", value: true },
                                                        minLength: { message: "Quantidade insuficiente", value: 1 },
                                                        min: { message: 'Quantidade insuficiente', value: 0 }
                                                    })}
                                                    defaultValue={compraData.quantidade_comprada}
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
                                                    {errors.nome && (errors.nome.message)}
                                                </p>
                                                <p className='text-sm'>
                                                    {errors.quantidadeAlterada && (errors.quantidadeAlterada.message)}
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
