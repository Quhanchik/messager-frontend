import { createSlice } from "@reduxjs/toolkit";


const activeChat = createSlice({
    name: 'activeChat',
    initialState: {
        value: -1
    },
    reducers: {
        set: (state, {payload}) => {
            return {
                value: payload
            };
        }
    }
})

const {reducer, actions} = activeChat;
export const {set} = actions;
export default reducer;