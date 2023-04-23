import { createSlice } from "@reduxjs/toolkit";

export const userInfoSlice = createSlice({
    name:"user",
    initialState: {
        user: {
            redirectedHere: false,
            userName: ''
        }
    },
    reducers: {
        setUserInfo: (state, action) => {
            state.board = action.payload
        },
    },
});

export const { setUserInfo } = userInfoSlice.actions;

export const selectUserInfo = (state) => state.user.user

export default userInfoSlice.reducer;
