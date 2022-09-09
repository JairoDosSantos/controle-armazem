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
import { fetchOne, updateArmGeral } from '../../redux/slices/armGeralSlice'
import { useRouter } from 'next/router'
import { unwrapResult } from '@reduxjs/toolkit'
import { fetchOneAlmoxarifario, updateAlmoxarifario } from '../../redux/slices/almoxarifarioSlice'
import { fetchOneSaida, updateAuditoria } from '../../redux/slices/auditoriaSlice'

type EquipamentoType = {
    id: number;
    descricao: string;
    duracao_id: number;
    classificacao_id: number;
    data: string
}
type ObraType = {
    id: number
    obra_nome: string;
    encarregado_id: number;
    estado: 'Activa' | 'Inactiva' | 'Concluida'
}

type AuditoriaType = {
    id: number;
    equipamento_id: EquipamentoType;
    obra_id: ObraType;
    data_retirada: string;
    quantidade_retirada: number;
    data_devolucao: string;
    quantidade_devolvida: number
}

type EditarModalProps = {
    isOpen: boolean;
    setIsOpen: (valor: boolean) => void;
    data: AuditoriaType
}

//Tipagem do formulário
type FormValues = {
    id: number;
    descricao_equipamento: string;
    quantidade: number;

}
const EditarModal = ({ isOpen, setIsOpen, data }: EditarModalProps) => {

    const dispatch = useDispatch<any>();
    const { register, handleSubmit, reset, formState: { errors, isValid } } = useForm<FormValues>({ mode: 'onChange' });
    const [load, setLoad] = useState(false)
    const route = useRouter();

    const onSubmit: SubmitHandler<FormValues> = async (arm) => {

        setLoad(true)
        //0º Ver se a saída que se pretende alterar já não tem uma devolução
        if (data.data_devolucao) { notifyError('Não pode alterar a saída, visto que já há uma devolução para esta saída.'); setLoad(false); return }

        //1º  Buscar o equipamento no armazem e no almoxarifado
        const buscaARMDispatch = await dispatch(fetchOne(data.equipamento_id.id));
        const ARMunwrap = unwrapResult(buscaARMDispatch);

        if (!ARMunwrap.length) { notifyError('Armazem não encontrado'); setLoad(false); return }

        const buscarAlmoxarifado = await dispatch(fetchOneAlmoxarifario({ equipamento_id: data.equipamento_id.id, obra_id: data.obra_id.id }))
        const AlmoxarifadoUnwrap = unwrapResult(buscarAlmoxarifado);

        if (!AlmoxarifadoUnwrap.length) { notifyError('Almoxarifado não encontrado'); setLoad(false); return }
        //2º Ver se a quantidade que se pretende devolver não é maior que a quantidade em almoxarifado
        if (Number(AlmoxarifadoUnwrap[0].quantidade) < Number(arm.quantidade)) { notifyError('Não é possivel devolver esta quantidade'); setLoad(false); return }

        //3º adicionar ao stock em armazem o stock em almoxarifado, e subtrair a quantidade que se pretende realmente em almoxarifado
        let soma = (Number(ARMunwrap[0].quantidade) + Number(AlmoxarifadoUnwrap[0].quantidade))
        const qtdFinal = soma - Number(arm.quantidade)

        //4º Actualizar o stcok do armazem
        const updateARM = await dispatch(updateArmGeral({ ...ARMunwrap[0], quantidade_entrada: qtdFinal }))


        if (updateARM.payload === null) { notifyError('Erro ao efectuar a devolução'); setLoad(false); return }
        //5º Actualizar o stock do almoxarifado
        const updateAlmoxarifado = await dispatch(updateAlmoxarifario({ ...AlmoxarifadoUnwrap[0], quantidade_a_levar: arm.quantidade }))


        if (updateAlmoxarifado.payload === null) { notifyError('Erro ao efectuar a retirada no almoxarifário'); setLoad(false); return }
        //6º Actualizar a quantidade em auditoria

        //const auditoriaFetched = await dispatch(fetchOneSaida({ data_retirada: data.data_retirada, equipamento_id: data.equipamento_id.id, obra_id: data.obra_id.id }))

        //const auditoriaUnwrap = unwrapResult(auditoriaFetched)

        const auditoriaUpdate = await dispatch(updateAuditoria({ data_devolucao: data.data_devolucao, data_retirada: data.data_retirada, equipamento_id: data.equipamento_id.id, obra_id: data.obra_id.id, quantidade_devolvida: data.quantidade_devolvida, quantidade_retirada: arm.quantidade }))
        if (auditoriaUpdate.payload === null) { notifyError('Erro ao efectuar a alteração na auditoria, mas  no almoxarifado foi alterado e no armazem geral também.'); setLoad(false); return }
        //7º Fim

        notifySuccess()

        setLoad(false)
        // if (editEquipamentoDispatch.payload !== null) notifySuccess()
        // else notifyError()

    }

    function closeModal() {
        reset()
        setIsOpen(false)
    }

    const notifySuccess = () => {

        setTimeout(function () {
            setIsOpen(false)

        }, 6500);

        toast.success('Saída alterada com sucesso! ', {
            position: 'top-center',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined
        })

    }

    const notifyError = (message: string) => toast.error(message, {
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
                                                        required: { message: "Por favor, introduza a número de telefone.", value: true },
                                                        minLength: { message: "Quantidade insuficiente", value: 1 },
                                                        min: { message: 'Quantidade insuficiente', value: 0 }
                                                    })}

                                                    defaultValue={data.quantidade_retirada}
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
