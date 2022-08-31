import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { supabase } from "../../utils/supabaseClient";

type ObraType = {
    id: number;
    obra_nome: string;
    encarregado_id: number;
    estado: 'Activa' | 'Inactiva' | 'Concluida'
}

type ObraState = {
    obras: ObraType[],
    loading: 'idle' | 'pending' | 'succeeded' | 'failed'
}

const initialState: ObraState = {
    obras: [],
    loading: 'idle'
}

export const fetchObra = createAsyncThunk('/obra/fetchAll', async () => {
    try {


        const { data, error } = await supabase
            .from('obra')
            .select("id,obra_nome,encarregado_id(id,nome,telefone),estado")


        if (data) {
            return data
        } else {
            return error
        }

    } catch (error) {
        return (error)
    }
})

export const insertObra = createAsyncThunk('/obra/create', async ({ encarregado_id, estado, obra_nome, id }: ObraType) => {
    try {

        const { data, error } = await supabase
            .from('obra')
            .insert({ encarregado_id, estado, obra_nome })
            .single()

        console.log('error', error)
        console.log('data', data)

        return { nome: 'Jairo dos Santos' }

    } catch (error) {
        return (error)
    }
})

export const updateObra = createAsyncThunk('/obra/update', async ({ id, encarregado_id, estado, obra_nome }: ObraType) => {
    try {

        const { data, error } = await supabase
            .from('obra')
            .update([
                {
                    encarregado_id,
                    estado,
                    obra_nome
                }
            ])
            .match({ id })

        if (error) {
            return false
        }
        return true
    } catch (error) {
        return (error)
    }
})

export const deleteObra = createAsyncThunk('/obra/delete', async (id: number) => {
    try {

        const { data, error } = await supabase
            .from('obra')
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

export const obraSlice = createSlice({
    name: 'Obra',
    initialState,
    reducers: {},
    extraReducers: (build) => {
        build.addCase(fetchObra.fulfilled, (state, action) => {
            state
                .obras
                .push(action.payload as ObraType)
        });

        build.addCase(insertObra.fulfilled, (state, action) => {
            state
                .obras
                .push(action.payload as ObraType)
        });

    }
})

//export const { update } = encarregadoSlice.actions;

export default obraSlice.reducer;