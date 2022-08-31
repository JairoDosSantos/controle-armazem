

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


export const fetchObraEquipamento = createAsyncThunk('/almoxarifario/fetchAll', async () => {
    try {

        const { data, error } = await supabase
            .from('almoxarifario')
            .select("data_aquisicao,equipamento_id(id,descricao),obra_id(obra_nome,id,estado),quantidade_a_levar")

        return data

    } catch (error) {
        return (error)
    }
})
export const insertobraEquipamento = createAsyncThunk('/almoxarifario/create', async ({ data_aquisicao, equipamento_id, obra_id, quantidade_a_levar }: ObraEquipamentoType) => {
    try {

        const { data, error } = await supabase
            .from('almoxarifario')
            .insert({ data_aquisicao, equipamento_id, obra_id, quantidade_a_levar })
            .single()

        return data

    } catch (error) {
        return (error)
    }
})

export const updateobraEquipamento = createAsyncThunk('/almoxarifario/update', async ({ id, data_aquisicao, equipamento_id, obra_id, quantidade_a_levar }: ObraEquipamentoType) => {
    try {

        const { data, error } = await supabase
            .from('almoxarifario')
            .update([{ data_aquisicao, equipamento_id, obra_id, quantidade_a_levar }])
            .match({ id })

        return data

    } catch (error) {
        return (error)
    }
})

export const deleteobraEquipamento = createAsyncThunk('/almoxarifario/delete', async ({ id }: ObraEquipamentoType) => {
    try {

        const { data, error } = await supabase
            .from('almoxarifario')
            .delete()
            .match({ id })

        return data

    } catch (error) {
        return (error)
    }
})



export const Almoxarifario = createSlice({
    name: 'Almoxarifario',
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

export default Almoxarifario.reducer;