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
import EquipamentoAutoComplete from '../EquipamentoAutoComplete'
import { fetchObra } from '../../redux/slices/obraSlice'
import { unwrapResult } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import { fetchOneAlmoxarifario, updateAlmoxarifario } from '../../redux/slices/almoxarifarioSlice'
import { fetchOne, updateArmGeral } from '../../redux/slices/armGeralSlice'
import { fetchOneSaida, updateAuditoria } from '../../redux/slices/auditoriaSlice'


type EquipamentoType = {
    id: number;
    descricao: string;
    duracao_id: number;
    classificacao_id: number;
    data: string
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

type DevolverAMGProps = {
    isOpen: boolean;
    setIsOpen: (valor: boolean) => void;
    equipamentos: EquipamentoType[];
}

//Tipagem do formulário
type FormValues = {
    id: number;
    descricao_equipamento: number;
    quantidade: number;
    obra_id: number;
    data_devolucao: string;
    data_retirada: string;
    estado: string
}

const DevolverAMG = ({ isOpen, setIsOpen, equipamentos }: DevolverAMGProps) => {

    const { register, handleSubmit, reset, formState: { errors, isValid } } = useForm<FormValues>({ mode: 'onChange' });
    const [load, setLoad] = useState(false)

    const [obras, setObras] = useState<ObraType[]>([])
    const [idEquipamento, setIdEquipamento] = useState(0)

    const dispatch = useDispatch<any>()

    /**
     * Método responsável por efectuar uma devolução ao armazem central
     */
    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        setLoad(true)
        try {

            data.descricao_equipamento = idEquipamento;
            const getEquipamentosNoARM = await dispatch(fetchOne({ id: data.descricao_equipamento, estado: data.estado }))
            const equipamentoQuantidade = unwrapResult(getEquipamentosNoARM);

            const fetchOneSaidaByDate = await dispatch(fetchOneSaida({ data_retirada: data.data_retirada, equipamento_id: data.descricao_equipamento, obra_id: data.obra_id, estado: data.estado }))
            const auditorias = unwrapResult(fetchOneSaidaByDate)

            if (auditorias.length <= 0) {
                notifyError('Não há registro desta movimentação na base de dados!')

                setLoad(false)
                return
            }

            if (equipamentoQuantidade.length) {



                const findInAmoxarifario = await dispatch(fetchOneAlmoxarifario({ equipamento_id: data.descricao_equipamento, obra_id: data.obra_id, estado: data.estado }))
                const almoxarifarioFinded = unwrapResult(findInAmoxarifario)

                if (almoxarifarioFinded.length <= 0) {
                    notifyError('Equipamento não existe no almoxarifário desta obra!')

                    setLoad(false)
                    return
                }
                if (data.quantidade > almoxarifarioFinded[0].quantidade) {
                    notifyError('O almoxarifário não tem toda essa quantidade!')

                    setLoad(false)
                    return
                }
                let qtdTotalAlmo = Number(almoxarifarioFinded[0].quantidade) - Number(data.quantidade)
                let qtdTotalAMG = Number(equipamentoQuantidade[0].quantidade) + Number(data.quantidade)

                const almoxarifarioUpdate = await dispatch(updateAlmoxarifario({ ...almoxarifarioFinded[0], quantidade_a_levar: qtdTotalAlmo }))


                if (!almoxarifarioUpdate.meta.arg) {
                    // notificar o erro
                    notifyError('Erro inesperado ao transferir ao almoxarifário. Contacte o admin.! 😥')
                    setLoad(false)
                    return
                }

                const armQtdUpdate = await dispatch(updateArmGeral({ ...equipamentoQuantidade[0], quantidade_entrada: qtdTotalAMG }))

                if (!armQtdUpdate.meta.arg) {
                    // notificar o erro
                    let qtdTotal1 = Number(almoxarifarioFinded[0].quantidade) - Number(data.quantidade)
                    const almoxarifarioUpdate1 = await dispatch(updateAlmoxarifario({ ...almoxarifarioFinded[0], quantidade_a_levar: qtdTotal1 }))


                    notifyError('Erro inesperado ao efectuar a transferência em armazem, contacte o admin. do sistema! 😥')
                    setLoad(false)
                    return
                }
            } else {

                setLoad(false)

                notifyError('Equipamento não existe em armazem! 😥')
                return
            }


            //Vê bem esta actualização
            let qtdAuditoria = Number(data.quantidade) + Number(auditorias[0].quantidade_devolvida)

            const auditoria = await dispatch(updateAuditoria({ ...auditorias[0], data_devolucao: data.data_devolucao, quantidade_devolvida: qtdAuditoria }))
            if (auditoria.meta.arg) {

                notifySuccess()
                //sucesso
            } else {
                notifyError('Ocorreu um erro inesperado, por favor contacte o admin.')
            }
            setLoad(false)
        } catch (error) {
            notifyError('Ocorreu um erro ao efectuar a submissão do formulário. Tente mais tarde!')
            setLoad(false)
        }
    }


    const getObras = async () => {
        try {
            const resultDispatch = await dispatch(fetchObra())

            const resultUnwrap = unwrapResult(resultDispatch)

            if (resultUnwrap.length) setObras(resultUnwrap)
        } catch (error) {

        }
    }

    useEffect(() => {
        getObras()
    }, [])

    function closeModal() {
        setIsOpen(false)
    }

    const notifySuccess = () => {

        setTimeout(function () {

            reset()

        }, 6500);

        toast.success('Equipamento adicionado com sucesso! 😁', {
            position: 'top-center',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined
        })

    }

    const notifyError = (messageError: string) => toast.error(messageError, {
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
                                        Devolver ao armazem geral
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
                                            className='flex flex-col gap-3 justify-center align-center  mx-auto'
                                            onSubmit={handleSubmit(onSubmit)}>
                                            <div className='flex gap-2 justify-center align-center'>
                                                {/** Pegar um produto do armazem da Obra e adicionar a quantidade em stock do armazem geral  */}


                                                <EquipamentoAutoComplete equipamentos={equipamentos} setIdEquipamento={setIdEquipamento} />

                                            </div>
                                            <div className='flex flex-col lg:flex-row gap-2 justify-center align-center'>
                                                <select
                                                    {...register('obra_id',
                                                        {
                                                            required: { message: "Por favor, selecione o almoxarifado.", value: true },
                                                            min: { message: 'Quantidade insuficiente', value: 1 }
                                                        })}

                                                    className='rounded shadow w-full lg:w-1/2 cursor-pointer'>
                                                    <option value={0} className='text-gray-300'>Selecione a Obra</option>
                                                    {
                                                        obras.length && obras.map((obra, index) => {
                                                            if (obra.estado === 'Activa') {
                                                                return <option
                                                                    key={index}
                                                                    value={obra.id}>{obra.obra_nome}</option>
                                                            }
                                                        })
                                                    }
                                                </select>
                                                <input
                                                    min={0}
                                                    type="number"
                                                    className='rounded shadow w-full lg:w-1/2'
                                                    placeholder='Quantidade a devolver *'
                                                    {...register('quantidade', {
                                                        required: { message: "Por favor, introduza a quantidade a transferir.", value: true },
                                                        minLength: { message: "Quantidade insuficiente", value: 1 },
                                                        min: { message: 'Quantidade insuficiente', value: 1 }
                                                    })}
                                                />
                                            </div>

                                            <div className='flex flex-col lg:flex-row gap-2 justify-center align-center'>
                                                <select
                                                    {...register('estado', {
                                                        required: { message: "Por favor, introduza a Estado do equipamento.", value: true },
                                                    })}
                                                    className="w-full rounded shadow cursor-pointer ">
                                                    <option className='text-gray-400' value="">Selecione o estado</option>
                                                    <option value="Novo">Novo</option>
                                                    <option value="Avariado">{'Avariado(a)'}</option>
                                                    <option value="Usado">Usado</option>
                                                </select>
                                            </div>

                                            <div className='flex gap-2 justify-center align-center'>

                                                <div className='w-1/2'>
                                                    <label htmlFor="retirada">Data Retirada</label>
                                                    <input
                                                        id='retirada'
                                                        type="date"
                                                        className='rounded shadow w-full'
                                                        {...register('data_retirada', {
                                                            required: { message: "Por favor, introduza a data da devolução.", value: true },
                                                        })}
                                                    />
                                                </div>
                                                <div className='w-1/2'>
                                                    <label htmlFor="entrada">Data Devolução</label>
                                                    <input
                                                        id='entrada'
                                                        type="date"
                                                        className='rounded shadow w-full'
                                                        {...register('data_devolucao', {
                                                            required: { message: "Por favor, introduza a data da devolução.", value: true },
                                                        })}
                                                    />
                                                </div>

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
                                                {!(errors.descricao_equipamento || errors.obra_id || errors.quantidade) && (
                                                    <p className='text-sm '>Os campos com * o seu preenchimento é de carácter obrigatório.</p>
                                                )}
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

export default DevolverAMG
