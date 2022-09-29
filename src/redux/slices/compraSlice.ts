

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { supabase } from "../../utils/supabaseClient";

type CompraType = {
    id: number;
    equipamento_id: number;
    preco: number;
    data_compra: string;
    quantidade_comprada: number;
    estado: string
}

type compraState = {
    compras: CompraType[],
    loading: 'idle' | 'pending' | 'succeeded' | 'failed'
}

const initialState: compraState = {
    compras: [],
    loading: 'idle',
}

export const fetchCompra = createAsyncThunk('/compra/fetchAll', async () => {
    try {

        const { data, error } = await supabase
            .from('compra')
            .select("id, equipamento_id(id,descricao,duracao_id,classificacao_id,stock_emergencia),data_compra,quantidade_comprada,preco")
        if (error) return error
        return data

    } catch (error) {
        return (error)
    }
})

export const insertCompra = createAsyncThunk('/compra/create', async ({ data_compra, equipamento_id, preco, quantidade_comprada, estado }: Omit<CompraType, 'id'>) => {
    try {

        const { data, error } = await supabase
            .from('compra')
            .insert({ data_compra, equipamento_id, preco, quantidade_comprada, estado })
            .single()
        if (error) return false
        return true

    } catch (error) {
        return (error)
    }
})

export const updateCompra = createAsyncThunk('/compra/update', async ({ id, data_compra, equipamento_id, preco, quantidade_comprada, estado }: CompraType) => {
    try {

        const { data, error } = await supabase
            .from('compra')
            .update([{ data_compra, equipamento_id, preco, quantidade_comprada, estado }])
            .match({ id })

        if (error) return null
        return data

    } catch (error) {
        return (error)
    }
})

export const deleteCompra = createAsyncThunk('/compra/delete', async ({ id }: CompraType) => {
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

export const compraSlice = createSlice({
    name: 'compra',
    initialState,
    reducers: {
    },
    extraReducers: (build) => {
        build.addCase(fetchCompra.fulfilled, (state, action) => {
            state.compras.push(action.payload as CompraType)
        });

        build.addCase(insertCompra.fulfilled, (state, action) => {
            state.compras.push(action.payload as CompraType)
        });

    },
})


//export const { update } = encarregadoSlice.actions;

export default compraSlice.reducer;