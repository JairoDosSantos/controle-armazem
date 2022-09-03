

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { supabase } from "../../utils/supabaseClient";

type AuditoriaType = {
    id: number;
    equipamento_id: number;
    obra_id: number;
    data_retirada: string;
    quantidade_retirada: number;
    data_devolucao: string;
    quantidade_devolvida: number
}

type duracaoState = {
    saidas: AuditoriaType[],
    loading: 'idle' | 'pending' | 'succeeded' | 'failed'
}

const initialState: duracaoState = {
    saidas: [],
    loading: 'idle',
}


export const fetchOneSaida = createAsyncThunk('/auditoria/fetchAll', async ({ data_retirada, equipamento_id, obra_id }: Omit<AuditoriaType, 'id' | 'quantidade_retirada' | 'data_devolucao' | 'quantidade_devolvida'>) => {
    try {

        const { data, error } = await supabase
            .from('auditoria')
            .select("id, equipamento_id,obra_id,data_retirada,quantidade_retirada,data_devolucao,quantidade_devolvida")
            .match({ data_retirada, equipamento_id, obra_id })
        if (error) return error
        return data

    } catch (error) {
        return (error)
    }
})

export const fetchSaida = createAsyncThunk('/auditoria/fetchAll', async () => {
    try {

        const { data, error } = await supabase
            .from('auditoria')
            .select("id, equipamento_id(id,descricao,duracao_id,classificacao_id,stock_emergencia),obra_id(id,obra_nome,encarregado_id),data_retirada,quantidade_retirada,data_devolucao,quantidade_devolvida")
        if (error) return error
        return data

    } catch (error) {
        return (error)
    }
})


export const insertAuditoria = createAsyncThunk('/auditoria/create', async ({ data_retirada, equipamento_id, obra_id, quantidade_retirada }: Omit<AuditoriaType, 'id' | 'data_devolucao' | 'quantidade_devolvida'>) => {
    try {

        const { data, error } = await supabase
            .from('auditoria')
            .insert({ data_retirada, equipamento_id, obra_id, quantidade_retirada })
            .single()

        return data

    } catch (error) {
        return (error)
    }
})

export const updateAuditoria = createAsyncThunk('/auditoria/update', async ({ data_devolucao, quantidade_devolvida, data_retirada, equipamento_id, obra_id, quantidade_retirada }: Omit<AuditoriaType, 'id'>) => {
    try {

        const { data, error } = await supabase
            .from('auditoria')
            .update([{ data_devolucao, quantidade_devolvida, data_retirada, equipamento_id, obra_id, quantidade_retirada }])
            .match({ data_retirada, equipamento_id, obra_id })
        if (error) return error
        return data

    } catch (error) {
        return (error)
    }
})

export const deleteSaida = createAsyncThunk('/auditoria/delete', async ({ id }: AuditoriaType) => {
    try {

        const { data, error } = await supabase
            .from('auditoria')
            .delete()
            .match({ id })

        return data

    } catch (error) {
        return (error)
    }
})



export const auditoriaSlice = createSlice({
    name: 'auditoria',
    initialState,
    reducers: {
    },
    extraReducers: (build) => {
        build.addCase(fetchSaida.fulfilled, (state, action) => {
            state.saidas.push(action.payload as AuditoriaType)
        });

        build.addCase(insertAuditoria.fulfilled, (state, action) => {
            state.saidas.push(action.payload as AuditoriaType)
        });

    },
})


//export const { update } = encarregadoSlice.actions;

export default auditoriaSlice.reducer;