import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

export const geralSlice = createSlice({
    name: 'Search',
    initialState: {
        user: 'Nome do Usuário',
    },
    reducers: {
        updateUser: (state, action) => {
            state.user = action.payload.user
        },
       /**
        *  extraReducers: {
            [HYDRATE]: (state, action) => {
                return {
                    ...state,
                    ...action.payload.Search
                }
            }
        }
        */
    }
})


export const { updateUser } = geralSlice.actions;

export default geralSlice.reducer;