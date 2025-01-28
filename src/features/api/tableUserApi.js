import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const tableUserApi = createApi({
  reducerPath: "tableUserApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://jsonplaceholder.typicode.com/",
  }),
  tagTypes: ["tableUserApi"],

  endpoints: (builder) => ({
    getNormalUserLists: builder.query({
      query: () => ({
        url: `users`,
        method: "GET",
      }),
      providesTags: ["tableUserApi"],
    }),
  }),
});

export const { useGetNormalUserListsQuery } = tableUserApi;
