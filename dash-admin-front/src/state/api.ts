import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

type TransactionsResponse = {
  transactions: Transactions[]
  total: number

}

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    credentials: 'include'
  }),
  reducerPath: "api",
  tagTypes: ["User", "Products", "Customers", "Transactions"],
  endpoints: (build) => ({
    getAuthUser: build.query<User, void>({
      query: () => ({
        url: `general/user`
      }),
      providesTags: ["User"]
    }),
    login: build.mutation<User, UserSignIn>({
      query: ({ ...userData }) => ({
        url: 'auth/signin',
        method: 'POST',
        body: userData
      })
    }),
    signup: build.mutation<User, UserSignIn>({
      query: ({ ...userData }) => ({
        url: 'auth/signup',
        method: 'POST',
        body: userData
      })
    }),
    getProducts: build.query<Products[], void>({
      query: () => ({
        url: 'client/products'
      }),
      providesTags: ["Products"]
    }),
    getCustomers: build.query<User[], void>({
      query: () => ({
        url: 'client/customers'
      }),
      providesTags: ["Customers"]
    }),
    getTransactions: build.query<TransactionsResponse, TransactionFilter>({
      query: ({ page, pageSize, search, sort }) => {
        return ({
          url: 'client/transactions',
          params: { page, pageSize, search, sort: JSON.stringify(sort) },

        })
      },
      providesTags: ["Transactions"]
    }),
    getGeography: build.query<GeographyResponse[], void>({
      query: () => {
        return ({
          url: 'client/geography',
        })
      }
    }),
    getOverallStats: build.query<OverallStatsResponse, void>({
      query: () => {
        return ({
          url: '/sales/sales'
        })
      }
    })
  })
})

export const { useLoginMutation, useSignupMutation, useGetAuthUserQuery, useGetProductsQuery, useGetCustomersQuery, useGetOverallStatsQuery, useGetTransactionsQuery, useGetGeographyQuery } = api
