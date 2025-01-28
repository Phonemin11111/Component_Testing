import React from "react";
import { useGetNormalItemListsQuery } from "../../features/api/fakeStoreApi";
import ReusableTable from "../../components/reuseableComponent/ReuseableTable";

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
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Item Table</h1>
      <ReusableTable columns={columns} data={currentItems} />
    </div>
  );
};

export default TablePageThree;
