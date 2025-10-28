import { configureStore } from '@reduxjs/toolkit';
import {videoApi} from "../api/videoApi.ts";
import languageSlice from "./languageSlice.ts";
import {registerApi} from "../api/registerApi.ts";
import authReducer from "../slices/authSlice.ts";

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const store = configureStore({
    reducer: {
        [videoApi.reducerPath]: videoApi.reducer,
        [registerApi.reducerPath]: registerApi.reducer,
        language: languageSlice,
        auth: authReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(videoApi.middleware)
            .concat(registerApi.middleware),
});
