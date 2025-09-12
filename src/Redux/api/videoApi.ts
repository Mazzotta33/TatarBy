// src/Redux/api/videoApi.ts

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const videoApi = createApi({
    reducerPath: 'videoApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8080/api' }),
    endpoints: (builder) => ({
        uploadVideo: builder.mutation<string, File>({
            query: (file) => {
                const formData = new FormData();
                formData.append("file", file); // ключ как в Swagger

                return {
                    url: "/video/upload", // как в картинке
                    method: "POST",
                    body: formData,
                };
            },
        }),
        videoCut: builder.mutation<string, { videoUrl: string; start: number; end: number }>({
            query: ({ videoUrl, start, end }) => ({
                url: "/video/cut",
                method: "POST",
                body: { videoUrl, start, end },
            }),
        })
    }),
});

export const {
    useUploadVideoMutation,
    useVideoCutMutation
} = videoApi;