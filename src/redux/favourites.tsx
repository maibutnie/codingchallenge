import { createSlice } from "@reduxjs/toolkit";

export interface Fav {
    id: number;
}

export interface FavState {
    items: Fav[];
}

const favSlice = createSlice({
    name: 'fav',
    initialState: {
        items: []
    } as FavState,
    reducers: {
        handleFav(state, action) {     
            const id = action.payload;            
            const indexId = state.items.findIndex(item => item.id == id);

            if (indexId < 0) state.items.push({id})
            else state.items.splice(indexId, 1)        
        }
    }
})

export const { handleFav } = favSlice.actions;
export default favSlice.reducer;