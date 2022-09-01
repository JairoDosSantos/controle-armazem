

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { supabase } from "../../utils/supabaseClient";

type CompraType = {
    id: number;
    equipamento_id: number;
    preco: number;
    data_compra: string;
    quantidade_compra: number
}

type compraState = {
    compras: CompraType[],
    loading: 'idle' | 'pending' | 'succeeded' | 'failed'
}

const initialState: compraState = {
    compras: [],
    loading: 'idle',
}

export const fetchSaida = createAsyncThunk('/compra/fetchAll', async () => {
    try {

        const { data, error } = await supabase
            .from('id, equipamento_id(id,descricao,duracao_id,classificacao_id,stock_emergencia),data_compra,quantidade_compra,preco')
            .select("*")
        if (error) return error
        return data

    } catch (error) {
        return (error)
    }
})

export const insertSaida = createAsyncThunk('/compra/create', async ({ data_compra, equipamento_id, preco, quantidade_compra }: Omit<CompraType, 'id'>) => {
    try {

        const { data, error } = await supabase
            .from('compra')
            .insert({ data_compra, equipamento_id, preco, quantidade_compra })
            .single()
        if (error) return error
        return data

    } catch (error) {
        return (error)
    }
})

export const updateSaida = createAsyncThunk('/compra/update', async ({ id, data_compra, equipamento_id, preco, quantidade_compra }: CompraType) => {
    try {

        const { data, error } = await supabase
            .from('compra')
            .update([{ data_compra, equipamento_id, preco, quantidade_compra }])
            .match({ id })

        if (error) return error
        return data

    } catch (error) {
        return (error)
    }
})

export const deleteSaida = createAsyncThunk('/compra/delete', async ({ id }: CompraType) => {
    try {

        const { data, error } = await supabase
            .from('compra')
            .delete()
            .match({ id })

        if (error) return error
        return data

    } catch (error) {
        return (error)
    }
})

export const auditoriaSlice = createSlice({
    name: 'compra',
    initialState,
    reducers: {
    },
    extraReducers: (build) => {
        build.addCase(fetchSaida.fulfilled, (state, action) => {
            state.compras.push(action.payload as CompraType)
        });

        build.addCase(insertSaida.fulfilled, (state, action) => {
            state.compras.push(action.payload as CompraType)
        });

    },
})


//export const { update } = encarregadoSlice.actions;

export default auditoriaSlice.reducer;