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

interface MakeSubsResponse {
    videoUrl: string;
    subtitlesList: Subtitle[];
}

export const videoApi = createApi({
    reducerPath: 'videoApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000/' }),
    endpoints: (builder) => ({
        uploadVideo: builder.mutation<string, File>({
            query: (file) => {
                const formData = new FormData();
                formData.append("file", file);

                return {
                    url: "/upload",
                    method: "POST",
                    body: formData,
                };
            },
        }),
        uploadAudio: builder.mutation<string, File>({
            query: (file) => {
                const formData = new FormData();
                formData.append("file", file);

                return {
                    url: "/audio/upload",
                    method: "POST",
                    body: formData,
                    responseHandler: (response) => response.text()
                };
            },
        }),
        videoCut: builder.mutation<string, { video_url: string; start: number; end: number }>({
            query: ({ video_url, start, end  }) => ({
                url: "/cut",
                method: "POST",
                body: { video_url, start, end},
            }),
        }),
        translateVideo: builder.mutation<TranslateResponse, TranslateRequestBody>({
            query: (body) => ({
                url: "/translate",
                method: "POST",
                body,
            }),
        }),
        translateAudio: builder.mutation<TranslateAudioResponse, TranslateAudioRequestBody>({
            query: (body) => ({
                url: "/translate_audio",
                method: "POST",
                body,
            }),
        }),
        makeSubs: builder.mutation<MakeSubsResponse, MakeSubsRequestBody>({
            query: (body) => ({
                url: "/make-subs",
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