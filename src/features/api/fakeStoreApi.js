import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const fakeStoreApi = createApi({
  reducerPath: "fakeStoreApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://fakestoreapi.com/",
  }),
  tagTypes: ["fakeStoreApi"],

  endpoints: (builder) => ({
    getNormalItemLists: builder.query({
      query: () => ({
        url: `products`,
        method: "GET",
      }),
      providesTags: ["fakeStoreApi"],
    }),
    getDetailedItem: builder.query({
      query: ({ id }) => ({
        url: `products/${id}`,
        method: "GET",
      }),
      providesTags: ["fakeStoreApi"],
    }),
    getDeletedItem: builder.mutation({
      query: ({ id }) => ({
        url: `products/${id}`,
        method: "DELETE",
      }),
      providesTags: ["fakeStoreApi"],
    }),
  }),
});

export const {
  useGetNormalItemListsQuery,
  useGetDetailedItemQuery,
  useGetDeletedItemMutation,
} = fakeStoreApi;
