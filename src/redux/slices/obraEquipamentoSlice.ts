

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { supabase } from "../../utils/supabaseClient";

type ObraEquipamentoType = {
    id: number;
    obra_id: number;
    equipamento_id: number;
    data_aquisicao: string;
    quantidade_a_levar: number
}

type ObraEquipamentoState = {
    equipamentosObras: ObraEquipamentoType[],
    loading: 'idle' | 'pending' | 'succeeded' | 'failed'
}

const initialState: ObraEquipamentoState = {
    equipamentosObras: [],
    loading: 'idle',
}


export const fetchObraEquipamento = createAsyncThunk('/obraEquipamento/fetch', async () => {
    try {

        const { data, error } = await supabase
            .from('obraequipamento')
            .select("data_aquisicao,equipamento_id(id,descricao),obra_id(obra_nome,id,estado),quantidade_a_levar")

        return data

    } catch (error) {
        return (error)
    }
})
export const insertobraEquipamento = createAsyncThunk('/obraEquipamento/create', async ({ data_aquisicao, equipamento_id, obra_id, quantidade_a_levar }: ObraEquipamentoType) => {
    try {

        const { data, error } = await supabase
            .from('obraequipamento')
            .insert({ data_aquisicao, equipamento_id, obra_id, quantidade_a_levar })
            .single()

        return data

    } catch (error) {
        return (error)
    }
})

export const updateobraEquipamento = createAsyncThunk('/obraEquipamento/update', async ({ id, data_aquisicao, equipamento_id, obra_id, quantidade_a_levar }: ObraEquipamentoType) => {
    try {

        const { data, error } = await supabase
            .from('obraequipamento')
            .update([{ data_aquisicao, equipamento_id, obra_id, quantidade_a_levar }])
            .match({ id })

        return data

    } catch (error) {
        return (error)
    }
})

export const deleteobraEquipamento = createAsyncThunk('/obraEquipamento/delete', async ({ id }: ObraEquipamentoType) => {
    try {

        const { data, error } = await supabase
            .from('obraequipamento')
            .delete()
            .match({ id })

        return data

    } catch (error) {
        return (error)
    }
})



export const obraEquipamentoSlice = createSlice({
    name: 'ObraEquipamento',
    initialState,
    reducers: {
    },
    extraReducers: (build) => {
        build.addCase(fetchObraEquipamento.fulfilled, (state, action) => {
            state.equipamentosObras.push(action.payload as ObraEquipamentoType)
        });

        build.addCase(insertobraEquipamento.fulfilled, (state, action) => {
            state.equipamentosObras.push(action.payload as ObraEquipamentoType)
        });

    },
})


//export const { update } = encarregadoSlice.actions;

export default obraEquipamentoSlice.reducer;