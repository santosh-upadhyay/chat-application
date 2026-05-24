import {configureStore} from '@reduxjs/toolkit';
import loaderReducer from './loaderSlice';
import usersReducer from './usersSlice';
const store = configureStore({
    reducer:{
        loaderReducer,
        usersReducer
    }
})

export default store;
