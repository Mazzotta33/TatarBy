import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

export const registerApi = createApi({
    reducerPath: 'registerApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000/' }),
    endpoints: (builder) => ({
        registerUser: builder.mutation<string, {username: string, password: string, email: string}>({
            query: ({ username, password, email }) => ({
                url: '/register',
                method: 'POST',
                body: { username, password, email },
            }),
        }),
        loginUser: builder.mutation({
            query: (body) => ({
                url: '/login',
                method: 'POST',
                body: body
            })
        })
    })
})

export const {
    useRegisterUserMutation
} = registerApi