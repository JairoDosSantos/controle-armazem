
import Image from "next/image"


import User from '../assets/user.png'
import { FaBars } from 'react-icons/fa'
import { useSelector } from "react-redux";
import { useDispatch } from 'react-redux';
import { hideSiderBar } from '../redux/slices/geralSlice';


const Header = () => {

    const dispatch = useDispatch()

    const { user, showSideBar } = useSelector((state: any) => state.geral)

    const changeSideBarVisibility = () => {
        dispatch(hideSiderBar({ showSideBar: !showSideBar }))
    }

    return (
        <header className=" bg-white p-5 flex justify-between shadow z-50">
            <div>
                <span onClick={changeSideBarVisibility}>
                    <FaBars className="text-lg cursor-pointer" />
                </span>
            </div>
            <div className="flex items-center gap-4">
                <span className="text-gray-400 font-bold">{user}</span>
                <Image src={User} className='rounded-full' width={25} height={25} objectFit={"contain"} />
            </div>
        </header>
    )
}

export default Header
