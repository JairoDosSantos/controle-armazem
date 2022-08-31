import React, { useState } from 'react'
import Header from '../components/Header'
import PainelItem from '../components/Painel-Item'
import SiderBar from '../components/SiderBar'

const PainelControlo = () => {

    const [hideSideBar, setHideSideBar] = useState(false)

    return (
        <div className='flex'>
            <SiderBar itemActive='painel-controlo' hideSideBar={hideSideBar} />
            <main className='flex-1 space-y-6'>
                <div>
                    <Header hideSideBar={hideSideBar} setHideSideBar={setHideSideBar} />
                </div>

                <div className='overflow-auto max-h-[85vh] overflow-hide-scroll-bar'>
                    <div className=' flex flex-wrap gap-6 pl-6 mx-auto justify-center items-center lg:justify-start'>
                        <PainelItem icone='obra_activa' quantidade={2} rodape='Total de obras activas' titulo='Obras activas' />
                        <PainelItem icone='total_obra' quantidade={5} rodape='Número total de obras' titulo='Número de Obras' />
                        <PainelItem icone='epis_armazem' quantidade={8} rodape='Total de EPIs em armazem' titulo='EPIS em armazem' />
                        <PainelItem icone='ferramenta_armazem' quantidade={4} rodape='Total de Ferramentaria em armazem' titulo='Ferramentaria em armazem' />
                        <PainelItem icone='material_armazem' quantidade={7} rodape='Total de Materiais em armazem' titulo='Material em armazem' />
                        <PainelItem icone='encarregado' quantidade={3} rodape='Total de Encarregados em obras' titulo='Encarregados' />
                        <PainelItem icone='ttl' quantidade={10} rodape='Stock de SOS atingido em armazem' titulo='A esgotar' />
                    </div>
                    <div className='mt-4 text-end px-4 py-2 max-w-6xl overflow-x-auto  mx-auto bg-white rounded'>
                        <span className='font-semibold text-lg'>À esgotar</span>
                        <table className='table w-full text-center mt-2 animate__animated animate__fadeIn'>
                            <thead>
                                <tr className='flex justify-between bg-gray-200 px-4 py-2 rounded'>
                                    <th className='text-gray-600 font-bold w-1/5'>ID</th>
                                    <th className='text-gray-600 font-bold w-1/5 '>Descrição</th>
                                    <th className='text-gray-600 font-bold w-1/5'>Classificação</th>
                                    <th className='text-gray-600 font-bold w-1/5'>Tempo de duração</th>
                                    <th className='text-gray-600 font-bold w-1/5'>Quantidade</th>
                                    <th className='text-gray-600 font-bold w-1/5'>Data de Compra</th>
                                </tr>
                            </thead>
                            <tbody className=''>
                                <tr className='flex justify-between border shadow-md mt-4 px-4 py-2'>
                                    <td className="w-1/5 ">1</td>
                                    <td className="w-1/5 ">Cimento Cola</td>
                                    <td className="w-1/5 ">Material</td>
                                    <td className="w-1/5 ">uso imediato</td>
                                    <td className="w-1/5 ">2</td>
                                    <td className="w-1/5 ">22-08-2022</td>

                                </tr>
                                <tr className='flex justify-between border shadow-md mt-4 px-4 py-2'>
                                    <td className="w-1/5 ">2</td>
                                    <td className="w-1/5 ">Martelo de burracha</td>
                                    <td className="w-1/5 ">Ferramenta</td>
                                    <td className="w-1/5 ">2 à 5 anos</td>
                                    <td className="w-1/5 ">3</td>
                                    <td className="w-1/5 ">22-08-2022</td>

                                </tr>
                                <tr className='flex justify-between border shadow-md mt-4 px-4 py-2'>
                                    <td className="w-1/5 ">3</td>
                                    <td className="w-1/5 ">Capacete</td>
                                    <td className="w-1/5 ">EPI</td>
                                    <td className="w-1/5 ">0.5 à 1 ano</td>
                                    <td className="w-1/5 ">5</td>
                                    <td className="w-1/5 ">24-08-2022</td>

                                </tr>

                            </tbody>
                        </table>
                    </div>
                </div>


            </main>
        </div>
    )
}

export default PainelControlo
