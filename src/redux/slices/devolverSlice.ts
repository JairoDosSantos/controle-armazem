

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { supabase } from "../../utils/supabaseClient";

type DevolucaoType = {
    id: number;
    obraequipamentop_id: number;
    quantidade_devolver: number;
    data_devolucao: string
}

type duracaoState = {
    devolucoes: DevolucaoType[],
    loading: 'idle' | 'pending' | 'succeeded' | 'failed'
}

const initialState: duracaoState = {
    devolucoes: [],
    loading: 'idle',
}


export const fetchDevolucoes = createAsyncThunk('/devolucao/fetch', async () => {
    try {

        const { data, error } = await supabase
            .from('devolucao')
            .select("*")

        return data

    } catch (error) {
        return (error)
    }
})
export const insertDevolucao = createAsyncThunk('/devolucao/create', async ({ data_devolucao, obraequipamentop_id, quantidade_devolver }: DevolucaoType) => {
    try {

        const { data, error } = await supabase
            .from('devolucao')
            .insert({ data_devolucao, obraequipamentop_id, quantidade_devolver })
            .single()

        return data

    } catch (error) {
        return (error)
    }
})

export const updateDevolucao = createAsyncThunk('/devolucao/update', async ({ id, data_devolucao, obraequipamentop_id, quantidade_devolver }: DevolucaoType) => {
    try {

        const { data, error } = await supabase
            .from('devolucao')
            .update([{ data_devolucao, obraequipamentop_id, quantidade_devolver }])
            .match({ id })

        return data

    } catch (error) {
        return (error)
    }
})

export const deleteDevolucao = createAsyncThunk('/devolucao/delete', async ({ id }: DevolucaoType) => {
    try {

        const { data, error } = await supabase
            .from('devolucao')
            .delete()
            .match({ id })

        return data

    } catch (error) {
        return (error)
    }
})



export const devolverSlice = createSlice({
    name: 'Devolucao',
    initialState,
    reducers: {
    },
    extraReducers: (build) => {
        build.addCase(fetchDevolucoes.fulfilled, (state, action) => {
            state.devolucoes.push(action.payload as DevolucaoType)
        });

        build.addCase(insertDevolucao.fulfilled, (state, action) => {
            state.devolucoes.push(action.payload as DevolucaoType)
        });

    },
})


//export const { update } = encarregadoSlice.actions;

export default devolverSlice.reducer;