import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userSlice from '../slices/userSlice';
import activeChat from '../slices/activeChatSlice';
import clientSlice from '../slices/clientSlice';

const reducer = combineReducers({
    user: userSlice,
    activeChat: activeChat,
    clientSlice: clientSlice
})

export const store = configureStore({
    reducer: reducer
});