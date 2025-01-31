import React, { useState } from "react";
import { useGetPokemonListsQuery } from "../../features/api/pokeApi";
import TableGroup from "../../components/reuseableComponent/TableGroup";

const TablePageFour = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data } = useGetPokemonListsQuery({ page: currentPage });

  const columns = [
    { header: "ID", key: "id" },
    { header: "Name", key: "name" },
    { header: "Status", key: "status" },
    { header: "Species", key: "species" },
    { header: "Type", key: "type" },
    { header: "Gender", key: "gender" },
  ];

  return (
    <div className="flex flex-col w-full h-full gap-5">
      <h1 className="text-xl font-bold mb-4">Item Table</h1>
      <TableGroup
        columns={columns}
        data={data?.results}
        dataLength={data?.info?.count}
        perPage={20}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default TablePageFour;
