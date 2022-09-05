import { createSlice } from "@reduxjs/toolkit";

export const geralSlice = createSlice({
    name: 'Search',
    initialState: {
        user: 'Nome do Usuário',
    },
    reducers: {
        updateUser: (state, action) => {
            state.user = action.payload.user
        }

    }
})


export const { updateUser } = geralSlice.actions;

export default geralSlice.reducer;