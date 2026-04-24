import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react"


export const api = createApi({
    baseQuery:fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL,
        credentials:'include'
    }),
    reducerPath:"api",
    tagTypes: ["User", "Products","Customers"],
    endpoints: (build)=>({
        getAuthUser: build.query<User, void>({
            query:()=>({
                url:`general/user`
            }),
            providesTags:["User"]
        }),
        login: build.mutation<User, UserSignIn>({
            query:({...userData})=>({
                url:'auth/signin',
                method:'POST',
                body: userData
            })
        }),
        getProducts: build.query<Products[], void>({
            query:()=>({
                url:'client/products'
            }),
            providesTags:["Products"]
        }),
        getCustomers: build.query<User[],void>({
            query:()=>({
                url:'client/customers'
            }),
            providesTags:["Customers"]
        })
    })
})

export const {  useLoginMutation, useGetAuthUserQuery, useGetProductsQuery, useGetCustomersQuery } = api