import { FormEvent, Fragment, useEffect, useState } from 'react'
import { Combobox, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'

import { useDispatch } from 'react-redux';

import { unwrapResult } from '@reduxjs/toolkit';
import { fetchEquipamento } from '../redux/slices/equipamentoSlice';


type EquipamentosType = {
    id: number;
    descricao: string;
    duracao_id: number;
    classificacao_id: number;
    data: string
}

type AutoCompleteProps = {
    equipamentos: EquipamentosType[];
    setIdEquipamento: (id: number) => void
}




export default function EquipamentoAutoComplete({ equipamentos, setIdEquipamento }: AutoCompleteProps) {

    const [selected, setSelected] = useState({ id: 0, descricao: '', duracao_id: 0, classificacao_id: 0, data: '' } as EquipamentosType)
    const [query, setQuery] = useState('')

    /**
     * const handleChange = (event: FormEvent) => {
        event.preventDefault();
        const queryValue = event.target as HTMLInputElement
        if (queryValue.value !== '') {
            setSelected({ id: 0, descricao: '', duracao_id: 0, classificacao_id: 0, data: '' })
            setQuery(queryValue.value);


            setIdEquipamento(0)
        }
    }
     */
    const filteredEquipamento = query !== '' && equipamentos.length ? equipamentos.filter((equipamento) => equipamento.descricao.toLowerCase().includes(query.toLowerCase())) : []

    useEffect(() => {
        setIdEquipamento(selected.id)
    }, [selected.id])



    return (
        <div className="w-full">
            <Combobox value={selected} onChange={setSelected}>
                <div className="relative mt-1">
                    <div
                        className="relative w-full cursor-default overflow-hidden text-left 
                        focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 
                        focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                        <Combobox.Input
                            placeholder='Descrição do Equipamento'
                            className="w-full border bg-white rounded py-3  shadow leading-5 text-gray-900"
                            displayValue={(equipamento: EquipamentosType) => equipamento.descricao || query}
                            onChange={(event) => setQuery(event.target.value)}
                        />
                        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                            <SelectorIcon
                                className="h-5 w-5 text-gray-400"
                                aria-hidden="true"
                            />
                        </Combobox.Button>
                    </div>
                    <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"

                    >
                        <Combobox.Options
                            className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 
                            ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                            {filteredEquipamento.length === 0 && query !== '' ? (
                                <div className="relative cursor-default select-none py-2 px-4 text-gray-700 hidden bg-red-700">
                                    <span>Sem results</span>
                                </div>
                            ) : (
                                filteredEquipamento.map((equipamento) => (
                                    <Combobox.Option
                                        key={equipamento.id}
                                        className={({ active }) =>
                                            `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-gray-400 text-white' : 'text-gray-900'
                                            }`
                                        }
                                        value={equipamento}
                                    >
                                        {({ selected, active }) => (
                                            <>
                                                <span
                                                    className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                                                        }`}
                                                >
                                                    {equipamento.descricao}
                                                </span>
                                                {selected ? (
                                                    <span
                                                        className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? 'text-white' : 'text-gray-400'
                                                            }`}
                                                    >
                                                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                    </span>
                                                ) : null}
                                            </>
                                        )}
                                    </Combobox.Option>
                                ))
                            )}
                        </Combobox.Options>
                    </Transition>
                </div>
            </Combobox>
        </div>
    )
}
