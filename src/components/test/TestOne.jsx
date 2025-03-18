import React from "react";
import OmniGrix from "../OmniGrixToolkit/components/OmniGrix";
import {
  fakeStoreApi,
  useGetDeletedItemMutation,
  useGetNormalItemListsQuery,
} from "../../features/api/fakeStoreApi";
import { store } from "../../features/app/store";
import { pokeApi, useGetPokemonListsQuery } from "../../features/api/pokeApi";

const TestOne = () => {
  // const { data } = useGetNormalItemListsQuery();
  // const currentItems = data;

  const columns = [
    {
      key: "data",
      value: [
        [
          { header: true, key: "checkBox", action: "checkMarks" },
          { header: "ID", key: "id" },
          { header: "Name", key: "title" },
          { header: "Image", key: "image", action: "photos" },
          { header: "Price", key: "price" },
          { header: "Description", key: "description" },
          { header: "Category", key: "category" },
          { header: "Rating", key: "rating.rate" },
          { header: "Rating", key: "rating.count" },
          { header: "Button", key: "button", action: "actions" },
        ],
        [
          { header: "Rate", key: "rating.rate" },
          { header: "Count", key: "rating.count" },
        ],
      ],
    },
  ];

  const bodyData = [
    {
      key: "data",
      value: {
        // getQuery: { data: currentItems, dataLength: currentItems?.length },
        primaryUrl: import.meta.env.VITE_API_ENDPOINT,
        // getQuery: {
        //   baseUrl: "https://rickandmortyapi.com/api/",
        //   endpoint: "character?page=${page}",
        //   method: "GET",
        //   identifier: {
        //     data: "data?.results",
        //     length: "data?.info?.count",
        //     page: "page",
        //   },
        // },
        getQuery: {
          // baseUrl: "https://fakestoreapi.com/",
          endpoint: "products",
          method: "GET",
          identifier: {
            data: "data",
            length: "data?.length",
          },
        },
        // getQuery: {
        //   query: useGetNormalItemListsQuery,
        //   path: fakeStoreApi,
        //   identifier: {
        //     data: "data",
        //     length: "data?.length",
        //   },
        // },
        // getQuery: {
        //   query: useGetPokemonListsQuery,
        //   path: pokeApi,
        //   identifier: {
        //     data: "data?.results",
        //     length: "data?.info?.count",
        //     page: "page",
        //   },
        // },
        eradicateMutation: {
          // baseUrl: "https://fakestoreapi.com/",
          endpoint: "products/",
          method: "DELETE",
        },
        // eradicateMutation: {
        //   mutation: useGetDeletedItemMutation,
        //   path: fakeStoreApi,
        // },
        // authorizer: Cookies.get("token"),
        param: "စားပြီးပြီလား",
      },
    },
  ];

  const footers = [
    {
      key: "manager",
      value: [
        {
          id: "footerCell",
          coordination: { x: [0, 1], y: 0 },
          dataVariant: "border-r-0",
        },
        {
          id: "footerCell",
          coordination: { x: [3, 4, 5, 6, 7, 8], y: 0 },
          dataVariant: "border-r-0",
        },
      ],
    },
    {
      key: "data",
      value: [
        [
          { footer: "Total Items", col: 2 },
          { footer: true, identifier: "data?.length", col: 4 },
        ],
      ],
    },
  ];

  const action = [
    {
      actions: [
        {
          key: "data",
          value: [
            {
              icon: "👁",
              label: "Detail",
              onClick: (navigator, row) =>
                navigator(`/cms-admin/tablePageDetail/${row.id}`),
            },
            {
              icon: "✂",
              label: "Delete",
              onClick: (eradicator, row) => eradicator(row?.id),
            },
          ],
        },
      ],
    },
  ];

  const merges = [
    {
      key: "data",
      value: [
        { type: "header", startCol: 0, colSpan: 1, rowSpan: 2 },
        { type: "header", startCol: 1, colSpan: 1, rowSpan: 2 },
        { type: "header", startCol: 2, colSpan: 1, rowSpan: 2 },
        { type: "header", startCol: 3, colSpan: 1, rowSpan: 2 },
        { type: "header", startCol: 4, colSpan: 1, rowSpan: 2 },
        { type: "header", startCol: 5, colSpan: 1, rowSpan: 2 },
        { type: "header", startCol: 6, colSpan: 1, rowSpan: 2 },
        { type: "header", startCol: 7, colSpan: 2, rowSpan: 1 },
        { type: "header", startCol: 9, colSpan: 1, rowSpan: 2 },
      ],
    },
  ];

  const paginationEngines = {
    pagination: "frontendMode",
  };

  const tableData = [
    { key: "columns", value: columns },
    { key: "data", value: bodyData },
    { key: "footers", value: footers },
    { key: "action", value: action },
    { key: "merges", value: merges },
    { key: "perPage", value: 20 },
  ];

  return (
    <div>
      <OmniGrix data={tableData} paginationCore={paginationEngines} />
    </div>
  );
};

export default TestOne;
