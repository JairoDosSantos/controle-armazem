

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



export const fetchOneAlmoxarifario = createAsyncThunk('/almoxarifario/fetchOne', async ({ equipamento_id, obra_id }: Omit<ObraEquipamentoType, 'id' | 'data_aquisicao' | 'quantidade_a_levar'>) => {
    try {

        const { data, error } = await supabase
            .from('almoxarifario')
            .select("id,data_aquisicao,equipamento_id,obra_id,quantidade")
            .eq('equipamento_id', equipamento_id)
            .eq('obra_id', obra_id)

        if (error) return null
        return data

    } catch (error) {
        return (error)
    }
})

export const fetchAlmoxarifario = createAsyncThunk('/almoxarifario/fetchAll', async () => {
    try {

        const { data, error } = await supabase
            .from('almoxarifario')
            .select("id,data_aquisicao,equipamento_id(id,descricao,classificacao_id,duracao_id),obra_id(obra_nome,id,estado),quantidade")
        if (error) return null
        return data

    } catch (error) {
        return (error)
    }
})

export const insertAlmoxarifario = createAsyncThunk('/almoxarifarioNew/create', async ({ data_aquisicao, equipamento_id, obra_id, quantidade_a_levar }: Omit<ObraEquipamentoType, 'id'>) => {
    try {

        const { data, error } = await supabase
            .from('almoxarifario')
            .insert({ data_aquisicao, equipamento_id, obra_id, quantidade: quantidade_a_levar })

        if (error) return error

        return data

    } catch (error) {
        return (error)
    }
})

export const updateAlmoxarifario = createAsyncThunk('/almoxarifario/update', async ({ id, data_aquisicao, equipamento_id, obra_id, quantidade_a_levar }: ObraEquipamentoType) => {
    try {

        const { data, error } = await supabase
            .from('almoxarifario')
            .update([{ data_aquisicao, equipamento_id, obra_id, quantidade: quantidade_a_levar }])
            .eq('id', id)
        if (error) return null
        return data

    } catch (error) {
        return (error)
    }
})

export const deleteAlmoxarifario = createAsyncThunk('/almoxarifario/delete', async ({ id }: ObraEquipamentoType) => {
    try {

        const { data, error } = await supabase
            .from('almoxarifario')
            .delete()
            .match({ id })
        if (error) return null
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
        build.addCase(fetchAlmoxarifario.fulfilled, (state, action) => {
            state.equipamentosObras.push(action.payload as ObraEquipamentoType)
        });

        build.addCase(insertAlmoxarifario.fulfilled, (state, action) => {
            state.equipamentosObras.push(action.payload as ObraEquipamentoType)
        });

    },
})


//export const { update } = encarregadoSlice.actions;

export default Almoxarifario.reducer;