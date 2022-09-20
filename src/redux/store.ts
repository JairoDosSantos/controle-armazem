import { configureStore, combineReducers } from "@reduxjs/toolkit"
import { createWrapper } from "next-redux-wrapper"
import thunk from "redux-thunk"

import armGeralSlice from "./slices/armGeralSlice"
import classificacaoSlice from "./slices/classificacaoSlice"
import devolverSlice from "./slices/devolverSlice"
import duracaoSlice from "./slices/duracaoSlice.ts"
import encarregadoSlice from "./slices/encarregadoSlice"
import equipamentoSlice from "./slices/equipamentoSlice"
import almoxarifarioSlice from "./slices/almoxarifarioSlice"
import obraSlice from "./slices/obraSlice"
import auditoriaSlice from "./slices/auditoriaSlice"
import compraSlice from "./slices/compraSlice"
import usuario from "./slices/usuarioSlice"
import geralSlice from "./slices/geralSlice"


const combineReducer = combineReducers({
    Encarregado: encarregadoSlice,
    Obra: obraSlice,
    Classificacao: classificacaoSlice,
    Duracao: duracaoSlice,
    Equipamento: equipamentoSlice,
    Almoxarifario: almoxarifarioSlice,
    ArmGeral: armGeralSlice,
    Devolucao: devolverSlice,
    Auditoria: auditoriaSlice,
    Compra: compraSlice,
    geral: geralSlice,
    usuario
})

export const store = () => configureStore({
    reducer: combineReducer,
    devTools: true
})

//Infer the 'RootState' and 'AppDispatch' types from the store itself
//export type RootState = ReturnType<typeof store.getState>
//Inferred type: {Search:SearchState,...}
//export type AppDispatch = typeof store.dispatch

export const wrapper = createWrapper(store)