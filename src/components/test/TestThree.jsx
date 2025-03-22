import React from "react";
import OmniGrix from "../OmniGrixToolkit/components/OmniGrix";

const TestThree = () => {
  const columns = [
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
          {
            header: "Management",
            key: "buttonOne",
            serial: 987654321,
            action: "actions",
          },
          {
            header: "Management",
            key: "buttonTwo",
            serial: 123456789,
            action: "actions",
          },
          {
            header: "Management",
            key: "buttonThree",
            serial: 543219876,
            action: "actions",
          },
        ],
        [
          { header: "Name", key: "location.name" },
          { header: "Link", key: "location.url" },
          { header: "Name", key: "origin.name" },
          { header: "Link", key: "origin.url" },
          {
            header: "ActOne",
            key: "buttonOne",
            action: "actions",
          },
          {
            header: "ActTwo",
            key: "buttonTwo",
            action: "actions",
          },
          {
            header: "ActThree",
            key: "buttonThree",
            action: "actions",
          },
        ],
      ],
    },
  ];

  const bodyData = [
    {
      key: "data",
      value: {
        getQuery: {
          baseUrl: "https://rickandmortyapi.com/api/",
          endpoint: "character?page=${page}",
          method: "GET",
          identifier: {
            data: "data?.results",
            length: "data?.info?.count",
            page: "page",
          },
        },
        param: "စားပြီးပြီလား",
      },
    },
  ];

  const footers = [
    {
      key: "manager",
      value: [
        {
          id: "footerCell",
          coordination: { x: 0, y: [0, 1, { from: 3, to: 15 }] },
          dataVariant: "border-r-0",
        },
      ],
    },
    {
      key: "data",
      value: [
        [
          { footer: "Total Data", col: 2 },
          { footer: true, identifier: "data?.info?.count", col: 4 },
        ],
      ],
    },
  ];

  const action = [
    {
      links: [
        {
          key: "manager",
          value: [
            {
              id: "linksVariant",
              dataColor: "",
              dataVariant: "",
              dataInt: "",
            },
          ],
        },
      ],
    },
    {
      actions: [
        {
          key: "data",
          value: [
            {
              serial: [987654321, 543219876],
              icon: "👁",
              label: "Detail",
            },
            {
              serial: [123456789, 543219876],
              icon: "✂",
              label: "Delete",
            },
          ],
        },
      ],
    },
  ];

  const themeManager = [
    {
      key: "layoutVariant",
      value: [{ id: "table", dataRadius: 4 }],
    },
  ];

  const merges = [
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
        { type: "header", startCol: 14, colSpan: 3, rowSpan: 1 },
      ],
    },
  ];

  const tableData = [
    { key: "columns", value: columns },
    { key: "data", value: bodyData },
    { key: "footers", value: footers },
    { key: "action", value: action },
    { key: "themeManager", value: themeManager },
    { key: "merges", value: merges },
    { key: "perPage", value: 20 },
  ];

  return (
    <div>
      <OmniGrix data={tableData} paginationCore />
    </div>
  );
};

export default TestThree;
