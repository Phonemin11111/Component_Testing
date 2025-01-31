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
    { header: "Description", key: "description" },
    { header: "Category", key: "category" },
  ];

  return (
    <div className=" flex flex-col w-full h-full gap-5">
      <h1 className="text-xl font-bold mb-4">Item Table</h1>
      <TableGroup
        frontend
        columns={columns}
        data={currentItems}
        perPage={10}
        dataLength={currentItems?.length}
      />
    </div>
  );
};

export default TablePageThree;
