import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import React, { useState } from 'react'
import Header from '../components/Header'
import PainelItem from '../components/Painel-Item'
import SiderBar from '../components/SiderBar'
import nookies from 'nookies'
import { wrapper } from '../redux/store'
import { fetchObra, fetchObraActiva } from '../redux/slices/obraSlice'
import { fetchEncarregados } from '../redux/slices/encarregadoSlice'
import { fetchArmGeralByClassificcao, fetchEsgotar } from '../redux/slices/armGeralSlice'


type PainelProps = {
    totalObras: number;
    obrasActivas: number;
    totalEncarregados: number;
    TotalHSST: number;
    TotalFerramenta: number;
    TotalMateriais: number

}

const PainelControlo = ({ obrasActivas, totalObras, totalEncarregados, TotalHSST, TotalFerramenta, TotalMateriais }: PainelProps) => {

    const [hideSideBar, setHideSideBar] = useState(false)

    return (
        <div className='flex'>
            <SiderBar itemActive='painel-controlo' hideSideBar={hideSideBar} />
            <main className='flex-1 space-y-6'>
                <div>
                    <Header hideSideBar={hideSideBar} setHideSideBar={setHideSideBar} />
                </div>

                <div className='overflow-auto max-h-[85vh] overflow-hide-scroll-bar'>
                    <div className=' flex flex-wrap gap-6  justify-center items-center'>
                        <PainelItem icone='obra_activa' quantidade={obrasActivas} rodape='Total de obras activas' titulo='Obras activas' />
                        <PainelItem icone='total_obra' quantidade={totalObras} rodape='Número total de obras' titulo='Número de Obras' />
                        <PainelItem icone='epis_armazem' quantidade={TotalHSST} rodape='Total de EPIs em armazem' titulo='EPIS em armazem' />
                        <PainelItem icone='ferramenta_armazem' quantidade={TotalFerramenta} rodape='Total de Ferramentaria em armazem' titulo='Ferramentaria em armazem' />
                        <PainelItem icone='material_armazem' quantidade={TotalMateriais} rodape='Total de Materiais em armazem' titulo='Material em armazem' />
                        <PainelItem icone='encarregado' quantidade={totalEncarregados} rodape='Total de Encarregados em obras' titulo='Encarregados' />
                        {/**      <PainelItem icone='ttl' quantidade={10} rodape='Stock de SOS atingido em armazem' titulo='A esgotar' /> */}
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


export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(
    (store) =>
        async (context: GetServerSidePropsContext) => {

            const cookie = nookies.get(context);

            const obrasActivas: any = await (await store.dispatch(fetchObraActiva())).payload;
            const totalObras: any = await (await store.dispatch(fetchObra())).payload
            const totalEncarregado: any = await (await store.dispatch(fetchEncarregados())).payload
            const TotalHSSTs: any = await (await store.dispatch(fetchArmGeralByClassificcao(1))).payload
            const totalFerramentas: any = await (await store.dispatch(fetchArmGeralByClassificcao(4))).payload
            const TotalMaterial: any = await (await store.dispatch(fetchArmGeralByClassificcao(2))).payload
            const esgotar = await store.dispatch(fetchEsgotar())
            console.log(esgotar)
            const totalObrasActivas = obrasActivas ? obrasActivas.length : 0
            const totalObra = totalObras ? totalObras.length : 0
            const totalEncarregados = totalEncarregado ? totalEncarregado.length : 0
            const TotalHSST = TotalHSSTs ? TotalHSSTs.length : 0
            const TotalFerramenta = totalFerramentas ? totalFerramentas.length : 0
            const TotalMateriais = TotalMaterial ? TotalMaterial.length : 0


            if (!cookie.USER_LOGGED_ARMAZEM) {
                // If no user, redirect to index.
                return { props: {}, redirect: { destination: '/', permanent: false } }
            } else {
                return {
                    props: {
                        obrasActivas: totalObrasActivas,
                        totalObras: totalObra,
                        totalEncarregados,
                        TotalHSST,
                        TotalFerramenta,
                        TotalMateriais
                    },
                };
            }



        }
);

/**
 * export async function getServerSideProps(context: GetServerSidePropsContext) {

    const cookie = nookies.get(context);

    if (!cookie.USER_LOGGED_ARMAZEM) {
        // If no user, redirect to index.
        return { props: {}, redirect: { destination: '/', permanent: false } }
    }

    return {
        props:
        {
            cookie
        }
    }
}
 */

export default PainelControlo
