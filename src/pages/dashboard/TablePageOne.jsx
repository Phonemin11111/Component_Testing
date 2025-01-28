import React from "react";
import ReusableTable from "../../components/dashboard/ReusableTable";
import { useGetNormalUserListsQuery } from "../../features/api/tableUserApi";

const TablePageOne = () => {
  const { data } = useGetNormalUserListsQuery();
  console.log(data);
  const currentItems = data;

  const columns = [
    { header: "ID", key: "id" },
    { header: "Name", key: "name" },
    { header: "Email", key: "email" },
    { header: "Phone", key: "phone" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Users Table</h1>
      <ReusableTable columns={columns} data={currentItems} />
    </div>
  );
};

export default TablePageOne;
