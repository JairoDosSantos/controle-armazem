

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { supabase } from "../../utils/supabaseClient";

type UsuarioType = {
    id: number;
    nome: string;
    permissao: string;
    email: string;
    password: string;
}

type UsuarioState = {
    usuarios: UsuarioType[],
    loading: 'idle' | 'pending' | 'succeeded' | 'failed'
}

const initialState: UsuarioState = {
    usuarios: [],
    loading: 'idle',
}


export const fetchUsuarios = createAsyncThunk('/usuario/fetchAll', async () => {
    try {

        const { data, error } = await supabase
            .from('usuario')
            .select("*")
            .order('id', { ascending: true })
        if (data) return data

        return null

    } catch (error) {
        return (error)
    }
})
export const insertUsuario = createAsyncThunk('/usuario/create', async ({ nome, email, password, permissao }: Omit<UsuarioType, 'id'>) => {
    try {

        const { data, error } = await supabase
            .from('usuario')
            .insert({ nome, email, password, permissao })
            .single()

        if (error) return false

        return true

    } catch (error) {
        return (error)
    }
})

export const updateUsuarios = createAsyncThunk('/usuario/update', async ({ id, nome, email, password, permissao }: UsuarioType) => {
    try {

        const { data, error } = await supabase
            .from('usuario')
            .update([{ nome, email, password, permissao }])
            .match({ id })
        if (error) return false
        return true

    } catch (error) {
        return (error)
    }
})

export const deleteUsuario = createAsyncThunk('/usuario/delete', async (id: number) => {
    try {

        const { data, error } = await supabase
            .from('usuario')
            .delete()
            .match({ id })

        if (error) return false

        return true

    } catch (error) {
        return error
    }
})

export const usuarioSlice = createSlice({
    name: 'Usuario',
    initialState,
    reducers: {
    },
    extraReducers: (build) => {

        build.addCase(fetchUsuarios.fulfilled, (state, action) => {
            state.usuarios.push(action.payload as UsuarioType)
        });

        build.addCase(insertUsuario.fulfilled, (state, action) => {
            state.usuarios.push(action.payload as UsuarioType)
        });
    },
})


//export const { update } = usuarioSlice.actions;

export default usuarioSlice.reducer;