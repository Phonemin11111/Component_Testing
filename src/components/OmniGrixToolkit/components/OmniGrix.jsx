// OmniGrix.jsx
import React, { useMemo } from "react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import App from "./App";
import createDynamicApi from "../api/createDynamicApi";
// Note: We do not import the custom API slice here anymore.
// Instead, the parent is responsible for combining them.

const OmniGrix = ({ data, paginationCore }) => {
  const tableDataArray = Array.isArray(data) ? data : [];
  const tableData = Object.fromEntries(
    tableDataArray.map((item) => [item.key, item.value])
  );

  const bodyData = tableData?.data;
  const bodyDataSection = bodyData?.find((section) => section.key === "data");
  const getQueryArray = bodyDataSection?.value?.getQuery || {};
  const getQuery =
    getQueryArray?.endpoint || getQueryArray?.Method
      ? getQueryArray
      : getQueryArray?.query;
  const isCustomGetQuery = typeof getQuery === "function";

  const endPoint = bodyDataSection?.value?.primaryUrl || "";
  const getBaseUrl =
    !isCustomGetQuery && getQuery?.baseUrl ? getQuery?.baseUrl : endPoint;
  const url = !isCustomGetQuery ? getQuery?.endpoint || "" : "";
  const method = !isCustomGetQuery ? getQuery?.method : "GET";

  // Get eradicateMutation from data.
  const eradicateMutationSource = bodyDataSection?.value?.eradicateMutation;
  const eradicateMutation =
    eradicateMutationSource?.endpoint || eradicateMutationSource?.method
      ? eradicateMutationSource
      : eradicateMutationSource?.mutation;
  // We now combine API slices from both eradicateMutation and getQuery.
  const isCustomEradicateMutation = typeof eradicateMutation === "function";

  // For built-in delete: extract config; for custom, leave empty.
  const eradicateBaseUrl =
    !isCustomEradicateMutation && eradicateMutation?.baseUrl
      ? eradicateMutation?.baseUrl
      : endPoint;
  const eradicateUrl = !isCustomEradicateMutation
    ? eradicateMutation?.endpoint || ""
    : "";
  const eradicateMethod = !isCustomEradicateMutation
    ? eradicateMutation?.method
    : "DELETE";
  const identifier = !isCustomEradicateMutation
    ? eradicateMutation?.identifier || "id"
    : "";

  // console.log("Fetching Data:", endPoint, url, method);
  // console.log("Deleting Data:", eradicateUrl, eradicateMethod, identifier);

  // Create dynamicApi.
  const dynamicApi = useMemo(() => {
    return createDynamicApi(
      endPoint,
      getBaseUrl,
      url,
      method,
      eradicateBaseUrl,
      eradicateUrl,
      eradicateMethod
    );
  }, [
    endPoint,
    getBaseUrl,
    url,
    method,
    eradicateBaseUrl,
    eradicateUrl,
    eradicateMethod,
  ]);

  // Combine the API slices from eradicateMutation and getQuery if they exist.
  const combinedApiStore = useMemo(() => {
    const apis = [];
    if (bodyDataSection?.value?.eradicateMutation?.path) {
      apis.push(bodyDataSection.value.eradicateMutation.path);
    }
    if (bodyDataSection?.value?.getQuery?.path) {
      apis.push(bodyDataSection.value.getQuery.path);
    }
    return apis;
  }, [
    bodyDataSection?.value?.eradicateMutation?.path,
    bodyDataSection?.value?.getQuery?.path,
  ]);

  // Create the Redux store, adding the dynamicApi and any additional API slices.
  const OmniGrixStore = useMemo(() => {
    // Build an object of additional reducers from combinedApiStore.
    const additionalReducers = combinedApiStore.reduce((acc, api) => {
      if (api?.reducerPath && api?.reducer) {
        acc[api.reducerPath] = api.reducer;
      }
      return acc;
    }, {});

    // Build an array of additional middleware.
    const additionalMiddlewares = combinedApiStore
      .filter((api) => api?.middleware)
      .map((api) => api.middleware);

    return configureStore({
      reducer: {
        [dynamicApi.reducerPath]: dynamicApi.reducer,
        ...additionalReducers,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
          dynamicApi.middleware,
          ...additionalMiddlewares
        ),
    });
  }, [dynamicApi, combinedApiStore]);

  return (
    <Provider store={OmniGrixStore}>
      <App
        tableData={data}
        paginationCore={paginationCore}
        dynamicApi={dynamicApi}
        // Pass the custom hook if provided.
        customEradicateMutation={
          isCustomEradicateMutation ? eradicateMutation : null
        }
        customGetQuery={isCustomGetQuery ? getQuery : null}
      />
    </Provider>
  );
};

export default OmniGrix;
