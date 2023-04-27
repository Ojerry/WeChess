import { configureStore } from "@reduxjs/toolkit";
import boardReducer from "../feature/board/boardSlice";
import userReducer from "../feature/userInfo/userInfoSlice"




export default configureStore({
    reducer: {
        board: boardReducer,
        user: userReducer
    }
})