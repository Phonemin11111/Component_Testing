import React, { useEffect, useState } from "react";
import { useGetNormalItemListsQuery } from "../../features/api/fakeStoreApi";
import TableGroup from "../../components/reuseableComponent/TableGroup";
import TestTwo from "../../components/test/TestTwo";
import { useNavigate } from "react-router";

const TablePageThree = () => {
  const { data } = useGetNormalItemListsQuery();
  console.log(data);
  const currentItems = data;
  const nav = useNavigate();

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
          label: "Detail",
          onClick: (row) => navigator(row),
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

  const navigator = (row) => {
    nav(`/cms-admin/tablePageDetail/${row.id}`);
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
    { key: "perPage", value: currentItems?.length },
  ];

  return (
    <div className=" flex flex-col w-full h-full gap-5">
      <span className=" flex flex-row gap-5 items-center">
        <h1 className="text-xl font-bold">Item Table</h1>
        <TestTwo />
      </span>

      <TableGroup
        data={tableData}
        frontendMode
        paginationCore={paginationEngines}
      />
    </div>
  );
};

export default TablePageThree;
