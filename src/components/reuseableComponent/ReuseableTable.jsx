import React from "react";

const ReuseableTable = ({ data }) => {
  // Convert the passed-in data (an array of { key, value } items) into an object.
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

  // Extract various configuration sections from the data object.
  const tableCaption = tableDataObject?.caption;
  const tableColumns = tableDataObject?.columns;
  const tableData = tableDataObject?.data;
  const tableActions = tableDataObject?.actions;
  const tableMerges = tableDataObject?.merges;
  const tableFooters = tableDataObject?.footers;
  const tableTheme = tableDataObject?.captionVariant;

  // For each configuration section, we use the entry with key "data".
  const filteredTableCaption =
    tableCaption?.find((cap) => cap.key === "data")?.value || [];
  const filteredTableColumns =
    tableColumns?.find((col) => col.key === "data")?.value || [];
  const filteredTableMerges =
    tableMerges?.find((m) => m.key === "data")?.value || [];
  const filteredTableFooters =
    tableFooters?.find((f) => f.key === "data")?.value || [];
  const filteredActionsData =
    tableActions?.find((action) => action.key === "data")?.value || [];
  // Note: the table data is provided as an object with a "data" property.
  const filteredTableData =
    tableData?.find((b) => b.key === "data")?.value?.data || [];

  // Get theme/layout configurations.
  const filteredLayoutVariant = tableTheme?.find(
    (a) => a.key === "layoutVariant"
  )?.value?.dataLayout;
  const captionPosition = filteredLayoutVariant?.find(
    (a) => a.id === "caption"
  );

  const captionVariant = tableCaption?.find((a) => a.key === "manager")?.value;
  const columnsVariant = tableColumns
    ?.find((a) => a.key === "manager")
    ?.value?.find((a) => a.id === "columnsVariant");
  const bodyVariant = tableData
    ?.find((a) => a.key === "manager")
    ?.value?.find((a) => a.id === "bodyVariant");
  const actionsVariant = tableActions
    ?.find((a) => a.key === "manager")
    ?.value?.find((a) => a.id === "actionsVariant");
  const footersVariant = tableFooters
    ?.find((a) => a.key === "manager")
    ?.value?.find((a) => a.id === "footerVariant");

  // The columns array in your configuration has two parts:
  //   • The first part (“manager”) holds settings (like styling) for the columns.
  //   • The second part (“data”) holds the actual column definitions.
  //
  // In your columns "data", you have one column (the last one, with key "actions")
  // that is handled separately. We filter that out here.
  const actionsColumnIndex = filteredTableColumns?.findIndex(
    (col) => col.action === "actions" && col.key
  );
  const filteredColumns = filteredTableColumns?.filter((col) => !col.action);
  // Save the "actions" column (management column) for later use.
  const actionColumn = filteredTableColumns?.find((col) => col.action);

  // Build a map for footer content based on column key.
  const footerMap = filteredTableFooters
    ? filteredTableFooters.reduce((acc, item) => {
        acc[item.key] = item.footer;
        return acc;
      }, {})
    : {};

  // Total number of data rows.
  const totalBodyRows = tableData ? tableData.length : 0;

  // ---------------------------
  // MERGE HANDLING FUNCTION
  // ---------------------------
  //
  // This function checks if the cell at (rowIndex, colIndex) in the given section
  // ("header", "body", or "footer") is part of a merge rule.
  //
  // If a merge rule applies, we look at its "showData" property:
  //   • If present, that tells us which column in the merged group should display the data.
  //   • Otherwise, we default to the starting column (startCol).
  //
  // Only the cell at the designated “display” column (and in the starting row of the merge)
  // returns the merge attributes (colSpan and rowSpan). All other cells covered by the merge
  // return null, so they will be skipped during rendering.
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
      // Determine which column should show the data.
      const displayCol =
        mergeItem.showData !== undefined
          ? mergeItem.showData
          : mergeItem.startCol;
      // Only render the cell if it’s at the designated display column and the first row of the merge.
      if (rowIndex === (mergeItem.startRow || 0) && colIndex === displayCol) {
        return {
          colSpan: mergeItem.colSpan,
          rowSpan: mergeItem.rowSpan || totalBodyRows + 1,
        };
      }
      // Otherwise, return null to indicate this cell is merged into another.
      return null;
    }
    return {};
  };

  // ---------------------------
  // HELPER: Check if the actions (management) column is covered by a merge.
  // (The actions column is rendered separately and its index equals the number of
  // regular (filtered) columns.)
  const isActionColumnCovered = (rowIndex, section = "body") => {
    const actionColIndex = filteredColumns.length; // actions column sits after the data columns.
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

  // For header and footer, we use rowIndex = 0.
  const actionColumnCoveredInHeader = isActionColumnCovered(0, "header");
  const actionColumnCoveredInFooter = isActionColumnCovered(0, "footer");

  // ---------------------------
  // RENDERING
  // ---------------------------

  const getNestedValue = (obj, key) =>
    key
      .split(".")
      .reduce(
        (acc, part) => (acc && acc[part] !== undefined ? acc[part] : ""),
        obj
      );

  return (
    <div>
      <div className="overflow-auto w-full custom-scrollbar">
        <table className="w-full table-auto border-collapse">
          {/* CAPTION */}
          <caption
            style={{
              marginBottom: `${captionPosition?.gapBelow || 10}px`,
              fontSize: `${captionVariant?.fontSize || "12"}px`,
              fontWeight: `${captionVariant?.fontWeight || "normal"}`,
            }}
            className={`${captionVariant?.captionVariant || ""} ${
              captionPosition?.dataPosition || "text-center"
            }`}
          >
            {filteredTableCaption}
          </caption>

          {/* HEADER */}
          <thead className={`${columnsVariant?.dataVariant || "bg-cyan-100"}`}>
            <tr>
              {/* Render normal (data) columns */}
              {filteredColumns.map((col, colIndex) => {
                const mergeAttrs = getMergeAttributes(0, colIndex, "header");
                if (mergeAttrs === null) return null; // skip cells covered by a merge.
                return (
                  <th
                    key={colIndex}
                    {...mergeAttrs}
                    className={`${
                      columnsVariant?.dataVariant ||
                      "px-4 py-2 text-left text-sm font-medium text-gray-700 border border-cyan-300"
                    }`}
                  >
                    <span
                      className={`flex flex-row ${
                        columnsVariant?.dataPosition ||
                        "items-center justify-center gap-1"
                      }`}
                    >
                      {col.icon && <span>{col.icon}</span>}
                      {col.header}
                    </span>
                  </th>
                );
              })}

              {/* Render the actions (management) column, if any.
                  Its index is equal to the length of filteredColumns. */}
              {filteredActionsData?.length > 0 &&
                (() => {
                  const actionsColIndex = filteredColumns.length;
                  const mergeAttrs = getMergeAttributes(
                    0,
                    actionsColIndex,
                    "header"
                  );
                  if (mergeAttrs === null) return null;
                  return (
                    <th
                      {...mergeAttrs}
                      className={`${
                        columnsVariant?.dataVariant ||
                        "px-4 py-2 text-left text-sm font-medium text-gray-700 border border-cyan-300"
                      }`}
                    >
                      <span
                        className={`flex flex-row ${
                          columnsVariant?.dataPosition ||
                          "items-center justify-center gap-1"
                        }`}
                      >
                        {actionColumn?.icon && <span>{actionColumn.icon}</span>}
                        {actionColumn?.header}
                      </span>
                    </th>
                  );
                })()}
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {filteredTableData?.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {/* Render normal (data) columns */}
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
                        bodyVariant?.dataVariant ||
                        "px-4 py-2 text-sm text-gray-600 border border-cyan-300"
                      }`}
                    >
                      <span
                        className={`flex flex-row ${
                          bodyVariant?.dataPosition ||
                          "items-center justify-center"
                        }`}
                      >
                        {getNestedValue(row, col.key)}
                      </span>
                    </td>
                  );
                })}

                {/* Render the actions (management) column */}
                {filteredActionsData?.length > 0 &&
                  (() => {
                    const actionsColIndex = filteredColumns.length;
                    const mergeAttrs = getMergeAttributes(
                      rowIndex,
                      actionsColIndex,
                      "body"
                    );
                    if (mergeAttrs === null) return null;
                    return (
                      <td
                        {...mergeAttrs}
                        className={`${
                          bodyVariant?.dataVariant ||
                          "px-4 py-2 text-sm text-gray-600 border border-cyan-300"
                        }`}
                      >
                        <div
                          className={`flex ${
                            actionsVariant?.dataPosition ||
                            "items-center justify-center"
                          } ${
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
                              className={`flex items-center justify-center ${
                                action.actionVariant ||
                                "text-gray-500 hover:text-gray-700"
                              } ${
                                action.iconFlexType === "horizontal"
                                  ? "flex-row"
                                  : "flex-col"
                              }`}
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
                    );
                  })()}
              </tr>
            ))}
          </tbody>

          {/* FOOTER */}
          {filteredTableFooters && filteredTableFooters.length > 0 && (
            <tfoot
              className={`${footersVariant?.dataVariant || "bg-cyan-100"}`}
            >
              <tr>
                {/* Render normal (data) footer cells */}
                {filteredColumns.map((col, colIndex) => {
                  const mergeAttrs = getMergeAttributes(0, colIndex, "footer");
                  if (mergeAttrs === null) return null;
                  return (
                    <td
                      key={colIndex}
                      {...mergeAttrs}
                      className={`${
                        footersVariant?.dataVariant ||
                        "px-4 py-2 text-left text-sm font-medium text-gray-700 border border-cyan-300"
                      }`}
                    >
                      <span
                        className={`flex flex-row ${
                          footersVariant?.dataPosition ||
                          "items-center justify-center"
                        }`}
                      >
                        {footerMap[col.key] || ""}
                      </span>
                    </td>
                  );
                })}

                {/* Render the actions (management) footer cell */}
                {filteredActionsData?.length > 0 &&
                  (() => {
                    const actionsColIndex = filteredColumns.length;
                    const mergeAttrs = getMergeAttributes(
                      0,
                      actionsColIndex,
                      "footer"
                    );
                    if (mergeAttrs === null) return null;
                    return (
                      <td
                        {...mergeAttrs}
                        className={`${
                          footersVariant?.dataVariant ||
                          "px-4 py-2 text-left text-sm font-medium text-gray-700 border border-cyan-300"
                        }`}
                      >
                        {footerMap[actionColumn?.key] || ""}
                      </td>
                    );
                  })()}
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
};

export default ReuseableTable;
