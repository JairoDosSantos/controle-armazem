import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { FormEvent, useState } from 'react'

import { FaArrowAltCircleRight } from 'react-icons/fa'
import { useDispatch } from 'react-redux'

import Logo from '../assets/noah.png'
import Load from '../assets/load.gif'
import dynamic from 'next/dynamic'

const SweetAlert2 = dynamic(() => import('react-sweetalert2'), { ssr: false })
//Api
import api from '../services/api'
import { updateUser } from '../redux/slices/geralSlice'


const Home: NextPage = () => {

  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [load, setLoad] = useState(false)
  const dispatch = useDispatch<any>();
  const [showErrorAlert, setShowErrorAlert] = useState(false)

  const signInUser = async (event: FormEvent) => {

    event.preventDefault();

    setLoad(true)

    try {
      const response = await api.post('api/login', {
        email: email,
        password: password
      })

      const { user, error } = response.data

      if (error) {
        // setShowHide('flex')
        setShowErrorAlert(true)
        setLoad(false)
        return
      }
      if (user) {
        await dispatch(updateUser({ user: user.email }))
        // setShowSuccess('flex')
        setLoad(false)
        router.push('/painel-controlo')
      }
    } catch (error) {
      setShowErrorAlert(true)
      setLoad(false)
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center  justify-center space-y-8 py-2 bg-gray-50">
      <Head>
        <title>SCA | Login</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/**Error Alert */}
      <SweetAlert2
        backdrop={true}
        show={showErrorAlert}
        title='Erro'
        text='Ocorreu um erro ao efectuar a operação. Por favor, certifique-se que tem a permissão para acessar o sistema!'
        icon='error'
        onConfirm={() => setShowErrorAlert(false)}
        didClose={() => setShowErrorAlert(false)}
        didDestroy={() => setShowErrorAlert(false)}
        allowOutsideClick={true}
        allowEnterKey={true}
        allowEscapeKey={true}
        showConfirmButton={true}
        confirmButtonColor="#4051ef"

      />
      <main className="flex w-full flex-1 flex-col items-center justify-center lg:px-20 text-center ">
        <div className='shadow-md py-8 px-12 rounded  lg:w-[720px] bg-white animate__animated animate__fadeIn'>

          <div>
            <Image src={Logo} alt="NOAH Logo" width={100} height={35} objectFit={'contain'} />
            <h1 className=" font-bold mt-2">
              Sistema de Controle de Armazem <span className='text-blue-600'> S.C.A</span>
            </h1>
          </div>


          <div className="mt-6 flex max-w-2xl flex-wrap items-center justify-around sm:w-96 mx-auto">
            <form className='w-full flex flex-col gap-4' >
              <div className='flex flex-col justify-start space-y-4'>
                <label htmlFor="E-mail" className='text-left font-semibold bg-white'>Email :</label>
                <input
                  onChange={(event) => setEmail(event.target.value)}
                  type="email"
                  id='E-mail'
                  className='rounded  shadow items-center'
                  placeholder='exemplo@gmail.com' />
              </div>
              <div className='flex flex-col space-y-4'>
                <label htmlFor="Password" className='text-left font-semibold bg-white'>Password :</label>
                <input
                  onChange={(event) => setPassword(event.target.value)}
                  type={'password'}
                  id='Password'
                  className='rounded  shadow items-center '
                  placeholder='**********************' />
              </div>

              <div className='flex space-x-3 justify-end'>
                <button
                  onClick={() => setLoad(false)}
                  type={'reset'}
                  className='bg-gray-700 text-white  font-semibold px-4 py-2 mt-4 hover:brightness-75 rounded'>
                  Cancelar</button>

                <button
                  onClick={signInUser}
                  type='button'
                  className='bg-blue-700 text-white font-semibold px-4 py-2 mt-4 hover:brightness-75 rounded flex gap-2 items-center'>

                  {load ? (<Image src={Load} objectFit={"contain"} width={20} height={15} />) : (<FaArrowAltCircleRight />)}
                  <span>Acessar</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <footer className="flex h-24 w-full items-center justify-center border-t bg-white ">
        <span
          className="flex flex-col md:flex-row  items-center justify-center gap-2 text-lg select-none"
        >
          Sistema de Controle de Armazem{' '}
          <Image src={Logo} alt="NOAH Logo" width={100} height={25} objectFit={'contain'} />
        </span>
      </footer>
    </div>

  )
}

export default Home
