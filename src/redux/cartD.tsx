import { createSlice } from "@reduxjs/toolkit";

export interface CartItem {
    id: number;
    quantity: number;
}

export interface CartState {
    items: CartItem[];
}

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: []
    } as CartState,
    reducers: {
        addToCart(state, action) {            
            const {id, quantity} = action.payload;            
            const indexId = state.items.findIndex(item => item.id == id)
            if (indexId >= 0) {
                state.items[indexId].quantity += quantity;
                if (state.items[indexId].quantity <= 0)
                    state.items.splice(indexId, 1);}
            else
                state.items.push({ id, quantity });
        },
        removeOneFromCart(state, action) {             
            const id = action.payload;            
            const index = state.items.findIndex(item => item.id == id);            
            if (index >= 0) {
                state.items.splice(index, 1);
            }
        },
        removeAll(state) {
            state.items = [];
        }
    }
})

export const { addToCart, removeOneFromCart, removeAll } = cartSlice.actions;
export default cartSlice.reducer;