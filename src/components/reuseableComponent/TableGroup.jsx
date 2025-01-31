import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import ReusableTable from "./ReuseableTable";
import PaginationLayout from "./reuseablePagination/PaginationLayout";

const TableGroup = ({
  columns,
  data,
  perPage,
  dataLength,
  frontend,
  currentPage: parentCurrentPage,
  setCurrentPage,
}) => {
  const items = data;
  const itemsPerPage = perPage;
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setLocalCurrentPage] = useState(
    frontend ? 1 : parentCurrentPage
  );

  useEffect(() => {
    const pageParam = searchParams.get("page");
    if (pageParam) {
      setLocalCurrentPage(parseInt(pageParam));
    }
  }, [searchParams]);

  useEffect(() => {
    if (currentPage !== parentCurrentPage) {
      setSearchParams(`?page=${currentPage}`);
    }
  }, [currentPage, parentCurrentPage, setSearchParams]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const calculatedItems = items?.slice(indexOfFirstItem, indexOfLastItem);
  console.log(calculatedItems);

  const totalPages = Math.ceil(dataLength / itemsPerPage);
  console.log(totalPages);

  useEffect(() => {
    if (!frontend) {
      setCurrentPage(currentPage);
    }
  }, [currentPage, setCurrentPage, frontend]);

  return (
    <div className="flex flex-col w-full h-full gap-5">
      <ReusableTable
        columns={columns}
        data={frontend ? calculatedItems : data}
      />
      <div className="flex justify-end">
        <PaginationLayout
          totalPages={totalPages}
          currentPage={currentPage}
          setCurrentPage={setLocalCurrentPage}
        />
      </div>
    </div>
  );
};

export default TableGroup;
