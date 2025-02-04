import React from "react";

const ReuseableTable = ({ data }) => {
  const tableDataArray = data;
  const tableDataObject = Object.fromEntries(
    tableDataArray.map(({ key, value }) => [key, value])
  );
  const tableColumns = tableDataObject?.columns;
  const tableData = tableDataObject?.data;
  const tableActions = tableDataObject?.actions;
  const tableMerges = tableDataObject?.merges;
  const tableFooters = tableDataObject?.footers;

  const filteredColumns = tableColumns?.filter((col) => !col.action);

  const actionColumn = tableColumns?.find((col) => col.action);

  const footerMap = tableFooters
    ? tableFooters.reduce((acc, item) => {
        acc[item.key] = item.footer;
        return acc;
      }, {})
    : {};

  const filteredActionsData = tableActions?.filter(
    (action) => action.id === undefined
  );

  const totalBodyRows = tableData ? tableData.length : 0;

  const getMergeAttributes = (rowIndex, colIndex, section = "body") => {
    const adjustedRowIndex = rowIndex;
    if (!tableMerges) return {};

    if (section === "header" || section === "footer") {
      const mergeItem = tableMerges.find(
        (m) =>
          m.type === section &&
          adjustedRowIndex >= (m.startRow || 0) &&
          adjustedRowIndex <
            (m.startRow || 0) + (m.rowSpan || totalBodyRows + 1) &&
          colIndex >= m.startCol &&
          colIndex < m.startCol + m.colSpan
      );
      if (mergeItem) {
        if (
          adjustedRowIndex === (mergeItem.startRow || 0) &&
          colIndex === mergeItem.startCol
        ) {
          return {
            colSpan: mergeItem.colSpan,
            rowSpan: mergeItem.rowSpan || totalBodyRows + 1,
          };
        }
        return null;
      }
    }

    if (section === "body") {
      const bodyMerge = tableMerges.find(
        (m) =>
          m.type === "body" &&
          rowIndex === m.startRow &&
          colIndex === m.startCol
      );
      if (bodyMerge) {
        return {
          rowSpan: bodyMerge.rowSpan || 1,
          colSpan: bodyMerge.colSpan || 1,
        };
      }

      const coveredBody = tableMerges.find(
        (m) =>
          m.type === "body" &&
          rowIndex >= m.startRow &&
          rowIndex < m.startRow + (m.rowSpan || 1) &&
          colIndex >= m.startCol &&
          colIndex < m.startCol + (m.colSpan || 1)
      );
      if (coveredBody) return null;
    }
    return {};
  };

  const isActionColumnCovered = (rowIndex) => {
    const adjustedRowIndex = rowIndex;
    const actionColIndex = filteredColumns.length;
    if (!tableMerges) return false;

    return tableMerges.some((m) => {
      const mergeStartRow = m.startRow || 0;
      const mergeRowSpan = m.rowSpan || totalBodyRows + 1;
      return (
        adjustedRowIndex >= mergeStartRow &&
        adjustedRowIndex < mergeStartRow + mergeRowSpan &&
        actionColIndex >= m.startCol &&
        actionColIndex < m.startCol + m.colSpan
      );
    });
  };

  const actionColumnCoveredInHeader = isActionColumnCovered(0);

  return (
    <div>
      <div className="overflow-auto w-full custom-scrollbar">
        <table className="w-full table-auto border-collapse border border-cyan-300">
          {/* Header */}
          <thead className="bg-cyan-100 rounded-t-lg">
            <tr>
              {filteredColumns.map((col, colIndex) => {
                const mergeAttrs = getMergeAttributes(0, colIndex, "header");
                if (mergeAttrs === null) return null;
                return (
                  <th
                    key={colIndex}
                    {...mergeAttrs}
                    className="px-4 py-2 text-left text-sm font-medium text-gray-700 border border-cyan-300"
                  >
                    <span className="flex flex-row items-center justify-center gap-1">
                      {col.icon && <span>{col.icon}</span>}
                      {col.header}
                    </span>
                  </th>
                );
              })}
              {filteredActionsData?.length > 0 &&
                !actionColumnCoveredInHeader && (
                  <th className="px-4 py-2 text-sm font-medium text-gray-700 border border-cyan-300">
                    Actions
                  </th>
                )}
            </tr>
          </thead>

          <tbody>
            {tableData?.map((row, rowIndex) => {
              const actionColumnCoveredInBody = isActionColumnCovered(rowIndex);
              return (
                <tr key={rowIndex}>
                  {filteredColumns.map((col, colIndex) => {
                    const mergeAttrs = getMergeAttributes(
                      rowIndex,
                      colIndex,
                      "body"
                    );
                    if (mergeAttrs === null) return null;
                    return (
                      <td
                        key={colIndex}
                        {...mergeAttrs}
                        className="px-4 py-2 text-sm text-gray-600 border border-cyan-300"
                      >
                        {row[col.key]}
                      </td>
                    );
                  })}
                  {filteredActionsData?.length > 0 &&
                    !actionColumnCoveredInBody && (
                      <td className="px-4 py-2 text-sm text-gray-600 border border-cyan-300">
                        <div
                          className={`flex ${
                            tableActions[0]?.actionsFlexType === "horizontal"
                              ? "flex-row"
                              : "flex-col"
                          } items-center justify-center`}
                          style={{
                            gap: `${tableActions[0]?.actionsBetween || 8}px`,
                          }}
                        >
                          {filteredActionsData.map((action, actionIndex) => (
                            <button
                              key={actionIndex}
                              onClick={() => action.onClick(row)}
                              className={`${
                                action.actionVariant ||
                                "text-gray-500 hover:text-gray-700"
                              } flex ${
                                action.iconFlexType === "horizontal"
                                  ? "flex-row"
                                  : "flex-col"
                              } items-center justify-center`}
                              style={{
                                gap: `${action.gapBetween || 4}px`,
                              }}
                            >
                              {action.icon && (
                                <span className={action.iconVariant}>
                                  {action.icon}
                                </span>
                              )}
                              {action.label}
                            </button>
                          ))}
                        </div>
                      </td>
                    )}
                </tr>
              );
            })}
          </tbody>

          {tableFooters && (
            <tfoot className="bg-cyan-50 rounded-b-lg">
              <tr>
                {filteredColumns.map((col, colIndex) => {
                  const mergeAttrs = getMergeAttributes(0, colIndex, "footer");
                  if (mergeAttrs === null) return null;
                  return (
                    <td
                      key={colIndex}
                      {...mergeAttrs}
                      className="px-4 py-2 text-sm font-medium text-gray-700 border border-cyan-300"
                    >
                      {footerMap[col.key] || ""}
                    </td>
                  );
                })}
                {actionColumn &&
                  filteredActionsData?.length > 0 &&
                  !isActionColumnCovered(0) && (
                    <td className="px-4 py-2 text-sm font-medium text-gray-700 border border-cyan-300">
                      {footerMap[actionColumn.key] || ""}
                    </td>
                  )}
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
};

export default ReuseableTable;
