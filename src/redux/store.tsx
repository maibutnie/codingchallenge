import { configureStore } from "@reduxjs/toolkit";
import cartReducer from './cartD';
import favReducer from './favourites';

const store = configureStore({
    reducer: {
        cart: cartReducer,
        fav: favReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>;
export default store