


import Image from 'next/image'
import Link from 'next/link'
import Logo from '../assets/noah.png'

import { FaBuilding, FaTools, FaUser, FaClock, FaBookOpen, FaHome } from 'react-icons/fa'
import { AiFillCloseCircle } from 'react-icons/ai'

type SiderBarProps = {

    hideSideBar: boolean;
    itemActive: string
}

const SiderBar = ({ hideSideBar, itemActive }: SiderBarProps) => {
    return (
        <aside className={`bg-white w-72 border-r min-h-screen ${!hideSideBar ? 'flex flex-col ' : 'hidden'} gap-4 px-6 py-6 text-center `}>
            <div className='flex flex-col justify-center items-center '>
                <Image src={Logo} alt="NOAH Logo" width={100} height={35} objectFit={'contain'} />
                {/**   <h3 className="font-bold mt-4 text-lg">S.C.A</h3> */}
            </div>
            <div className='mt-12 w-full'>
                <ul className='max-w-full mx-auto px-2 space-y-6 text-left text-base'>
                    <li className='flex gap-2 items-center'>
                        <span className='text-gray-400 font-bold cursor-default '>Painel de controlo</span>

                    </li>
                    <li className={`flex gap-2 items-center text-sm ${itemActive === 'painel-controlo' && 'active'}`}>
                        <FaHome className='text-gray-500 text-lg ' />
                        <Link href='/painel-controlo'>Página Inicial</Link>
                    </li>
                    <li className='flex gap-2 items-center'>
                        <span className='text-gray-400 font-bold cursor-default '>Cadastros</span>
                    </li>
                    <li className={`flex gap-2 items-center text-sm ${itemActive === 'obra' && 'active'}`}>
                        <FaBuilding className='text-gray-500 text-lg' />
                        <Link href='/obra'>Gerir Obra</Link>
                    </li>
                    <li className={`flex gap-2 items-center text-sm ${itemActive === 'equipamento' && 'active'}`}>
                        <FaTools className='text-gray-500 text-lg' />
                        <Link href='/equipamento'>Gerir Equipamento</Link>
                    </li>
                    <li className={`flex gap-2 items-center text-sm ${itemActive === 'encarregado' && 'active'}`}>

                        <FaUser className='text-gray-500 text-lg ' />
                        <Link href='/encarregado'>Gerir Encarregado</Link>
                    </li>
                    <li>
                        <span className='text-gray-400 font-bold cursor-default '>Relatórios</span>
                    </li>
                    <li className={`flex gap-2 items-center text-sm ${itemActive === 'posicao-armazem' && 'active'}`}>
                        <FaBookOpen className='text-gray-500 text-lg' />
                        <Link href='/posicao-armazem'>Posição armazem</Link>
                    </li>
                    <li className={`flex gap-2 items-center text-sm ${itemActive === 'posicao-obra' && 'active'}`}>
                        <FaBookOpen className='text-gray-500 text-lg' />
                        <Link href='/posicao-obra'>Posição por Obra</Link>
                    </li>
                    <li className={`flex gap-2 items-center text-sm hover:brightness-75 relative ${itemActive === 'esgotar' && 'active'}`}>
                        <FaClock className='text-gray-500 text-lg' />
                        <Link href='/esgotar'>À esgotar</Link>
                        {itemActive !== 'esgotar' && (<span className='bg-red-700 text-white px-2 py-[2px] rounded-full absolute -top-3 right-28 cursor-default select-none'>3</span>)}
                    </li>

                </ul>
            </div>
            <div className='mt-12  max-w-full '>

                <Link href='/'>
                    <div className='flex gap-2 items-center text-sm  bg-white cursor-pointer'>
                        <AiFillCloseCircle className='text-gray-500 text-lg' />
                        <span>Terminar sessão</span>
                    </div>
                </Link>

            </div>
        </aside>
    )
}

export default SiderBar
