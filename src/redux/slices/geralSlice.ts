import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

export const geralSlice = createSlice({
    name: 'Search',
    initialState: {
        user: 'Nome do Usuário',
        showSideBar: true
    },
    reducers: {
        updateUser: (state, action) => {
            state.user = action.payload.user
        },
        hideSiderBar: (state, action) => {
            state.showSideBar = action.payload.showSideBar
        }
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


export const { updateUser, hideSiderBar } = geralSlice.actions;

export default geralSlice.reducer;