import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useEffect, useState } from 'react'


import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

//Componentes Externos
import { SubmitHandler, useForm } from 'react-hook-form'

//Imagens
import { unwrapResult } from '@reduxjs/toolkit'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { BiTransferAlt } from 'react-icons/bi'
import { FaSave } from 'react-icons/fa'
import { useDispatch } from 'react-redux'
import LoadImage from '../../assets/load.gif'
import { deleteAlmoxarifario, fetchOneAlmoxarifario, insertAlmoxarifario, updateAlmoxarifario } from '../../redux/slices/almoxarifarioSlice'
import { fetchOne, updateArmGeral } from '../../redux/slices/armGeralSlice'
import { insertAuditoria } from '../../redux/slices/auditoriaSlice'
import { fetchObra } from '../../redux/slices/obraSlice'
import EquipamentoAutoComplete from '../EquipamentoAutoComplete'

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

type RemoveArmGeralParaObraProps = {
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
    data_transferencia: string;
    estado: string
}


const RemoveArmGeralParaObra = ({ isOpen, setIsOpen, equipamentos }: RemoveArmGeralParaObraProps) => {
    const allMonths = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']

    const { register, handleSubmit, reset, formState: { errors, isValid } } = useForm<FormValues>({ mode: 'onChange' });
    const [load, setLoad] = useState(false)
    const [idEquipamento, setIdEquipamento] = useState(0)
    const [obras, setObras] = useState<ObraType[]>([])
    const dispatch = useDispatch<any>()
    const route = useRouter()

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        setLoad(true)
        const mes = (new Date(data.data_transferencia)).getMonth();
        const ano = (new Date(data.data_transferencia)).getFullYear();

        try {

            data.descricao_equipamento = idEquipamento
            const getEquipamentosNoARM = await dispatch(fetchOne({ id: data.descricao_equipamento, estado: data.estado }))
            const equipamentoQuantidade = unwrapResult(getEquipamentosNoARM);


            if (equipamentoQuantidade.length > 0) {

                const findInAmoxarifario = await dispatch(fetchOneAlmoxarifario({ equipamento_id: data.descricao_equipamento, obra_id: data.obra_id, estado: data.estado }))
                const almoxarifarioFinded = unwrapResult(findInAmoxarifario)




                if (almoxarifarioFinded && almoxarifarioFinded.length > 0) {
                    //Se a quantidade no armazem for maior ou igual a quantidade que se pretende, então faz-se a operação
                    if (Number(equipamentoQuantidade[0].quantidade) >= Number(data.quantidade)) {

                        let qtdTotalArm = Number(equipamentoQuantidade[0].quantidade) - Number(data.quantidade)


                        if (qtdTotalArm < 0) { notifyError('Estoque em armazem insuficiente! 😥'); return }


                        let qtdTotal = Number(almoxarifarioFinded[0].quantidade) + Number(data.quantidade)



                        const almoxarifarioUpdate = await dispatch(updateAlmoxarifario({ ...almoxarifarioFinded[0], quantidade_a_levar: qtdTotal }))

                        if (!almoxarifarioUpdate.meta.arg) {
                            // notificar o erro
                            notifyError('Erro inesperado ao transferir ao almoxarifário. Contacte o admin.! 😥')
                            setLoad(false)
                            return
                        }



                        const armQtdUpdate = await dispatch(updateArmGeral({ ...equipamentoQuantidade[0], quantidade_entrada: qtdTotalArm }))

                        //se acontecer um erro ao retirar do armazem, visto que a quantidade já foi adicionada no almoxarifário então devemos retirar do almoxarifário
                        if (!armQtdUpdate.meta.arg) {
                            // notificar o erro
                            let qtdTotal1 = Number(almoxarifarioFinded[0].quantidade) - Number(data.quantidade)
                            const almoxarifarioUpdate1 = await dispatch(updateAlmoxarifario({ ...almoxarifarioFinded[0], quantidade_a_levar: qtdTotal1 }))

                            notifyError('Erro inesperado ao efectuar a transferência em armazem, contacte o admin. do sistema! 😥')
                            setLoad(false)
                            return
                        }
                        //Se chegar até aquí, então sucesso. Devemos cadastrar agora no final em auditoría
                    } else {

                        setLoad(false)
                        notifyError('Estoque em armazem insuficiente! 😥')
                        return
                    }

                    const auditoria = await dispatch(insertAuditoria({ estado: data.estado, data_retirada: data.data_transferencia, equipamento_id: data.descricao_equipamento, obra_id: data.obra_id, quantidade_retirada: data.quantidade }))
                    if (auditoria.meta.arg) {
                        // console.log('sucesso', auditoria.payload)
                        //sucesso
                        notifySuccess()
                    } else {
                        notifyError('Erro insesperado. Contacte o admin. 🤔')
                    }
                    setLoad(false)

                } else {

                    const almoxarifarioInsert = await dispatch(insertAlmoxarifario({ estado: data.estado, data_aquisicao: data.data_transferencia, equipamento_id: data.descricao_equipamento, obra_id: data.obra_id, quantidade_a_levar: data.quantidade, mes: `${ano}-${allMonths[mes]}` }))
                    const almoxarifarioData = unwrapResult(almoxarifarioInsert)


                    if (almoxarifarioInsert.meta.arg) {
                        let qtdTotalArm = Number(equipamentoQuantidade[0].quantidade) - Number(data.quantidade)
                        const armQtdUpdate = await dispatch(updateArmGeral({ ...equipamentoQuantidade[0], quantidade_entrada: qtdTotalArm }))
                        if (!armQtdUpdate.meta.arg) {
                            await dispatch(deleteAlmoxarifario(almoxarifarioData[0].id));
                            setLoad(false)
                            return
                        }
                    }

                    const auditoria = await dispatch(insertAuditoria({ estado: data.estado, data_retirada: data.data_transferencia, equipamento_id: data.descricao_equipamento, obra_id: data.obra_id, quantidade_retirada: data.quantidade }))
                    if (auditoria.meta.arg) {
                        // console.log('sucesso', auditoria.payload)
                        //sucesso
                        notifySuccess()
                    } else {
                        notifyError('Erro insesperado. Contacte o admin. 🤔')
                    }
                    setLoad(false)

                }

                /**
                 * const auditoria = await dispatch(insertAuditoria({ estado: data.estado, data_retirada: data.data_transferencia, equipamento_id: data.descricao_equipamento, obra_id: data.obra_id, quantidade_retirada: data.quantidade }))
                if (auditoria.meta.arg) {
                    // console.log('sucesso', auditoria.payload)
                    //sucesso
                    notifySuccess()
                } else {
                    notifyError('Erro insesperado. Contacte o admin. 🤔')
                }
                setLoad(false)
                 */
            }
        } catch (error) {
            notifyError('Erro ao submeter o formulário. Contacte o admin. 🤔')
            setLoad(false)

        }

        //Primeiro deve-se 
        //1- buscar o equipamento na tabela armazem geral; 
        //2- Se existir , inserir o almoxarifário caso não tenha... caso tenha,actualizar  ;
        //3- subtrair a quantidade do equipamento no armazem geral; 
        //4- consequentemente cadastrar em auditoria ;



    }

    const getObras = async () => {
        try {
            const resultDispatch = await dispatch(fetchObra())

            const resultUnwrap = unwrapResult(resultDispatch)

            if (resultUnwrap.length) setObras(resultUnwrap)
        } catch (error) {

        }
    }

    function closeModal() {
        setIsOpen(false)
    }

    useEffect(() => {
        getObras()
    }, [])

    const notifySuccess = () => {

        setTimeout(function () {

            reset()

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
                                        className="text-lg font-bold leading-6 text-gray-900 text-center mb-5 flex space-x-3 items-center justify-center"
                                    >

                                        <BiTransferAlt />
                                        <span>Transferir para obra</span>
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
                                                {/** Pegar um produto do armazem e subtrair a quantidade que a obra pretende ao stock do armazem geral */}


                                                <EquipamentoAutoComplete
                                                    equipamentos={equipamentos}
                                                    setIdEquipamento={setIdEquipamento}
                                                />
                                            </div>
                                            <div className='flex gap-2 justify-center align-center'>
                                                <select
                                                    {...register('obra_id', {
                                                        required: { message: "Por favor, selecione o almoxarifado", value: true },
                                                        min: { message: "Preenchimento obrigatório!", value: 1 },
                                                    })}

                                                    className='rounded shadow w-1/2 cursor-pointer'>
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
                                                <select
                                                    {...register('estado', {
                                                        required: { message: "Por favor, introduza a Estado do equipamento.", value: true },
                                                    })}
                                                    className="w-1/2 rounded shadow cursor-pointer ">
                                                    <option className='text-gray-400' value="">Selecione o estado</option>
                                                    <option value="Novo">Novo</option>
                                                    <option value="Avariado">{'Avariado(a)'}</option>
                                                    <option value="Usado">Usado</option>
                                                    <option value="Vazia">{'Vazio(a)'}</option>
                                                </select>
                                            </div>
                                            <div className='flex gap-2 justify-center align-center'>
                                                <input
                                                    min={0}
                                                    type="number"
                                                    className='rounded shadow w-1/2'
                                                    placeholder='Quantidade a transferir *'
                                                    {...register('quantidade', {
                                                        required: { message: "Por favor, introduza a quantidade a transferir.", value: true },
                                                        minLength: { message: "Quantidade insuficiente", value: 1 },
                                                        min: { message: 'Quantidade insuficiente', value: 1 }
                                                    })}
                                                />
                                                <input
                                                    min={0}
                                                    type="date"
                                                    className='rounded shadow w-1/2'
                                                    placeholder='Data a transferir *'
                                                    {...register('data_transferencia', {
                                                        required: { message: "Por favor, introduza a data da transferência.", value: true },
                                                    })}
                                                />
                                            </div>


                                            <div className="mt-4 flex justify-end">
                                                <button
                                                    disabled={!isValid || load}
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
                                                {
                                                    !(errors.descricao_equipamento || errors.obra_id || errors.quantidade) && (
                                                        <p className='text-sm '>Os campos com * o seu preenchimento é de carácter obrigatório.</p>
                                                    )
                                                }
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

export default RemoveArmGeralParaObra
