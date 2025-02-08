import React, { useEffect, useState } from "react";
import { useGetNormalItemListsQuery } from "../../features/api/fakeStoreApi";
import TableGroup from "../../components/reuseableComponent/TableGroup";

const TablePageThree = () => {
  const { data } = useGetNormalItemListsQuery();
  console.log(data);
  const currentItems = data;

  const columns = [
    {
      key: "manager",
      value: [
        {
          id: "columnsVariant",
          dataVariant:
            "bg-yellow-100 px-3 py-1 text-left text-sm font-medium text-yellow-900 border border-yellow-300",
          dataPosition: "item-center justify-start gap-1",
        },
      ],
    },
    {
      key: "data",
      value: [
        { header: "ID", key: "id" },
        { header: "Name", key: "title" },
        { header: "Price", key: "price" },
        { header: "Description", key: "description", icon: "📝" },
        { header: "Category", key: "category" },
        { header: "Button", key: "button", action: "actions", icon: "📝" },
      ],
    },
  ];

  const bodyData = [
    {
      key: "manager",
      value: [
        {
          id: "bodyVariant",
          dataVariant:
            "bg-yellow-100 px-2 py-2 text-left text-sm font-medium text-yellow-900 border border-yellow-300",
          dataPosition: "item-center justify-center",
        },
      ],
    },
    {
      key: "data",
      value: { data: currentItems, dataLength: currentItems?.length },
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
          dataPosition: "items-center justify-center",
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
          iconFlexType: "vertical",
          gapBetween: 4,
          iconVariant: "text-yellow-500",
          dataVariant: "text-yellow-500 hover:text-yellow-700",
        },
        {
          label: "Delete",
          onClick: (row) => handleAction(row, "delete"),
          icon: "✂",
          gapBetween: 4,
          iconVariant: "text-yellow-500",
          dataVariant: "text-yellow-500 hover:text-yellow-700",
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

  const paginationEngines = {
    pagination: true,
    sortDate: true,
    sortTime: true,
    goPage: true,
    perPage: true,
  };

  const tableData = [
    { key: "themeManager", value: themeManager },
    { key: "columns", value: columns },
    { key: "actions", value: actions },
    { key: "data", value: bodyData },
    { key: "perPage", value: 2 },
  ];

  return (
    <div className=" flex flex-col w-full h-full gap-5">
      <h1 className="text-xl font-bold mb-4">Item Table</h1>
      <TableGroup
        data={tableData}
        frontendMode
        paginationCore={paginationEngines}
      />
    </div>
  );
};

export default TablePageThree;
