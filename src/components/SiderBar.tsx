


import Image from 'next/image'
import Link from 'next/link'
import Logo from '../assets/noah.png'

import { FaTools, FaHome, FaShopify, FaArrowsAltH, FaCarAlt, FaSignOutAlt, FaUser, FaBuilding, FaListAlt, FaListOl, FaList, FaClock } from 'react-icons/fa'

import api from '../services/api'
import { useRouter } from 'next/router'
import { useSelector } from "react-redux";

type SiderBarProps = {
    itemActive: string
}



const SiderBar = ({ itemActive }: SiderBarProps) => {

    const router = useRouter()

    const { showSideBar } = useSelector((state: any) => state.geral)

    const logOut = async () => {

        try {

            router.push('/sair')

        } catch (error) {

        }

    }

    return (
        <aside className={` bg-white w-72 border-r h-screen min-h-screen transition ease-in-out duration-300  ${showSideBar ? 'flex flex-col translate-x-0' : 'translate-x-full hidden'} gap-4 px-6 py-6 text-center `}>
            <div className='flex flex-col justify-center items-center '>
                <Image src={Logo} alt="NOAH Logo" width={100} height={35} objectFit={'contain'} />
                {/**   <h3 className="font-bold mt-4 text-lg">S.C.A</h3> */}
            </div>
            <div className='mt-8 w-full'>
                <ul className='max-w-full mx-auto px-2 space-y-6 text-left text-base'>
                    <li className='flex gap-2 items-center'>
                        <span className='text-gray-400 font-bold cursor-default '>Painel de controle</span>
                    </li>
                    {
                        router.pathname.includes('/admin') ? (
                            <>
                                <li className={`flex gap-2 items-center text-sm animacao-link ${itemActive === 'painel-controlo' && 'active'}`}>
                                    <FaHome className='text-gray-500 text-lg ' />
                                    <Link href='/admin'>Página Inicial</Link>
                                </li>
                            </>) : (
                            <>
                                <li className={`flex gap-2 items-center text-sm animacao-link ${itemActive === 'painel-controlo' && 'active'}`}>
                                    <FaHome className='text-gray-500 text-lg ' />
                                    <Link href='/painel-controlo'>Página Inicial</Link>
                                </li>
                            </>
                        )
                    }
                    <li className='flex gap-2 items-center'>
                        <span className='text-gray-400 font-bold cursor-default '>Cadastros</span>
                    </li>
                    {
                        (router.pathname.includes('/admin')) ? (
                            <>
                                <li
                                    title='Gerir Encarregados'
                                    className={`flex gap-2 items-center text-sm animacao-link ${itemActive === 'encarregado' && 'active'}`}>
                                    <FaUser className='text-gray-500 text-lg ' />
                                    <Link href='/admin/encarregado'>Encarregado</Link>
                                </li>
                                <li
                                    title='Gerir Encarregados'
                                    className={`flex gap-2 items-center text-sm animacao-link ${itemActive === 'usuario' && 'active'}`}>
                                    <FaUser className='text-gray-500 text-lg ' />
                                    <Link href='/admin/registrar-usuario'>Usuário</Link>
                                </li>
                                <li
                                    title='Gerir Obras'
                                    className={`flex gap-2 items-center text-sm animacao-link ${itemActive === 'obra' && 'active'}`}>
                                    <FaBuilding className='text-gray-500 text-lg' />
                                    <Link href='/admin/obra'>Obra</Link>
                                </li>
                                <li
                                    title='Gerir Classificações'
                                    className={`flex gap-2 items-center text-sm animacao-link ${itemActive === 'classificacao' && 'active'}`}>
                                    <FaListAlt className='text-gray-500 text-lg' />
                                    <Link href='/admin/classificacao'>Classificação</Link>
                                </li>
                                <li
                                    title='Gerir Tempos dos equipamentos'
                                    className={`flex gap-2 items-center text-sm animacao-link ${itemActive === 'duracao' && 'active'}`}>
                                    <FaClock className='text-gray-500 text-lg' />
                                    <Link href='/admin/duracao'>Tempo de duração</Link>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className={`flex gap-2 items-center text-sm animacao-link  ${itemActive === 'equipamento' && 'active'}`}>
                                    <FaTools className='text-gray-500 text-lg' />
                                    <Link href='/equipamento'>Equipamento</Link>
                                </li>
                                <li>
                                    <span className='text-gray-400 font-bold cursor-default '>Relatórios</span>
                                </li>
                                <li className={`flex gap-2 items-center text-sm animacao-link ${itemActive === 'posicao-armazem' && 'active'}`}>
                                    <FaList className='text-gray-500 text-lg' />
                                    <Link href='/posicao-armazem'>Armazem geral</Link>
                                </li>
                                <li className={`flex gap-2 items-center text-sm animacao-link ${itemActive === 'posicao-obra' && 'active'}`}>
                                    <FaListOl className='text-gray-500 text-lg' />
                                    <Link href='/posicao-obra'>Almoxarifado</Link>
                                </li>
                                <li className={`flex gap-2 items-center text-sm animacao-link ${itemActive === 'saidas' && 'active'}`}>
                                    <FaArrowsAltH className='text-gray-500 text-lg' />
                                    <Link href='/auditoria'>Movimentações</Link>
                                </li>
                                <li className={`flex gap-2 items-center text-sm animacao-link ${itemActive === 'devolucoes' && 'active'}`}>
                                    <FaShopify className='text-gray-500 text-lg' />
                                    <Link href='/compras'>Compras</Link>
                                </li>
                                <li className={`flex gap-2 items-center text-sm animacao-link ${itemActive === 'gt' && 'active'}`}>
                                    <FaCarAlt className='text-gray-500 text-lg' />
                                    <Link href='/GT'>Guia de Transporte</Link>
                                </li>
                            </>
                        )
                    }

                    {/**
                     * <li className={`flex gap-2 items-center hidden text-sm animacao-link hover:brightness-75 relative ${itemActive === 'esgotar' && 'active'}`}>
                        <FaClock className='text-gray-500 text-lg' />
                        <Link href='/esgotar'>À esgotar</Link>
                        {itemActive !== 'esgotar' && (<span className='bg-red-700 text-white px-2 py-[2px] rounded-full absolute -top-3 right-28 cursor-default select-none'>3</span>)}
                    </li>
                     */}

                </ul>
            </div>
            <div className='mt-8  max-w-full '>


                <div className='flex gap-2 items-center text-sm animacao-link  bg-white cursor-pointer'>
                    <FaSignOutAlt className='text-gray-500 text-lg' />
                    <span onClick={logOut}>Terminar sessão</span>
                </div>


            </div>
        </aside>
    )
}

export default SiderBar
