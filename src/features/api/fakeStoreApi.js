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
  }),
});

export const { useGetNormalItemListsQuery } = fakeStoreApi;
