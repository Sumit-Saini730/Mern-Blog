import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,
    error: null,
    loading: false
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        loginStart: (state, action) => {
            state.loading = true;
            state.error = null;
        },
        loginSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        loginFailure: (state, action) => {
            state.currentUser = null;
            state.loading = false;
            state.error = action.payload;
        },
        updateStart: (state, action) => {
            state.loading = true;
            state.error = null;
        },
        updateSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        updateFailure: (state, action) => {
            state.currentUser = null;
            state.loading = false;
            state.error = action.payload;
        },
    }
})

export const { 
    loginStart,
    loginSuccess,
    loginFailure,
    updateStart,
    updateSuccess,
    updateFailure
    
} = userSlice.actions

export default userSlice.reducer
