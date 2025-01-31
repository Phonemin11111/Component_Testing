import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const pokeApi = createApi({
  reducerPath: "pokeApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://rickandmortyapi.com/api/",
  }),
  tagTypes: ["pokeApi"],

  endpoints: (builder) => ({
    getPokemonLists: builder.query({
      query: ({ page }) => ({
        url: `character?page=${page}`,
        method: "GET",
      }),
      providesTags: ["pokeApi"],
    }),
  }),
});

export const { useGetPokemonListsQuery } = pokeApi;
