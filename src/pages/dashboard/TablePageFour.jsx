import React, { useState } from "react";
import { useGetPokemonListsQuery } from "../../features/api/pokeApi";
import TableGroup from "../../components/reuseableComponent/TableGroup";

const TablePageFour = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data } = useGetPokemonListsQuery({ page: currentPage });

  const columns = [
    { key: "manager", value: [] },
    {
      key: "data",
      value: [
        { header: "ID", key: "id", icon: "#" },
        { header: "Name", key: "name" },
        { header: "Status", key: "status" },
        { header: "Species", key: "species" },
        { header: "Type", key: "type" },
        { header: "Gender", key: "gender" },
        { header: "Management", key: "actions", action: "actions" },
      ],
    },
  ];

  const footers = [
    { key: "manager", value: [] },
    {
      key: "data",
      value: [
        { footer: "Total Items", key: "id" },
        { footer: data?.info?.count, key: "gender" },
      ],
    },
  ];

  const actions = [
    {
      key: "manager",
      value: [
        {
          id: "actionsVariant",
          actionsFlexType: "horizontal",
          actionsBetween: 8,
        },
      ],
    },
    {
      key: "data",
      value: [
        {
          label: "Edit",
          onClick: (row) => handleAction(row, "edit"),
          icon: "✎",
          iconFlexType: "horizontal",
          gapBetween: 4,
          iconVariant: "text-cyan-500",
          actionVariant: "text-yellow-500 hover:text-yellow-700",
        },
        {
          label: "Delete",
          onClick: (row) => handleAction(row, "delete"),
          icon: "✂",
          iconFlexType: "horizontal",
          gapBetween: 4,
          actionVariant: "text-red-500 hover:text-red-700",
        },
      ],
    },
  ];

  const handleAction = (row, actionType) => {
    console.log(actionType, "on row:", row);
  };

  const themeManager = [
    { key: "layoutVariant", value: [] },
    { key: "classVariant", value: [] },
    {
      key: "paginationVariant",
      value: [
        {
          id: "colorVariant",
          dropdownVariant: "bg-white",
          hoverVariant: "hover:bg-yellow-100",
          colorVariant: "text-yellow-900 border-yellow-500",
          activeVariant: "bg-yellow-500 text-white",
        },
      ],
    },
  ];

  const merges = [
    { key: "manager", value: [] },
    {
      key: "data",
      value: [
        { type: "header", startCol: 1, colSpan: 1, rowSpan: 1 },
        { type: "header", startCol: 1, colSpan: 1, rowSpan: 1 },
        { type: "body", startRow: 1, startCol: 1, colSpan: 1, rowSpan: 1 },
        { type: "body", startRow: 1, startCol: 1, colSpan: 1, rowSpan: 1 },
        { type: "footer", startCol: 0, colSpan: 5, rowSpan: 1 },
        { type: "footer", startCol: 5, colSpan: 2, rowSpan: 1 },
      ],
    },
  ];

  const tableData = [
    { key: "columns", value: columns },
    { key: "actions", value: actions },
    { key: "footers", value: footers },
    { key: "data", value: data?.results },
    { key: "dataLength", value: data?.info?.count },
    { key: "perPage", value: 20 },
    { key: "currentPage", value: currentPage },
    { key: "setCurrentPage", value: setCurrentPage },
    { key: "merges", value: merges },
    { key: "themeManager", value: themeManager },
  ];

  return (
    <div className="flex flex-col w-full h-full gap-5">
      <h1 className="text-xl font-bold">Item Table</h1>
      <TableGroup data={tableData} />
    </div>
  );
};

export default TablePageFour;
