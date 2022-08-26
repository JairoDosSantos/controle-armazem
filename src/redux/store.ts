import { configureStore } from "@reduxjs/toolkit"
import armGeralSlice from "./slices/armGeralSlice"


import classificacaoSlice from "./slices/classificacaoSlice"
import devolverSlice from "./slices/devolverSlice"
import duracaoSlice from "./slices/duracaoSlice.ts"
import encarregadoSlice from "./slices/encarregadoSlice"
import equipamentoSlice from "./slices/equipamentoSlice"
import obraEquipamentoSlice from "./slices/obraEquipamentoSlice"
import obraSlice from "./slices/obraSlice"
import saidaSlice from "./slices/saidaSlice"


export const store = configureStore({
    reducer: {
        Encarregado: encarregadoSlice,
        Obra: obraSlice,
        Classificacao: classificacaoSlice,
        Duracao: duracaoSlice,
        Equipamento: equipamentoSlice,
        ObraEquipamento: obraEquipamentoSlice,
        ArmGeral: armGeralSlice,
        Devolucao: devolverSlice,
        Saida: saidaSlice
    }
})

//Infer the 'RootState' and 'AppDispatch' types from the store itself
export type RootState = ReturnType<typeof store.getState>
//Inferred type: {Search:SearchState,...}
export type AppDispatch = typeof store.dispatch