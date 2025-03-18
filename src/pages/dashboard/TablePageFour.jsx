import React, { useState } from "react";
import { useGetPokemonListsQuery } from "../../features/api/pokeApi";
import TableGroup from "../../components/reuseableComponent/TableGroup";

const TablePageFour = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data } = useGetPokemonListsQuery({ page: currentPage });
  const newData = data?.results?.map((item) => ({
    ...item,
    created: item?.created ? new Date(item.created).toLocaleString() : null,
  }));

  const columns = [
    {
      key: "manager",
      value: [
        {
          id: "columnsVariant",
          dataVariant:
            "bg-red-100 px-3 py-1 text-sm font-medium text-red-900 border-red-300",
          dataPosition: "item-center justify-center gap-1",
        },
      ],
    },
    {
      key: "data",
      value: [
        [
          { header: true, key: "checkBox", action: "checkMarks" },
          { header: "ID", key: "id", icon: "#" },
          { header: "Name", key: "name" },
          { header: "Visual", key: "image", action: "photos" },
          { header: "Status", key: "status", action: "badges" },
          { header: "Species", key: "species" },
          { header: "Type", key: "type" },
          { header: "Gender", key: "gender" },
          { header: "Location", key: "location.name" },
          { header: "Location", key: "location.url", action: "links" },
          { header: "Origin", key: "origin.name" },
          { header: "Origin", key: "origin.url", action: "links" },
          { header: "Link", key: "url", action: "links" },
          { header: "Created", key: "created" },
          { header: "Management", key: "actions", action: "actions" },
        ],
        [
          { header: "Name", key: "location.name" },
          { header: "Link", key: "location.url" },
          { header: "Name", key: "origin.name" },
          { header: "Link", key: "origin.url" },
        ],
      ],
    },
  ];

  const bodyData = [
    {
      key: "manager",
      value: [
        {
          id: "bodyVariant",
          dataColor: "bg-yellow-100 hover:bg-yellow-50",
          dataVariant:
            "px-2 py-2 text-sm font-medium text-yellow-900 border-yellow-300 text-nowrap",
          dataPosition: "item-center justify-center",
        },
      ],
    },
    {
      key: "data",
      value: {
        data: newData,
        dataLength: data?.info?.count,
        currentPage: currentPage,
        setCurrentPage: setCurrentPage,
        param: "စာမျက်နှာ",
      },
    },
  ];

  const footers = [
    {
      key: "manager",
      value: [
        {
          id: "footerVariant",
          dataVariant:
            "bg-gray-100 px-2 py-2 text-sm font-medium text-gray-900 border-gray-300",
          dataPosition: "item-center justify-start",
        },
      ],
    },
    {
      key: "data",
      value: [
        { footer: "Total Items", col: 0 },
        { footer: data?.info?.count, col: 3 },
      ],
    },
  ];

  const caption = [
    {
      key: "manager",
      value: {
        fontSize: 30,
        fontWeight: "bold",
        captionVariant: "text-cyan-500",
      },
    },
    {
      key: "data",
      value: "Data Table",
    },
  ];

  const action = [
    {
      badges: [
        {
          key: "manager",
          value: {
            dataSize: { x: 10, y: 6 },
            dataRadius: 25,
            dataBorderVariant: "border-transparent",
            dataBorderSize: 1,
            dataTextSize: 12,
            dataFont: 600,
          },
          Alive: {
            dataVariant: "bg-green-500",
            dataTextVariant: "text-white",
          },
          Dead: {
            dataVariant: "bg-red-500",
            dataTextVariant: "text-white",
          },
          unknown: {
            dataVariant: "bg-gray-500",
            dataTextVariant: "text-white",
          },
        },
      ],
    },
    {
      photos: [
        {
          key: "manager",
          value: [
            {
              id: "photosVariant",
              dataSize: { x: 40 },
              dataFit: "cover",
              dataRadius: 50,
              dataRatio: 1 / 1,
            },
          ],
        },
      ],
    },
    {
      actions: [
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
              onClick: (navigator, row) => navigator(`#`),
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
      ],
    },
  ];

  const handleAction = (row, actionType) => {
    console.log(actionType, "on row:", row);
  };

  const themeManager = [
    {
      key: "layoutVariant",
      value: [
        { id: "caption", dataPosition: "text-start", gapBelow: 30 },
        {
          id: "pagination",
          dataPosition: "justify-center md:justify-end",
          gapAbove: 20,
          gapBetween: 18,
          reverse: { X: false, Y: true },
        },
      ],
    },
    {
      key: "paginationVariant",
      value: [
        {
          id: "colorVariant",
          dropdownVariant: "bg-white",
          backgroundVariant: "bg-white",
          hoverVariant: "hover:bg-yellow-100",
          colorVariant: "text-yellow-900 border-yellow-500",
          activeVariant: "bg-yellow-500 text-white",
          buttonVariant: "hover:text-yellow-500",
        },
      ],
    },
  ];

  const merges = [
    { key: "manager", value: [] },
    {
      key: "data",
      value: [
        { type: "header", startCol: 0, colSpan: 1, rowSpan: 2 },
        { type: "header", startCol: 1, colSpan: 1, rowSpan: 2 },
        { type: "header", startCol: 2, colSpan: 1, rowSpan: 2 },
        { type: "header", startCol: 3, colSpan: 1, rowSpan: 2 },
        { type: "header", startCol: 4, colSpan: 1, rowSpan: 2 },
        { type: "header", startCol: 5, colSpan: 1, rowSpan: 2 },
        { type: "header", startCol: 6, colSpan: 1, rowSpan: 2 },
        { type: "header", startCol: 7, colSpan: 1, rowSpan: 2 },
        { type: "header", startCol: 8, colSpan: 2, rowSpan: 1 },
        { type: "header", startCol: 10, colSpan: 2, rowSpan: 1 },
        { type: "header", startCol: 12, colSpan: 1, rowSpan: 2 },
        { type: "header", startCol: 13, colSpan: 1, rowSpan: 2 },
        { type: "header", startCol: 14, colSpan: 1, rowSpan: 2 },
        { type: "body", startRow: 1, startCol: 1, colSpan: 1, rowSpan: 1 },
        { type: "body", startRow: 1, startCol: 1, colSpan: 1, rowSpan: 1 },
        // {
        //   type: "body",
        //   startRow: 1,
        //   startCol: 3,
        //   colSpan: 3,
        //   rowSpan: 1,
        //   showData: 3,
        // },
        { type: "footer", startCol: 0, colSpan: 3, rowSpan: 1 },
        { type: "footer", startCol: 3, colSpan: 12, rowSpan: 1 },
      ],
    },
  ];

  const paginationEngines = {
    pagination: true,
    goPage: true,
    perPage: true,
  };

  const tableData = [
    { key: "themeManager", value: themeManager },
    { key: "caption", value: caption },
    { key: "columns", value: columns },
    { key: "action", value: action },
    { key: "footers", value: footers },
    { key: "data", value: bodyData },
    { key: "perPage", value: 20 },
    { key: "merges", value: merges },
  ];

  return (
    <div className="w-full h-full">
      <TableGroup data={tableData} paginationCore={paginationEngines} />
    </div>
  );
};

export default TablePageFour;

//___To Do____________
//====================
//[Done]1. Cell Manager
//2. Action Separate Columns
//[Drop] 3. Multi-Captions
//[Done] 4. Multi-Header rows/Add new cell
//[Done] 5. Multi-Footer rows/Add new cell
//6. Add New Body row/cell
//[Done] 7. Checkbox Columns
//8. Colgroup/Advance Columns Manager
//9. Rowgroup/Advance Row Manager
//[Done] 10. Pagination Core & Engines
//[Done] 11. To show photo at cell.
