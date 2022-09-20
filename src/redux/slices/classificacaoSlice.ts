

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { supabase } from "../../utils/supabaseClient";

type ClassificacaoType = {
    id: number;
    tipo: string;
}

type ClassificacaoState = {
    classificacoes: ClassificacaoType[],
    loading: 'idle' | 'pending' | 'succeeded' | 'failed'
}

const initialState: ClassificacaoState = {
    classificacoes: [],
    loading: 'idle',
}


export const fetchClassificacao = createAsyncThunk('/classificacao/fetch', async () => {
    try {

        const { data, error } = await supabase
            .from('classificacao')
            .select("*")

        if (error) return error
        return data

    } catch (error) {
        return (error)
    }
})
export const insertClassificacao = createAsyncThunk('/classificacao/create', async ({ tipo }: Omit<ClassificacaoType, 'id'>) => {
    try {

        const { data, error } = await supabase
            .from('classificacao')
            .insert({ tipo })
            .single()

        return data

    } catch (error) {
        return (error)
    }
})

export const updateClassificacao = createAsyncThunk('/classificacao/update', async ({ id, tipo }: ClassificacaoType) => {
    try {

        const { data, error } = await supabase
            .from('classificacao')
            .update([{ tipo }])
            .match({ id })

        return data

    } catch (error) {
        return (error)
    }
})

export const deleteClassificacao = createAsyncThunk('/classificacao/delete', async (id: number) => {
    try {

        const { data, error } = await supabase
            .from('classificacao')
            .delete()
            .match({ id })

        return data

    } catch (error) {
        return (error)
    }
})



export const classificacaoSlice = createSlice({
    name: 'Classificacao',
    initialState,
    reducers: {
    },
    extraReducers: (build) => {
        build.addCase(fetchClassificacao.fulfilled, (state, action) => {
            state.classificacoes.push(action.payload as ClassificacaoType)
        });

        build.addCase(insertClassificacao.fulfilled, (state, action) => {
            state.classificacoes.push(action.payload as ClassificacaoType)
        });

    },
})


//export const { update } = encarregadoSlice.actions;

export default classificacaoSlice.reducer;