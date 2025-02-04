import React, { useEffect, useState } from "react";
import { useGetNormalItemListsQuery } from "../../features/api/fakeStoreApi";
import TableGroup from "../../components/reuseableComponent/TableGroup";

const TablePageThree = () => {
  const { data } = useGetNormalItemListsQuery();
  console.log(data);
  const currentItems = data;

  const columns = [
    { header: "ID", key: "id" },
    { header: "Name", key: "title" },
    { header: "Price", key: "price" },
    { header: "Description", key: "description", icon: "📝" },
    { header: "Category", key: "category" },
    { header: "Button", key: "button", action: "actions" },
  ];

  const actions = [
    {
      label: "Edit",
      onClick: (row) => handleAction(row, "edit"),
      icon: "✎",
      gapBetween: 4,
      iconVariant: "text-cyan-500",
      actionVariant: "text-yellow-500 hover:text-yellow-700",
    },
    {
      label: "Delete",
      onClick: (row) => handleAction(row, "delete"),
      icon: "✂",
      gapBetween: 4,
      iconVariant: "text-cyan-500",
      actionVariant: "text-yellow-500 hover:text-yellow-700",
    },
  ];

  const handleAction = (row, actionType) => {
    console.log(actionType, "on row:", row);
  };

  const tableData = [
    { key: "columns", value: columns },
    { key: "actions", value: actions },
    { key: "data", value: currentItems },
    { key: "dataLength", value: currentItems?.length },
    { key: "perPage", value: 5 },
  ];

  return (
    <div className=" flex flex-col w-full h-full gap-5">
      <h1 className="text-xl font-bold mb-4">Item Table</h1>
      <TableGroup data={tableData} frontendMode />
    </div>
  );
};

export default TablePageThree;
