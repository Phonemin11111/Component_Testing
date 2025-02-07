import React, { useState } from "react";
import { useGetPokemonListsQuery } from "../../features/api/pokeApi";
import TableGroup from "../../components/reuseableComponent/TableGroup";

const TablePageFour = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data } = useGetPokemonListsQuery({ page: currentPage });

  const columns = [
    {
      key: "manager",
      value: [
        {
          id: "columnsVariant",
          dataVariant:
            "bg-red-100 px-3 py-1 text-sm font-medium text-red-900 border border-red-300",
          dataPosition: "item-center justify-center gap-1",
        },
      ],
    },
    {
      key: "data",
      value: [
        { header: "ID", key: "id", icon: "#" },
        { header: "Name", key: "name" },
        { header: "Status", key: "status" },
        { header: "Species", key: "species" },
        { header: "Type", key: "type" },
        { header: "Gender", key: "gender" },
        { header: "Management", key: "actions", action: "actions" },
      ],
    },
  ];

  const bodyData = [
    {
      key: "manager",
      value: [
        {
          id: "bodyVariant",
          dataVariant:
            "bg-yellow-100 px-2 py-2 text-sm font-medium text-yellow-900 border border-yellow-300",
          dataPosition: "item-center justify-center",
        },
      ],
    },
    {
      key: "data",
      value: { data: data?.results, dataLength: data?.info?.count },
    },
  ];

  const footers = [
    {
      key: "manager",
      value: [
        {
          id: "footerVariant",
          dataVariant:
            "bg-gray-100 px-2 py-2 text-sm font-medium text-gray-900 border border-gray-300",
          dataPosition: "item-center justify-center",
        },
      ],
    },
    {
      key: "data",
      value: [
        { footer: "Total Items", key: "id" },
        { footer: data?.info?.count, key: "gender" },
      ],
    },
  ];

  const caption = [
    {
      key: "manager",
      value: {
        fontSize: 25,
        fontWeight: "bold",
        captionVariant: "text-cyan-500",
      },
    },
    {
      key: "data",
      value: "Item Table",
    },
  ];

  const actions = [
    {
      key: "manager",
      value: [
        {
          id: "actionsVariant",
          actionsFlexType: "horizontal",
          actionsBetween: 8,
        },
      ],
    },
    {
      key: "data",
      value: [
        {
          label: "Edit",
          onClick: (row) => handleAction(row, "edit"),
          icon: "✎",
          iconFlexType: "horizontal",
          gapBetween: 4,
          iconVariant: "text-cyan-500",
          actionVariant: "text-yellow-500 hover:text-yellow-700",
        },
        {
          label: "Delete",
          onClick: (row) => handleAction(row, "delete"),
          icon: "✂",
          iconFlexType: "horizontal",
          gapBetween: 4,
          actionVariant: "text-red-500 hover:text-red-700",
        },
      ],
    },
  ];

  const handleAction = (row, actionType) => {
    console.log(actionType, "on row:", row);
  };

  const themeManager = [
    {
      key: "layoutVariant",
      value: {
        gapBetween: 5,
        dataLayout: [
          { id: "caption", dataPosition: "text-start", gapBelow: 30 },
          {
            id: "pagination",
            dataPosition: "justify-center md:justify-start",
            gapAbove: 20,
          },
        ],
      },
    },
    {
      key: "paginationVariant",
      value: [
        {
          id: "colorScheme",
          dropdownVariant: "bg-white",
          backgroundVariant: "bg-white",
          hoverVariant: "hover:bg-yellow-100",
          colorVariant: "text-yellow-900 border-yellow-500",
          activeVariant: "bg-yellow-500 text-white",
        },
      ],
    },
  ];

  const merges = [
    { key: "manager", value: [] },
    {
      key: "data",
      value: [
        { type: "header", startCol: 1, colSpan: 1, rowSpan: 1 },
        { type: "header", startCol: 1, colSpan: 1, rowSpan: 1 },
        { type: "body", startRow: 1, startCol: 1, colSpan: 1, rowSpan: 1 },
        { type: "body", startRow: 1, startCol: 1, colSpan: 1, rowSpan: 1 },
        { type: "footer", startCol: 0, colSpan: 5, rowSpan: 1 },
        { type: "footer", startCol: 5, colSpan: 2, rowSpan: 1 },
      ],
    },
  ];

  const tableData = [
    { key: "themeManager", value: themeManager },
    { key: "caption", value: caption },
    { key: "columns", value: columns },
    { key: "actions", value: actions },
    { key: "footers", value: footers },
    { key: "data", value: bodyData },
    { key: "perPage", value: 20 },
    { key: "currentPage", value: currentPage },
    { key: "setCurrentPage", value: setCurrentPage },
    { key: "merges", value: merges },
  ];

  return (
    <div className="w-full h-full">
      <TableGroup data={tableData} />
    </div>
  );
};

export default TablePageFour;

//___To Do____________
//====================
//1. Cell Manager {Text Background for status, cell width & height}
//2. Action Separate Columns
//3. Multi-Captions
//4. Multi-Header rows/Add new cell
//5. Multi-Footer rows/Add new cell
//6. Add New Body row/cell
//7. Checkbox Columns
//8. Colgroup/Advance Columns Manager
//9. Rowgroup/Advance Row Manager
