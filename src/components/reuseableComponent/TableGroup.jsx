import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import ReusableTable from "./ReuseableTable";
import PaginationLayout from "./reuseablePagination/PaginationLayout";

const TableGroup = ({
  columns,
  data,
  perPage,
  dataLength,
  frontendMode,
  currentPage: parentCurrentPage,
  setCurrentPage,
  actions,
  horizontalActions,
  actionsBetween,
}) => {
  const items = data;
  const itemsPerPage = perPage;
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setLocalCurrentPage] = useState(
    frontendMode ? 1 : parentCurrentPage
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
  const totalPages = Math.ceil(dataLength / itemsPerPage);

  useEffect(() => {
    if (!frontendMode) {
      setCurrentPage(currentPage);
    }
  }, [currentPage, setCurrentPage, frontendMode]);

  return (
    <div className="flex flex-col w-full h-full gap-5">
      <ReusableTable
        columns={columns}
        data={frontendMode ? calculatedItems : data}
        actions={actions}
        horizontalActions={horizontalActions}
        actionsBetween={actionsBetween}
      />
      <div className="flex justify-center xl:justify-end">
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
