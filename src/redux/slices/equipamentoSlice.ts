

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { supabase } from "../../utils/supabaseClient";

type EquipamentoType = {
    id: number;
    descricao: string;
    classificacao_id: number;
    duracao_id: number;
    stock_emergencia: number
}

type equipamentoState = {
    equipamentos: EquipamentoType[],
    loading: 'idle' | 'pending' | 'succeeded' | 'failed'
}

const initialState: equipamentoState = {
    equipamentos: [],
    loading: 'idle',
}


export const fetchEquipamento = createAsyncThunk('/equipamento/fetchAll', async () => {
    try {

        const { data, error } = await supabase
            .from('equipamento')
            .select("id,descricao,classificacao_id(id,tipo),duracao_id(id,tempo),stock_emergencia")

        if (error) return false
        return data

    } catch (error) {
        return (error)
    }
})

export const insertEquipamento = createAsyncThunk('/equipamento/create', async ({ classificacao_id, descricao, duracao_id, stock_emergencia }: Omit<EquipamentoType, 'id'>) => {
    try {

        const { data, error } = await supabase
            .from('equipamento')
            .insert({ classificacao_id, descricao, duracao_id, stock_emergencia })
            .single()

        if (error) return false
        return true

    } catch (error) {
        return (error)
    }
})

export const updateDuracao = createAsyncThunk('/equipamento/update', async ({ id, classificacao_id, descricao, duracao_id }: EquipamentoType) => {
    try {

        const { data, error } = await supabase
            .from('equipamento')
            .update([{ classificacao_id, descricao, duracao_id }])
            .match({ id })

        return data

    } catch (error) {
        return (error)
    }
})

export const deleteDuracao = createAsyncThunk('/equipamento/delete', async ({ id }: EquipamentoType) => {
    try {

        const { data, error } = await supabase
            .from('equipamento')
            .delete()
            .match({ id })

        return data

    } catch (error) {
        return (error)
    }
})



export const equipamentoSlice = createSlice({
    name: 'equipamento',
    initialState,
    reducers: {
    },
    extraReducers: (build) => {
        build.addCase(fetchEquipamento.fulfilled, (state, action) => {
            state.equipamentos.push(action.payload as EquipamentoType)
        });

        build.addCase(insertEquipamento.fulfilled, (state, action) => {
            state.equipamentos.push(action.payload as EquipamentoType)
        });

    },
})


//export const { update } = encarregadoSlice.actions;

export default equipamentoSlice.reducer;