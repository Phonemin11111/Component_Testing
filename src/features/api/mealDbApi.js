import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const mealDbApi = createApi({
  reducerPath: "mealDbApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://www.themealdb.com/api/json/v1/1/",
  }),
  tagTypes: ["mealDbApi"],

  endpoints: (builder) => ({
    getNormalMealLists: builder.query({
      query: () => ({
        url: `categories.php`,
        method: "GET",
      }),
      providesTags: ["mealDbApiApi"],
    }),
  }),
});

export const { useGetNormalMealListsQuery } = mealDbApi;
