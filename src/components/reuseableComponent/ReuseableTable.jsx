import React from "react";

const ReuseableTable = ({ data }) => {
  const tableDataArray = Array.isArray(data) ? data : [];
  const tableDataObject = Object.fromEntries(
    tableDataArray.map((item) => {
      if (!item.key || item.value === undefined) {
        console.warn("Invalid data format:", item);
        return [];
      }
      return [item.key, item.value];
    })
  );

  const tableColumns = tableDataObject?.columns;
  const tableData = tableDataObject?.data;
  const tableActions = tableDataObject?.actions;
  const tableMerges = tableDataObject?.merges;
  const tableFooters = tableDataObject?.footers;

  const filteredTableColumns =
    tableColumns?.find((col) => col.key === "data")?.value || [];
  const filteredTableMerges =
    tableMerges?.find((m) => m.key === "data")?.value || [];
  const filteredTableFooters =
    tableFooters?.find((f) => f.key === "data")?.value || [];
  const filteredActionsData =
    tableActions?.find((action) => action.key === "data")?.value || [];

  const columnsVariant = tableColumns
    ?.find((a) => a.key === "manager")
    ?.value?.find((a) => a.id === "columnsVariant");
  const bodyVariant = tableColumns
    ?.find((a) => a.key === "manager")
    ?.value?.find((a) => a.id === "bodyVariant");
  const actionsVariant = tableActions
    ?.find((a) => a.key === "manager")
    ?.value?.find((a) => a.id === "actionsVariant");

  const actionsColumnIndex = filteredTableColumns?.findIndex(
    (col) => col.action === "actions" && col.key
  );

  const filteredColumns = filteredTableColumns?.filter((col) => !col.action);
  const actionColumn = filteredTableColumns?.find((col) => col.action);

  const footerMap = filteredTableFooters
    ? filteredTableFooters.reduce((acc, item) => {
        acc[item.key] = item.footer;
        return acc;
      }, {})
    : {};

  const totalBodyRows = tableData ? tableData.length : 0;

  const getMergeAttributes = (rowIndex, colIndex, section = "body") => {
    if (!filteredTableMerges) return {};

    const mergeItem = filteredTableMerges.find(
      (m) =>
        m.type === section &&
        rowIndex >= (m.startRow || 0) &&
        rowIndex < (m.startRow || 0) + (m.rowSpan || totalBodyRows + 1) &&
        colIndex >= m.startCol &&
        colIndex < m.startCol + m.colSpan
    );

    if (mergeItem) {
      if (
        rowIndex === (mergeItem.startRow || 0) &&
        colIndex === mergeItem.startCol
      ) {
        return {
          colSpan: mergeItem.colSpan,
          rowSpan: mergeItem.rowSpan || totalBodyRows + 1,
        };
      }
      return null;
    }

    return {};
  };

  const isActionColumnCovered = (rowIndex, section = "body") => {
    const actionColIndex = filteredColumns.length;
    if (!filteredTableMerges) return false;

    return filteredTableMerges.some((m) => {
      if (m.type !== section) return false;
      return (
        rowIndex >= (m.startRow || 0) &&
        rowIndex < (m.startRow || 0) + (m.rowSpan || totalBodyRows + 1) &&
        actionColIndex >= m.startCol &&
        actionColIndex < m.startCol + m.colSpan
      );
    });
  };

  const actionColumnCoveredInHeader = isActionColumnCovered(0, "header");

  return (
    <div>
      <div className="overflow-auto w-full custom-scrollbar">
        <table className="w-full table-auto border-collapse border border-cyan-300">
          <thead
            className={`${
              columnsVariant?.dataVariant
                ? columnsVariant?.dataVariant
                : "bg-cyan-100 rounded-t-lg"
            }`}
          >
            <tr>
              {filteredColumns.map((col, colIndex) => {
                const mergeAttrs = getMergeAttributes(0, colIndex, "header");
                if (mergeAttrs === null) return null;
                return (
                  <th
                    key={colIndex}
                    {...mergeAttrs}
                    className={`${
                      columnsVariant?.dataVariant
                        ? columnsVariant?.dataVariant
                        : "px-4 py-2 text-left text-sm font-medium text-gray-700 border border-cyan-300"
                    }`}
                  >
                    <span
                      className={`flex flex-row${
                        columnsVariant?.dataPosition
                          ? columnsVariant?.dataPosition
                          : "items-center justify-center gap-1"
                      }`}
                    >
                      {col.icon && <span>{col.icon}</span>}
                      {col.header}
                    </span>
                  </th>
                );
              })}
              {filteredActionsData?.length > 0 &&
                !actionColumnCoveredInHeader && (
                  <th
                    className={`${
                      columnsVariant?.dataVariant
                        ? columnsVariant?.dataVariant
                        : "px-4 py-2 text-left text-sm font-medium text-gray-700 border border-cyan-300"
                    }`}
                  >
                    <span
                      className={`flex flex-row${
                        columnsVariant?.dataPosition
                          ? columnsVariant?.dataPosition
                          : "items-center justify-center gap-1"
                      }`}
                    >
                      {filteredTableColumns?.[actionsColumnIndex]?.icon && (
                        <span>
                          {filteredTableColumns?.[actionsColumnIndex]?.icon}
                        </span>
                      )}
                      {actionsColumnIndex !== -1 &&
                        filteredTableColumns?.[actionsColumnIndex]?.header}
                    </span>
                  </th>
                )}
            </tr>
          </thead>

          <tbody>
            {tableData?.map((row, rowIndex) => {
              const actionColumnCoveredInBody = isActionColumnCovered(
                rowIndex,
                "body"
              );
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
                        className={`${
                          bodyVariant?.dataVariant
                            ? bodyVariant?.dataVariant
                            : "px-4 py-2 text-sm text-gray-600 border border-cyan-300"
                        }`}
                      >
                        <span
                          className={`flex flex-row${
                            bodyVariant?.dataPosition
                              ? bodyVariant?.dataPosition
                              : "items-center justify-center"
                          }`}
                        >
                          {row[col.key]}
                        </span>
                      </td>
                    );
                  })}
                  {filteredActionsData.length > 0 &&
                    !actionColumnCoveredInBody && (
                      <td
                        className={`${
                          bodyVariant?.dataVariant
                            ? bodyVariant?.dataVariant
                            : "px-4 py-2 text-sm text-gray-600 border border-cyan-300"
                        }`}
                      >
                        <div
                          className={`${
                            actionsVariant?.dataPosition
                              ? actionsVariant?.dataPosition
                              : `items-center justify-center`
                          } flex ${
                            actionsVariant?.actionsFlexType === "horizontal"
                              ? "flex-row"
                              : "flex-col"
                          }`}
                          style={{
                            gap: `${actionsVariant?.actionsBetween || 8}px`,
                          }}
                        >
                          {filteredActionsData.map((action, actionIndex) => (
                            <button
                              key={actionIndex}
                              onClick={() =>
                                action.onClick && action.onClick(row)
                              }
                              className={`${
                                action.dataVariant ||
                                "text-gray-500 hover:text-gray-700"
                              } flex ${
                                action.iconFlexType === "horizontal"
                                  ? "flex-row"
                                  : "flex-col"
                              } items-center justify-center`}
                              style={{ gap: `${action.gapBetween || 4}px` }}
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

          {filteredTableFooters && filteredTableFooters.length > 0 && (
            <tfoot className="bg-cyan-50">
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
                {filteredActionsData?.length > 0 &&
                  !isActionColumnCovered(0, "footer") && (
                    <td className="px-4 py-2 text-sm font-medium text-gray-700 border border-cyan-300">
                      {footerMap[actionColumn?.key] || ""}
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
