import React from "react";
import OmniGrix from "../../components/OmniGrixToolkit/components/OmniGrix";

const Calculator = () => {
  const columns = [
    {
      key: "data",
      value: [[{ header: "Button", key: "button", action: "actions" }]],
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

  const action = [
    {
      actions: [
        {
          key: "data",
          value: [
            {
              label: "1",
            },
          ],
        },
        {
          key: "data",
          value: [
            {
              label: "2",
            },
          ],
        },
        {
          key: "data",
          value: [
            {
              label: "3",
            },
          ],
        },
      ],
    },
  ];

  const tableData = [
    { key: "columns", value: columns },
    { key: "data", value: bodyData },
    { key: "action", value: action },
  ];

  return (
    <div>
      <OmniGrix data={tableData} />
    </div>
  );
};

export default Calculator;
