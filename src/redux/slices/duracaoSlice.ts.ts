

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { supabase } from "../../utils/supabaseClient";

type duracaoType = {
    id: number;
    tempo: string;
}

type duracaoState = {
    duracoes: duracaoType[],
    loading: 'idle' | 'pending' | 'succeeded' | 'failed'
}

const initialState: duracaoState = {
    duracoes: [],
    loading: 'idle',
}


export const fetchDuracao = createAsyncThunk('/duracao/fetchAll', async () => {
    try {

        const { data, error } = await supabase
            .from('duracao')
            .select("*")

        if (error) return error
        return data

    } catch (error) {
        return (error)
    }
})
export const insertDuracao = createAsyncThunk('/duracao/create', async ({ tempo }: duracaoType) => {
    try {

        const { data, error } = await supabase
            .from('duracao')
            .insert({ tempo })
            .single()

        return data

    } catch (error) {
        return (error)
    }
})

export const updateDuracao = createAsyncThunk('/duracao/update', async ({ id, tempo }: duracaoType) => {
    try {

        const { data, error } = await supabase
            .from('duracao')
            .update([{ tempo }])
            .match({ id })

        return data

    } catch (error) {
        return (error)
    }
})

export const deleteDuracao = createAsyncThunk('/duracao/delete', async ({ id }: duracaoType) => {
    try {

        const { data, error } = await supabase
            .from('duracao')
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
        build.addCase(fetchDuracao.fulfilled, (state, action) => {
            state.duracoes.push(action.payload as duracaoType)
        });

        build.addCase(insertDuracao.fulfilled, (state, action) => {
            state.duracoes.push(action.payload as duracaoType)
        });

    },
})


//export const { update } = encarregadoSlice.actions;

export default duracaoSlice.reducer;