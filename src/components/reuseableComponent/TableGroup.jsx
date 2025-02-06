import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import ReusableTable from "./ReuseableTable";
import PaginationLayout from "./reuseablePagination/PaginationLayout";
import "../../CyanIC.css";

const TableGroup = ({ data, frontendMode }) => {
  const tableDataArray = Array.isArray(data) ? data : [];
  const tableData = Object.fromEntries(
    tableDataArray.map((item) => {
      return [item.key, item.value];
    })
  );

  const items = tableData.data;
  const itemsPerPage = tableData.perPage;
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setLocalCurrentPage] = useState(
    frontendMode ? 1 : tableData.currentPage
  );

  useEffect(() => {
    const pageParam = searchParams.get("page");
    if (pageParam) {
      setLocalCurrentPage(parseInt(pageParam));
    }
  }, [searchParams]);

  useEffect(() => {
    if (currentPage !== tableData.currentPage) {
      setSearchParams(`?page=${currentPage}`);
    }
  }, [currentPage, tableData.currentPage, setSearchParams]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const calculatedItems = items?.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(tableData.dataLength / itemsPerPage);

  useEffect(() => {
    if (!frontendMode && currentPage !== tableData.currentPage) {
      tableData.setCurrentPage(currentPage);
    }
  }, [currentPage, tableData, frontendMode]);

  const gridData = [
    { key: "columns", value: tableData.columns || [] },
    { key: "actions", value: tableData.actions || [] },
    { key: "footers", value: tableData.footers || [] },
    {
      key: "data",
      value: frontendMode ? calculatedItems || [] : tableData.data || [],
    },
    { key: "merges", value: tableData.merges || [] },
  ];

  const paginationData = [
    { key: "totalPages", value: totalPages || [] },
    { key: "currentPage", value: currentPage || [] },
    { key: "setCurrentPage", value: setLocalCurrentPage || [] },
    {
      key: "paginationVariant",
      value: tableData.themeManager || [],
    },
  ];

  return (
    <div className="flex flex-col w-full h-full gap-5">
      <ReusableTable data={gridData} />
      <div className="flex justify-center xl:justify-end">
        <PaginationLayout data={paginationData} />
      </div>
    </div>
  );
};

export default TableGroup;
