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
  customDelete = false // if true, skip built-in delete endpoint
) => {
  // console.log("Creating API with parameters:", {
  //   baseUrl,
  //   getBaseUrl,
  //   url,
  //   method,
  //   eradicateUrl,
  //   eradicateBaseUrl,
  //   eradicateMethod,
  //   identifier,
  //   customDelete,
  // });

  return createApi({
    reducerPath: "dynamicApi",
    baseQuery: fetchBaseQuery({ baseUrl }),
    tagTypes: ["dynamicApi"],
    endpoints: (builder) => {
      const endpoints = {
        getFetchedLists: builder.query({
          query: ({ frontendMode, ...params }) => {
            // Build the initial URL from getBaseUrl and the URL template.
            let queryUrl = `${getBaseUrl}${url}`;
            if (!frontendMode) {
              // Replace every occurrence of ${...} in queryUrl
              queryUrl = queryUrl.replace(/\$\{([^}]+)\}/g, (match, key) => {
                // Remove any extra dollar signs (if any) and trim the key.
                const cleanedKey = key.replace(/\$/g, "").trim();
                // Replace the placeholder with the corresponding value from params,
                // or if not provided, leave it as an empty string.
                return params[cleanedKey] !== undefined
                  ? params[cleanedKey]
                  : "";
              });
              // console.log(params);
            }
            // console.log("Fetching lists with URL:", queryUrl);
            return {
              url: queryUrl,
              method: method,
            };
          },
          providesTags: ["dynamicApi"],
        }),
      };

      if (!customDelete) {
        endpoints.deleteItem = builder.mutation({
          query: ({ id }) => {
            // console.log("Deleting item with URL:", `${eradicateUrl}${id}`);
            return {
              url: `${eradicateBaseUrl}${eradicateUrl}${id}`,
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
