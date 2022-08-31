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
import saidaSlice from "./slices/saidaSlice"


const combineReducer = combineReducers({
    Encarregado: encarregadoSlice,
    Obra: obraSlice,
    Classificacao: classificacaoSlice,
    Duracao: duracaoSlice,
    Equipamento: equipamentoSlice,
    Almoxarifario: almoxarifarioSlice,
    ArmGeral: armGeralSlice,
    Devolucao: devolverSlice,
    Saida: saidaSlice
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