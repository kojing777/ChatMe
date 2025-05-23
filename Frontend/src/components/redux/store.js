import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authSlice from './authSlice.js';
import postSlice from './postSlice.js'
import chatSlice from './chatSlice'
// import other slices...

import {
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
};

const rootReducer = combineReducers({
    auth: authSlice,
    post:postSlice,
    // post: postSlice,
    // socketio: socketSlice,
    chat: chatSlice,
    // realTimeNotification: rtnSlice
});

// Pass both persistConfig AND rootReducer to persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export default store;