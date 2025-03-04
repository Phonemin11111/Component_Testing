// App.jsx
import React, { useState } from "react";
import PropTypes from "prop-types";
import TableGroup from "./TableGroup"; // Assuming TableGroup is a valid component

const App = ({
  tableData: dataArray,
  paginationCore: dataPaginate,
  dynamicApi,
  customEradicateMutation,
  customGetQuery,
}) => {
  // Validate dataArray and ensure it's an array
  const tableDataArray = Array.isArray(dataArray) ? dataArray : [];
  const tableData = Object.fromEntries(
    tableDataArray.map((item) => [item.key, item.value])
  );

  const paginationArray = Array.isArray(dataPaginate) ? dataPaginate : [];
  const paginationData = Object.fromEntries(
    paginationArray.map((item) => {
      return [item.key, item.value];
    })
  );

  const extractIdentifierValue = (obj, identifierStr) => {
    if (!identifierStr) return obj;
    // Remove the "data" prefix from the identifier string.
    let path = identifierStr.startsWith("data")
      ? identifierStr.substring(4)
      : identifierStr;
    // Remove any leading optional chaining characters (like '?.' or '.')
    path = path.replace(/^[?.]+/, "");
    // If there's no path left, the identifier was just "data" so return the whole object.
    if (path === "") return obj;
    // Split the path into keys.
    const keys = path.split(".").map((key) => key.replace(/\?$/, ""));
    // Traverse the object using these keys.
    return keys.reduce((acc, key) => (acc != null ? acc[key] : undefined), obj);
  };

  const originalData = tableData?.data?.find((a) => a.key === "data").value
    ?.getQuery;
  const tableIdentifier = tableData?.data?.find((a) => a.key === "data").value
    ?.getQuery?.identifier;
  const frontendMode = paginationData?.pagination === "frontendMode";

  const getCookie = (name) => {
    const cookies = document.cookie.split("; ");
    for (let cookie of cookies) {
      const [key, value] = cookie.split("=");
      if (key === name) return decodeURIComponent(value);
    }
    return null;
  };

  const token = getCookie("token");
  const [currentPage, setCurrentPage] = useState(1);
  const { useGetFetchedListsQuery, useDeleteItemMutation } = dynamicApi;
  // Use the built-in delete hook unless a custom one is provided.
  const dynamicParams = {};

  // Check if parent's mapping object has key 'page' then assign currentPage
  if ("page" in tableIdentifier) {
    dynamicParams[tableIdentifier.page] = currentPage;
  }

  // console.log(dynamicParams);

  const finalDeleteMutation = customEradicateMutation || useDeleteItemMutation;
  // Use the dynamically generated hook to fetch data.
  const defaultQuery = useGetFetchedListsQuery({
    token,
    frontendMode,
    ...dynamicParams,
  });
  const customQuery = customGetQuery
    ? customGetQuery({
        token,
        ...dynamicParams,
      })
    : null;

  const hasRestrictedKeys = [
    "baseUrl",
    "endpoint",
    "method",
    "query",
    "path",
  ].some((key) => originalData?.[key] !== undefined);

  const { data, isLoading, error } = customQuery || defaultQuery;
  const items = tableIdentifier?.data
    ? extractIdentifierValue(data, tableIdentifier.data)
    : data;
  const itemsLength = tableIdentifier?.length
    ? extractIdentifierValue(data, tableIdentifier.length)
    : data?.length;

  if (isLoading && hasRestrictedKeys) return <div>Loading...</div>;
  if (error && hasRestrictedKeys) return <div>Error: {error.toString()}</div>;

  // Modify tableData and pass along the appropriate delete mutation hook.
  const modifiedTableData = tableDataArray.map((section) => {
    if (section.key === "data") {
      return {
        ...section,
        value: section.value.map((item) => {
          if (item.key === "data") {
            return {
              ...item,
              value: {
                ...item.value,
                data: originalData?.data ? originalData?.data : items,
                dataLength: originalData?.dataLength
                  ? originalData?.dataLength
                  : itemsLength,
                currentPage: currentPage,
                setCurrentPage: setCurrentPage,
                eradicateMutation: finalDeleteMutation, // Use the appropriate hook here.
                ...item.value.eradicateMutation,
              },
            };
          }
          return item;
        }),
      };
    }
    return section;
  });

  return (
    <div>
      <TableGroup data={modifiedTableData} paginationCore={dataPaginate} />
    </div>
  );
};

// Define propTypes to validate props passed to the component
App.propTypes = {
  tableData: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      value: PropTypes.any.isRequired,
    })
  ).isRequired,

  dynamicApi: PropTypes.shape({
    useGetFetchedListsQuery: PropTypes.func.isRequired,
    useDeleteItemMutation: PropTypes.func, // Optional custom delete mutation
  }).isRequired,
  customEradicateMutation: PropTypes.func, // Optional custom function for deletion
  customGetQuery: PropTypes.func, // Optional custom query
};

export default App;
