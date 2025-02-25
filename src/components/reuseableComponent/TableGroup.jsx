import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import ReusableTable from "./ReuseableTable";
import PaginationLayout from "./reuseablePagination/PaginationLayout";
import "../../CyanIC.css";

const TableGroup = ({ data, paginationCore }) => {
  const tableDataArray = Array.isArray(data) ? data : [];
  const tableData = Object.fromEntries(
    tableDataArray.map((item) => {
      return [item.key, item.value];
    })
  );

  const paginationArray = paginationCore;
  const theme = tableData?.themeManager;
  const items = tableData.data;
  const filteredTableData = items?.find((b) => b.key === "data")?.value || [];
  const [perPage, setPerPage] = useState(tableData.perPage || 10);
  const itemsPerPage = perPage;
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setLocalCurrentPage] = useState(
    paginationArray?.pagination === "frontendMode"
      ? 1
      : filteredTableData.currentPage
  );
  const parentCurrentPage = filteredTableData.currentPage;
  const parentSetCurrentPage = filteredTableData.setCurrentPage;
  const parentParam = filteredTableData?.param;

  const filteredLayoutVariant = theme?.find(
    (a) => a.key === "layoutVariant"
  )?.value;

  const paginationPosition = filteredLayoutVariant?.find(
    (a) => a.id === "pagination"
  );

  useEffect(() => {
    const pageParam = searchParams.get(parentParam ? parentParam : "page");
    if (pageParam) {
      setLocalCurrentPage(parseInt(pageParam));
    }
  }, [searchParams, parentParam]);

  useEffect(() => {
    if (currentPage !== parentCurrentPage) {
      const newSearchParams = parentParam
        ? `?${parentParam.replace(/"(\d+)"/g, "$1")}=${currentPage}`
        : `?page=${currentPage}`;

      setSearchParams(newSearchParams);
    }
  }, [currentPage, parentCurrentPage, setSearchParams, parentParam]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const calculatedItems = filteredTableData?.data?.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(filteredTableData.dataLength / itemsPerPage);

  const modifiedBodyData = items?.map((item) => ({ ...item }));
  const dataItemIndex = modifiedBodyData.findIndex(
    (item) => item.key === "data"
  );
  if (dataItemIndex !== -1) {
    modifiedBodyData[dataItemIndex] = {
      ...modifiedBodyData[dataItemIndex],
      value: {
        ...modifiedBodyData[dataItemIndex].value,
        data: calculatedItems || [],
        dataLength: filteredTableData?.length || 0,
      },
    };
  }

  useEffect(() => {
    if (
      paginationArray?.pagination !== "frontendMode" &&
      currentPage !== parentCurrentPage &&
      parentCurrentPage &&
      parentSetCurrentPage
    ) {
      parentSetCurrentPage(currentPage);
    }
  }, [currentPage, parentCurrentPage, parentSetCurrentPage, paginationArray]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setLocalCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  useEffect(() => {
    if (tableData?.perPage) {
      setPerPage(tableData?.perPage);
    }
  }, [tableData?.perPage]);

  const gridData = [
    { key: "caption", value: tableData.caption || [] },
    { key: "columns", value: tableData.columns || [] },
    { key: "action", value: tableData.action || [] },
    { key: "footers", value: tableData.footers || [] },
    {
      key: "data",
      value:
        paginationArray?.pagination === "frontendMode"
          ? modifiedBodyData || []
          : tableData.data || [],
    },
    { key: "merges", value: tableData.merges || [] },
    { key: "access", value: tableData.access || [] },
    {
      key: "captionVariant",
      value: tableData.themeManager || [],
    },
  ];

  const paginationData = [
    { key: "totalPages", value: totalPages || [] },
    { key: "currentPage", value: currentPage || [] },
    { key: "setCurrentPage", value: setLocalCurrentPage || [] },
    { key: "defaultPerPage", value: tableData?.perPage || [] },
    { key: "perPage", value: perPage || [] },
    { key: "setPerPage", value: setPerPage || [] },
    {
      key: "paginationVariant",
      value: tableData.themeManager || [],
    },
    { key: "paginationEngines", value: paginationArray || [] },
    { key: "setSearchParams", value: setSearchParams || [] },
  ];

  return (
    <div className="flex flex-col w-full h-full">
      <ReusableTable data={gridData} />
      {paginationArray && (
        <div
          style={{
            marginTop: `${paginationPosition?.gapAbove || 20}px`,
          }}
          className={`flex ${
            paginationPosition?.dataPosition
              ? paginationPosition?.dataPosition
              : "justify-center xl:justify-end"
          }`}
        >
          <PaginationLayout data={paginationData} />
        </div>
      )}
    </div>
  );
};

export default TableGroup;
