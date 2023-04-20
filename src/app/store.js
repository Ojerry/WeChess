import { configureStore } from "@reduxjs/toolkit";
import boardReducer from "../feature/board/boardSlice";



export default configureStore({
    reducer: {
        board: boardReducer
    }
})