import { createSlice } from "@reduxjs/toolkit";


const clientSlice = createSlice({
    name: 'client',
    initialState: {
        client: null
    },
    reducers: {
        set: (state, {payload}) => {
            return state={
                client: payload
            }
        }
    }
})

const {reducer, actions} = clientSlice;
export default reducer;
export const {set} = actions;