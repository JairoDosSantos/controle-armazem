import React from 'react'

import { FaBuilding, FaClock, FaAmbulance, FaUserAlt, FaTools, FaWater } from 'react-icons/fa'
import { BiBuildingHouse } from 'react-icons/bi'


type PainelItemProps = {
    titulo: string;
    rodape: string;
    quantidade: number;
    icone: string
}

const PainelItem = ({ titulo, quantidade, rodape, icone }: PainelItemProps) => {
    return (
        <div className='w-64 flex flex-col  gap-6 bg-white rounded shadow'>

            <div className='w-full text-end px-4 mt-3'>
                <span className='text-base font-semibold text-gray-500 select-none'>{titulo}</span>
            </div>
            <div className='flex gap-2 items-center justify-between px-6'>
                <div>
                    {icone === 'material_armazem' && (<FaWater className='text-6xl text-gray-700' />)}
                    {icone === 'obra_activa' && (<FaBuilding className='text-6xl text-gray-700' />)}
                    {icone === 'total_obra' && (<BiBuildingHouse className='text-6xl text-gray-700' />)}
                    {icone === 'epis_armazem' && (<FaAmbulance className='text-6xl text-gray-700' />)}
                    {icone === 'ferramenta_armazem' && (<FaTools className='text-6xl text-gray-700' />)}
                    {icone === 'encarregado' && (<FaUserAlt className='text-6xl text-gray-700' />)}
                    {icone === 'ttl' && (<FaClock className='text-6xl text-gray-700' />)}

                </div>

                <span className={`font-bold ${quantidade > 0 ? 'text-blue-700' : 'text-red-700'} text-6xl select-none`}>{quantidade}</span>

            </div>

            <div className='w-full text-center bg-gray-200 p-4 mb-0'>
                <span className='text-gray-500 font-bold select-none'>{rodape}</span>
            </div>

        </div>
    )
}

export default PainelItem;
