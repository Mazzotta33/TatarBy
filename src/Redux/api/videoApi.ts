// src/Redux/api/videoApi.ts

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface Subtitle {
    startSeconds: number;
    endSeconds: number;
    russianText: string;
    tatarText: string;
    language: string;
}
interface TranslateParams {
    audioVolume: number;
    tatarAudioVolume: number;
    speaker: string;
    translateFrom: string;
    translateTo: string;
}
interface TranslateRequestBody {
    videoUrl: string;
    params: TranslateParams;
    subtitlesList: Subtitle[] | null;
}

interface TranslateAudioRequestBody {
    audioUrl: string;
    params: TranslateParams;
    subtitlesList: Subtitle[] | null;
}

// 👈 Новый интерфейс для ответа на перевод аудио
interface TranslateAudioResponse {
    audioUrl: string;
    params: TranslateParams;
    subtitlesList: Subtitle[];
}

interface TranslateResponse {
    videoUrl: string;
    params: TranslateParams;
    subtitlesList: Subtitle[];
}

interface MakeSubsRequestBody {
    videoUrl: string;
    subtitlesList: Subtitle[] | null;
}

// Интерфейс для ответа бэкенда на создание субтитров
interface MakeSubsResponse {
    videoUrl: string;
    subtitlesList: Subtitle[];
}

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
                    responseHandler: (response) => response.text()
                };
            },
        }),
        uploadAudio: builder.mutation<string, File>({
            query: (file) => {
                const formData = new FormData();
                formData.append("file", file); // ключ как в Swagger

                return {
                    url: "/audio/upload", // Указываем URL для аудио
                    method: "POST",
                    body: formData,
                    responseHandler: (response) => response.text()
                };
            },
        }),
        videoCut: builder.mutation<string, { videoUrl: string; startSeconds: number; endSeconds: number }>({
            query: ({ videoUrl, startSeconds, endSeconds  }) => ({
                url: "/video/cut",
                method: "POST",
                body: { videoUrl, startSeconds, endSeconds },
            }),
        }),
        translateVideo: builder.mutation<TranslateResponse, TranslateRequestBody>({
            query: (body) => ({
                url: "/video/translate",
                method: "POST",
                body,
            }),
        }),
        translateAudio: builder.mutation<TranslateAudioResponse, TranslateAudioRequestBody>({
            query: (body) => ({
                url: "/audio/translate",
                method: "POST",
                body,
            }),
        }),
        makeSubs: builder.mutation<MakeSubsResponse, MakeSubsRequestBody>({
            query: (body) => ({
                url: "/video/make-subs",
                method: "POST",
                body,
            }),
        }),
    }),
});

export const {
    useUploadVideoMutation,
    useVideoCutMutation,
    useTranslateVideoMutation,
    useMakeSubsMutation,
    useUploadAudioMutation,
    useTranslateAudioMutation,
} = videoApi;