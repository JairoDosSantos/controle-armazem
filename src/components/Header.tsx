import Image from "next/image"

import User from '../assets/user.png'
import { FaBars } from 'react-icons/fa'


type HeaderProps = {
    setHideSideBar: (valor: boolean) => void;
    hideSideBar: boolean
}

const Header = ({ setHideSideBar, hideSideBar }: HeaderProps) => {
    return (
        <header className=" bg-white p-5 flex justify-between shadow ">
            <div>
                <span onClick={() => setHideSideBar(!hideSideBar)}>
                    <FaBars className="text-lg cursor-pointer" />
                </span>
            </div>
            <div className="flex items-center gap-4">
                <span className="text-gray-400 font-bold">Nome do Usuário</span>
                <Image src={User} className='rounded-full' width={25} height={25} objectFit={"contain"} />
            </div>
        </header>
    )
}

export default Header
