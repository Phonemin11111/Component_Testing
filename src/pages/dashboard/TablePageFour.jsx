import React, { useState } from "react";
import { useGetPokemonListsQuery } from "../../features/api/pokeApi";
import TableGroup from "../../components/reuseableComponent/TableGroup";

const TablePageFour = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data } = useGetPokemonListsQuery({ page: currentPage });

  const columns = [
    { header: "ID", key: "id", icon: "#" },
    { header: "Name", key: "name" },
    { header: "Status", key: "status" },
    { header: "Species", key: "species" },
    { header: "Type", key: "type" },
    { header: "Gender", key: "gender" },
    { header: "Management", key: "actions", action: "action" },
  ];

  const actions = [
    {
      label: "Edit",
      onClick: (row) => handleAction(row, "edit"),
      icon: "✎",
      className: "text-yellow-500 hover:text-yellow-700",
    },
    {
      label: "Delete",
      onClick: (row) => handleAction(row, "delete"),
      icon: "✂",
      className: "text-red-500 hover:text-red-700",
    },
  ];

  const handleAction = (row, actionType) => {
    console.log(actionType, "on row:", row);
  };

  return (
    <div className="flex flex-col w-full h-full gap-5">
      <h1 className="text-xl font-bold mb-4">Item Table</h1>
      <TableGroup
        columns={columns}
        data={data?.results}
        actions={actions}
        dataLength={data?.info?.count}
        perPage={20}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default TablePageFour;
