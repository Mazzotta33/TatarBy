// src/Redux/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import {videoApi} from "../api/videoApi.ts";

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const store = configureStore({
    reducer: {
        [videoApi.reducerPath]: videoApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(videoApi.middleware)
});
