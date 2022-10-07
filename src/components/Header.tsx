import { useEffect, useState } from 'react'
import Image from "next/image"



import User from '../assets/user.png'
import { FaBars } from 'react-icons/fa'
import { useSelector } from "react-redux";
import { useDispatch } from 'react-redux';
import { hideSiderBar, updateUser } from '../redux/slices/geralSlice';
import cookie from 'nookies'
import { useRouter } from 'next/router';
import ThemeToggler from './ThemeToggler';

const Header = () => {

    const dispatch = useDispatch()
    const route = useRouter()
    const { user, showSideBar } = useSelector((state: any) => state.geral)
    const [userEmail, setUserEmail] = useState(user)
    const changeSideBarVisibility = () => {
        dispatch(hideSiderBar({ showSideBar: !showSideBar }))
    }

    useEffect(() => {

        const UserEmail = cookie.get(null)
        if (UserEmail.USER_LOGGED_ARMAZEM) {

            const emailUserParse = JSON.parse(UserEmail.USER_LOGGED_ARMAZEM)

            dispatch(updateUser(emailUserParse.email))
            setUserEmail(emailUserParse.email)
        }
    }, [route.pathname])

    return (
        <header className=" bg-white p-5 flex justify-between shadow z-50">
            <div>
                <span onClick={changeSideBarVisibility}>
                    <FaBars className="text-lg cursor-pointer animacao-link" />
                </span>
            </div>
            <div className="flex items-center gap-4">
                <span className="text-gray-400 font-bold">{userEmail}</span>
                <Image src={User} className='rounded-full' width={25} height={25} objectFit={"contain"} />
                {/**
             *     <ThemeToggler />
             */}
            </div>
        </header>
    )
}

export default Header
