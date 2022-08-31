

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { supabase } from "../../utils/supabaseClient";

type EncarregadoType = {
    id: number;
    nome: string;
    telefone: string
}

type EncarregadoState = {
    encarregados: EncarregadoType[],
    loading: 'idle' | 'pending' | 'succeeded' | 'failed'
}

const initialState: EncarregadoState = {
    encarregados: [],
    loading: 'idle',
}


export const fetchEncarregados = createAsyncThunk('/encarregado/fetchAll', async () => {
    try {

        const { data, error } = await supabase
            .from('encarregado')
            .select("*")
            .order('id', { ascending: true })

        if (data) {
            return data
        } else {
            return error
        }

    } catch (error) {
        return (error)
    }
})
export const insertEncarregado = createAsyncThunk('/encarregado/create', async ({ nome, telefone }: Omit<EncarregadoType, 'id'>) => {
    try {

        const { data, error } = await supabase
            .from('encarregado')
            .insert({ nome, telefone })
            .single()

        if (error) {
            return false
        }
        return true

    } catch (error) {
        return (error)
    }
})

export const updateEncarregados = createAsyncThunk('/encarregado/update', async ({ id, nome, telefone }: EncarregadoType) => {
    try {

        const { data, error } = await supabase
            .from('encarregado')
            .update([{ nome, telefone }])
            .match({ id })
        if (error) return false
        return true

    } catch (error) {
        return (error)
    }
})

export const deleteEncarregado = createAsyncThunk('/encarregado/delete', async (id: number) => {
    try {

        const { data, error } = await supabase
            .from('encarregado')
            .delete()
            .match({ id })

        if (error) {

            return false

        }

        return true

    } catch (error) {
        return (error)
    }
})



export const encarregadoSlice = createSlice({
    name: 'Encarregado',
    initialState,
    reducers: {
    },
    extraReducers: (build) => {
        build.addCase(fetchEncarregados.fulfilled, (state, action) => {
            state.encarregados.push(action.payload as EncarregadoType)
        });

        build.addCase(insertEncarregado.fulfilled, (state, action) => {
            state.encarregados.push(action.payload as EncarregadoType)
        });

    },
})


//export const { update } = encarregadoSlice.actions;

export default encarregadoSlice.reducer;