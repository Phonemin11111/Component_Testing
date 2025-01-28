import React from "react";

import { useGetNormalMealListsQuery } from "../../features/api/mealDbApi";
import ReusableTable from "../../components/reuseableComponent/ReuseableTable";

const TablePageTwo = () => {
  const { data } = useGetNormalMealListsQuery();
  console.log(data);
  const currentItems = data?.categories;

  const columns = [
    { header: "ID", key: "idCategory" },
    { header: "Name", key: "strCategory" },
    { header: "Description", key: "strCategoryDescription" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Meals Table</h1>
      <ReusableTable columns={columns} data={currentItems} />
    </div>
  );
};

export default TablePageTwo;
