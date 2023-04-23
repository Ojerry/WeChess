import { createSlice } from "@reduxjs/toolkit";

export const boardSlice = createSlice({
    name:"board",
    initialState: {
        board: {
            size: 500,
        }
    },
    reducers: {
        setBoardSize: (state, action) => {
            state.board = action.payload
        },
    },
});

export const { setBoardSize } = boardSlice.actions;

export const selectBoardSize = (state) => state.board.board

export default boardSlice.reducer;
