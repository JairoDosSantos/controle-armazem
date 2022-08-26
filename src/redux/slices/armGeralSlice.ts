

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { supabase } from "../../utils/supabaseClient";

type ArmGeralType = {
    id: number;
    equipamento_id: number;
    quantidade_entrada: number;
    data_aquisicao: string
}

type ArmGeralState = {
    armGeralEquipamentos: ArmGeralType[],
    loading: 'idle' | 'pending' | 'succeeded' | 'failed'
}

const initialState: ArmGeralState = {
    armGeralEquipamentos: [],
    loading: 'idle',
}


export const fetchArmGeral = createAsyncThunk('/armgeral/fetch', async () => {
    try {

        const { data, error } = await supabase
            .from('armgeral')
            .select("id, equipamento_id(id,descricao),quantidade_entrada,data_aquisicao")

        return data

    } catch (error) {
        return (error)
    }
})
export const insertArmGeral = createAsyncThunk('/armgeral/create', async ({ data_aquisicao, equipamento_id, quantidade_entrada }: ArmGeralType) => {
    try {

        const { data, error } = await supabase
            .from('armgeral')
            .insert({ data_aquisicao, equipamento_id, quantidade_entrada })
            .single()

        return data

    } catch (error) {
        return (error)
    }
})

export const updateArmGeral = createAsyncThunk('/armgeral/update', async ({ id, data_aquisicao, equipamento_id, quantidade_entrada }: ArmGeralType) => {
    try {

        const { data, error } = await supabase
            .from('armgeral')
            .update([{ data_aquisicao, equipamento_id, quantidade_entrada }])
            .match({ id })

        return data

    } catch (error) {
        return (error)
    }
})

export const deleteArmGeral = createAsyncThunk('/classificacao/delete', async ({ id }: ArmGeralType) => {
    try {

        const { data, error } = await supabase
            .from('armgeral')
            .delete()
            .match({ id })

        return data

    } catch (error) {
        return (error)
    }
})



export const armGeralSlice = createSlice({
    name: 'ArmGeral',
    initialState,
    reducers: {
    },
    extraReducers: (build) => {
        build.addCase(fetchArmGeral.fulfilled, (state, action) => {
            state.armGeralEquipamentos.push(action.payload as ArmGeralType)
        });

        build.addCase(insertArmGeral.fulfilled, (state, action) => {
            state.armGeralEquipamentos.push(action.payload as ArmGeralType)
        });

    },
})


//export const { update } = encarregadoSlice.actions;

export default armGeralSlice.reducer;