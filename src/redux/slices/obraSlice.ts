

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
    loading: 'idle',
}


export const fetchObra = createAsyncThunk('/encarregado/fetch', async () => {
    try {

        const { data, error } = await supabase
            .from('obra')
            .select("*")

        return data

    } catch (error) {
        return (error)
    }
})
export const insertObra = createAsyncThunk('/obra/create', async ({ encarregado_id, estado, obra_nome }: ObraType) => {
    try {

        const { data, error } = await supabase
            .from('obra')
            .insert({ encarregado_id, estado, obra_nome })
            .single()

        return data

    } catch (error) {
        return (error)
    }
})

export const updateObra = createAsyncThunk('/obra/update', async ({ id, encarregado_id, estado, obra_nome }: ObraType) => {
    try {

        const { data, error } = await supabase
            .from('obra')
            .update([{ encarregado_id, estado, obra_nome }])
            .match({ id })

        return data

    } catch (error) {
        return (error)
    }
})

export const deleteObra = createAsyncThunk('/obra/delete', async ({ id }: ObraType) => {
    try {

        const { data, error } = await supabase
            .from('obra')
            .delete()
            .match({ id })

        return data

    } catch (error) {
        return (error)
    }
})



export const obraSlice = createSlice({
    name: 'Obra',
    initialState,
    reducers: {
    },
    extraReducers: (build) => {
        build.addCase(fetchObra.fulfilled, (state, action) => {
            state.obras.push(action.payload as ObraType)
        });

        build.addCase(insertObra.fulfilled, (state, action) => {
            state.obras.push(action.payload as ObraType)
        });

    },
})


//export const { update } = encarregadoSlice.actions;

export default obraSlice.reducer;