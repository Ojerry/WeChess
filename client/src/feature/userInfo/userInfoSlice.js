import { createSlice } from "@reduxjs/toolkit";

export const userInfoSlice = createSlice({
    name:"user",
    initialState: {
        user: {
            redirectedHere: false,
            userName: '',
            roomCreator: false
        }
    },
    reducers: {
        setUserInfo: (state, action) => {
            state.user = action.payload
            console.log(state.user)
        },
    },
});

export const { setUserInfo } = userInfoSlice.actions;

export const selectUserInfo = (state) => state.user.user

export default userInfoSlice.reducer;
