// dynamicApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const createDynamicApi = (
  baseUrl,
  getBaseUrl,
  url,
  method,
  eradicateBaseUrl,
  eradicateUrl,
  eradicateMethod,
  identifier,
  customDelete = false // if true, skip built-in delete endpoint
) => {
  console.log("Creating API with parameters:", {
    baseUrl,
    getBaseUrl,
    url,
    method,
    eradicateUrl,
    eradicateBaseUrl,
    eradicateMethod,
    identifier,
    customDelete,
  });

  return createApi({
    reducerPath: "dynamicApi",
    baseQuery: fetchBaseQuery({ baseUrl }),
    tagTypes: ["dynamicApi"],
    endpoints: (builder) => {
      const endpoints = {
        getFetchedLists: builder.query({
          query: ({ page, frontendMode }) => {
            // Conditionally append `page=${page}` to the URL based on frontendMode
            let queryUrl = `${getBaseUrl}${url}`;
            if (!frontendMode) {
              queryUrl += `page=${page}`;
            }
            console.log("Fetching lists with URL:", url);
            return {
              url: queryUrl,
              method: method,
            };
          },
          providesTags: ["dynamicApi"],
        }),
      };

      // Only add deleteItem if we're not using a custom hook
      if (!customDelete) {
        endpoints.deleteItem = builder.mutation({
          // Accept an object containing the identifier value
          query: ({ id }) => {
            console.log("Deleting item with URL:", `${eradicateUrl}${id}`);
            return {
              url: `${eradicateBaseUrl}${eradicateUrl}${id}`, // e.g. "products/1"
              method: eradicateMethod,
            };
          },
          invalidatesTags: ["dynamicApi"],
        });
      }

      return endpoints;
    },
  });
};

export default createDynamicApi;
