

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { supabase } from "../../utils/supabaseClient";

type SaidaType = {
    id: number;
    equipamento_id: number;
    obra_id: number;
    data_retirada: string;
    quantidade_retirada: number
}

type duracaoState = {
    saidas: SaidaType[],
    loading: 'idle' | 'pending' | 'succeeded' | 'failed'
}

const initialState: duracaoState = {
    saidas: [],
    loading: 'idle',
}


export const fetchSaida = createAsyncThunk('/saida/fetch', async () => {
    try {

        const { data, error } = await supabase
            .from('saida')
            .select("*")

        return data

    } catch (error) {
        return (error)
    }
})
export const insertSaida = createAsyncThunk('/saida/create', async ({ data_retirada, equipamento_id, obra_id, quantidade_retirada }: SaidaType) => {
    try {

        const { data, error } = await supabase
            .from('saida')
            .insert({ data_retirada, equipamento_id, obra_id, quantidade_retirada })
            .single()

        return data

    } catch (error) {
        return (error)
    }
})

export const updateSaida = createAsyncThunk('/saida/update', async ({ id, data_retirada, equipamento_id, obra_id, quantidade_retirada }: SaidaType) => {
    try {

        const { data, error } = await supabase
            .from('saida')
            .update([{ data_retirada, equipamento_id, obra_id, quantidade_retirada }])
            .match({ id })

        return data

    } catch (error) {
        return (error)
    }
})

export const deleteSaida = createAsyncThunk('/saida/delete', async ({ id }: SaidaType) => {
    try {

        const { data, error } = await supabase
            .from('saida')
            .delete()
            .match({ id })

        return data

    } catch (error) {
        return (error)
    }
})



export const duracaoSlice = createSlice({
    name: 'duracao',
    initialState,
    reducers: {
    },
    extraReducers: (build) => {
        build.addCase(fetchSaida.fulfilled, (state, action) => {
            state.saidas.push(action.payload as SaidaType)
        });

        build.addCase(insertSaida.fulfilled, (state, action) => {
            state.saidas.push(action.payload as SaidaType)
        });

    },
})


//export const { update } = encarregadoSlice.actions;

export default duracaoSlice.reducer;