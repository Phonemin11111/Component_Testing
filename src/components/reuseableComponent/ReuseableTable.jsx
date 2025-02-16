import React from "react";

const ReuseableTable = ({ data }) => {
  // Convert array of { key, value } items into an object.
  const tableDataArray = Array.isArray(data) ? data : [];
  const tableDataObject = Object.fromEntries(
    tableDataArray
      .filter((item) => {
        if (!item.key || item.value === undefined) {
          console.warn("Invalid data format:", item);
          return false;
        }
        return true;
      })
      .map((item) => [item.key, item.value])
  );

  // Destructure configuration sections.
  const {
    caption,
    columns,
    data: tableData,
    actions,
    merges,
    footers,
  } = tableDataObject;

  // Helper functions for extraction.
  const getSectionData = (section) =>
    section?.find((item) => item.key === "data")?.value || [];
  const getSectionManager = (section, id) =>
    section
      ?.find((item) => item.key === "manager")
      ?.value?.find((item) => item.id === id);

  // Extract configuration parts.
  const captionData = getSectionData(caption);
  const columnsDataRaw = getSectionData(columns);
  const mergesData = getSectionData(merges);
  const footersDataRaw = getSectionData(footers);
  const actionsData = getSectionData(actions);
  const tableRows = tableData?.find((d) => d.key === "data")?.value?.data || [];

  // Handle multi-row headers:
  const headerRows = Array.isArray(columnsDataRaw[0])
    ? columnsDataRaw
    : [columnsDataRaw];
  // Use the first header row as the canonical columns.
  const canonicalColumns = headerRows[0];

  // Identify columns (action column and data columns).
  const actionColumn = canonicalColumns.find((col) => col.action);
  const dataColumns = canonicalColumns.filter((col) => !col.action);

  // For footers, also support multi-row (if not, wrap in an array).
  const footerRows = Array.isArray(footersDataRaw[0])
    ? footersDataRaw
    : [footersDataRaw];

  // Compute total sum from table rows.
  const totalSum = tableRows.reduce((sum, item) => sum + item.price, 0);

  // Build footer map – if footer value is true, show computed totalSum.
  const processedFooterRows = footerRows.map((row) => {
    // Check if the row contains an item where footer is true
    const hasBooleanFooter = row.some((item) => item.footer === true);

    if (hasBooleanFooter) {
      // Process only the array with footer: true
      return row.map((item) => ({
        ...item,
        footer:
          item.footer === true ? Number(totalSum.toFixed(3)) : item.footer,
      }));
    } else {
      // Return the raw array without modifications
      return row;
    }
  });

  const totalBodyRows = tableRows.length;

  // Manager configurations.
  const captionManager = caption?.find((a) => a.key === "manager")?.value;
  const columnsManager = getSectionManager(columns, "columnsVariant");
  const bodyManager = getSectionManager(tableData, "bodyVariant");
  const actionsManager = getSectionManager(actions, "actionsVariant");
  const footersManager = getSectionManager(footers, "footerVariant");

  // ---------------------------
  // MERGE HANDLING FUNCTIONS
  // ---------------------------
  const getMergeAttributes = (rowIndex, colIndex, section = "body") => {
    if (!mergesData) return { props: {} };

    const mergeItem = mergesData.find(
      (m) =>
        m.type === section &&
        rowIndex >= (m.startRow || 0) &&
        rowIndex < (m.startRow || 0) + (m.rowSpan || totalBodyRows) &&
        colIndex >= m.startCol &&
        colIndex < m.startCol + m.colSpan
    );
    if (!mergeItem) return { props: {} };

    // If applyToAllRows flag is set in a body merge, render the merged cell in every row at the starting column.
    if (section === "body" && mergeItem.applyToAllRows) {
      if (colIndex === mergeItem.startCol) {
        return { props: { colSpan: mergeItem.colSpan, rowSpan: 1 }, mergeItem };
      }
      return null;
    }

    // Otherwise, render the merged cell only once at the designated display column.
    const designatedCol = Array.isArray(mergeItem.showData)
      ? mergeItem.showData[0]
      : mergeItem.showData ?? mergeItem.startCol;
    if (rowIndex === (mergeItem.startRow || 0) && colIndex === designatedCol) {
      return {
        props: {
          colSpan: mergeItem.colSpan,
          rowSpan: mergeItem.rowSpan || totalBodyRows,
        },
        mergeItem,
      };
    }
    return null;
  };

  const getCombinedContent = (
    row,
    mergeItem,
    isHeader = false,
    isFooter = false
  ) => {
    let indices = Array.isArray(mergeItem.showData)
      ? mergeItem.showData
      : [mergeItem.showData ?? mergeItem.startCol];
    indices = indices.filter(
      (idx) =>
        idx >= mergeItem.startCol &&
        idx < mergeItem.startCol + mergeItem.colSpan
    );

    // Helper: return the column configuration.
    const getColumnConfigByIndex = (idx) =>
      idx < dataColumns.length ? dataColumns[idx] : actionColumn || null;

    // Build combined values (deduplicating repeated values).
    const combined = [];
    indices.forEach((idx) => {
      const colConfig = getColumnConfigByIndex(idx);
      if (!colConfig) return;
      let value = "";
      if (colConfig === actionColumn) {
        value = actionsData.map((a) => a.label).join(" ");
      } else if (isHeader) {
        value = colConfig.header;
      } else if (isFooter) {
        value = processedFooterRows[colConfig.key] || "";
      } else {
        value = getNestedValue(row, colConfig.key);
      }
      if (value && !combined.includes(value)) combined.push(value);
    });

    let separator = mergeItem.separator || " / ";
    if (typeof separator === "string") return combined.join(` ${separator} `);
    if (Array.isArray(separator)) {
      let result = "";
      for (let i = 0; i < combined.length; i++) {
        result += combined[i];
        if (i < combined.length - 1) {
          const sep = separator[i] !== undefined ? ` ${separator[i]} ` : " / ";
          result += sep;
        }
      }
      return result;
    }
    return combined.join(" / ");
  };

  // Helper: Retrieve a nested value (e.g. "user.name") from an object.
  const getNestedValue = (obj, key) => {
    if (!key) return "";
    return key
      .split(".")
      .reduce(
        (acc, part) => (acc && acc[part] !== undefined ? acc[part] : ""),
        obj
      );
  };

  return (
    <div className="overflow-auto w-full custom-scrollbar">
      <table className="w-full table-auto border-collapse">
        {/* CAPTION */}
        <caption
          style={{
            marginBottom: `${captionManager?.gapBelow || 10}px`,
            fontSize: `${captionManager?.fontSize || "12"}px`,
            fontWeight: captionManager?.fontWeight || "normal",
          }}
          className={`${captionManager?.captionVariant || ""} ${
            captionManager?.dataPosition || "text-center"
          }`}
        >
          {captionData}
        </caption>

        {/* HEADER */}
        <thead className={`${columnsManager?.dataVariant || "bg-cyan-100"}`}>
          {headerRows.map((row, headerRowIndex) => (
            <tr key={`header-${headerRowIndex}`}>
              {canonicalColumns.map((col, colIndex) => {
                // Find the matching cell in the current header row by key.
                const cell = row.find((c) => c.key === col.key) || {};
                const mergeResult = getMergeAttributes(
                  headerRowIndex,
                  colIndex,
                  "header"
                );
                if (mergeResult === null) return null;
                let content = cell.header || "";
                if (
                  mergeResult.mergeItem &&
                  Array.isArray(mergeResult.mergeItem.showData)
                ) {
                  content = getCombinedContent(
                    null,
                    mergeResult.mergeItem,
                    true,
                    false
                  );
                }
                const { props: mergeProps } = mergeResult;
                return (
                  <th
                    key={colIndex}
                    {...mergeProps}
                    className={`${
                      columnsManager?.dataVariant ||
                      "px-4 py-2 text-left text-sm font-medium text-gray-700 border border-cyan-300"
                    }`}
                  >
                    <span
                      className={`flex flex-row ${
                        columnsManager?.dataPosition ||
                        "items-center justify-center gap-1"
                      }`}
                    >
                      {cell.icon && <span>{cell.icon}</span>}
                      {content}
                    </span>
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>

        {/* BODY */}
        <tbody>
          {tableRows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {dataColumns.map((col, colIndex) => {
                const mergeResult = getMergeAttributes(
                  rowIndex,
                  colIndex,
                  "body"
                );
                if (mergeResult === null) return null;
                let content = getNestedValue(row, col.key);
                if (
                  mergeResult.mergeItem &&
                  Array.isArray(mergeResult.mergeItem.showData)
                ) {
                  content = getCombinedContent(
                    row,
                    mergeResult.mergeItem,
                    false,
                    false
                  );
                }
                const { props: mergeProps } = mergeResult;
                return (
                  <td
                    key={colIndex}
                    {...mergeProps}
                    className={`${
                      bodyManager?.dataVariant ||
                      "px-4 py-2 text-sm text-gray-600 border border-cyan-300"
                    }`}
                  >
                    <span
                      className={`flex flex-row ${
                        bodyManager?.dataPosition ||
                        "items-center justify-center"
                      }`}
                    >
                      {content}
                    </span>
                  </td>
                );
              })}
              {actionColumn &&
                (() => {
                  const mergeResult = getMergeAttributes(
                    rowIndex,
                    dataColumns.length,
                    "body"
                  );
                  if (mergeResult === null) return null;
                  const { props: mergeProps } = mergeResult;
                  return (
                    <td
                      {...mergeProps}
                      className={`${
                        bodyManager?.dataVariant ||
                        "px-4 py-2 text-sm text-gray-600 border border-cyan-300"
                      }`}
                    >
                      <div
                        className={`flex ${
                          actionsManager?.dataPosition ||
                          "items-center justify-center"
                        } ${
                          actionsManager?.actionsFlexType === "horizontal"
                            ? "flex-row"
                            : "flex-col"
                        }`}
                        style={{
                          gap: `${actionsManager?.actionsBetween || 8}px`,
                        }}
                      >
                        {actionsData.map((action, actionIndex) => (
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
        {footerRows.length > 0 && (
          <tfoot className={`${footersManager?.dataVariant || "bg-cyan-100"}`}>
            {processedFooterRows.map((row, footerRowIndex) => (
              <tr key={`footer-${footerRowIndex}`}>
                {dataColumns.map((col, colIndex) => {
                  const mergeResult = getMergeAttributes(
                    footerRowIndex,
                    colIndex,
                    "footer"
                  );
                  if (mergeResult === null) return null;
                  const cell = row.find((c) => c.key === col.key) || {};
                  let content = cell.footer || "";
                  if (
                    mergeResult.mergeItem &&
                    Array.isArray(mergeResult.mergeItem.showData)
                  ) {
                    content = getCombinedContent(
                      null,
                      mergeResult.mergeItem,
                      false,
                      true
                    );
                  }
                  const { props: mergeProps } = mergeResult;
                  return (
                    <td
                      key={colIndex}
                      {...mergeProps}
                      className={`${
                        footersManager?.dataVariant ||
                        "px-4 py-2 text-left text-sm font-medium text-gray-700 border border-cyan-300"
                      }`}
                    >
                      <span
                        className={`flex flex-row ${
                          footersManager?.dataPosition ||
                          "items-center justify-center"
                        }`}
                      >
                        {content}
                      </span>
                    </td>
                  );
                })}
                {actionColumn &&
                  (() => {
                    const mergeResult = getMergeAttributes(
                      footerRowIndex,
                      dataColumns.length,
                      "footer"
                    );
                    if (mergeResult === null) return null;
                    const { props: mergeProps } = mergeResult;
                    return (
                      <td
                        {...mergeProps}
                        className={`${
                          footersManager?.dataVariant ||
                          "px-4 py-2 text-left text-sm font-medium text-gray-700 border border-cyan-300"
                        }`}
                      >
                        {processedFooterRows[actionColumn?.key] || ""}
                      </td>
                    );
                  })()}
              </tr>
            ))}
          </tfoot>
        )}
      </table>
    </div>
  );
};

export default ReuseableTable;
