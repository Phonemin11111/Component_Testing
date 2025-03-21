import React from "react";

const parseTableData = (data) => {
  const dataArray = Array.isArray(data) ? data : [];
  return Object.fromEntries(
    dataArray
      .filter((item) => {
        if (!item.key || item.value === undefined) {
          console.warn("Invalid data format:", item);
          return false;
        }
        return true;
      })
      .map((item) => [item.key, item.value])
  );
};

// Utility: Get the current role from access config.
const getCurrentRole = (access) => {
  const roleLevel = access?.find((a) => a.key === "role")?.value;
  const rolePermissions = access?.find((a) => a.key === "permission")?.value;
  return (
    (rolePermissions && rolePermissions[roleLevel]) || {
      viewColumns: "all",
      allowActions: true,
      allowCheckbox: true,
    }
  );
};

// Utility: Extract section data.
const getSectionData = (section) =>
  section?.find((item) => item.key === "data")?.value || [];

// Utility: Extract a manager configuration from a section.
const getSectionManager = (section, id) =>
  section
    ?.find((item) => item.key === "manager")
    ?.value?.find((item) => item.id === id);

const Skeleton = ({ data, paginationCore }) => {
  // Parse and extract configuration.
  const tableDataObject = parseTableData(data);
  const {
    caption,
    columns,
    data: tableData,
    action,
    merges,
    footers,
    themeManager: theme,
    access,
    perPage,
  } = tableDataObject;

  const currentRole = getCurrentRole(access);

  // Helper: Check whether a column should be rendered.
  const isColumnAllowed = (col) => {
    if (
      currentRole.viewColumns !== "all" &&
      Array.isArray(currentRole.viewColumns)
    ) {
      return currentRole.viewColumns.includes(col.key);
    }
    if (!currentRole.allowCheckbox && col.action === "checkMarks") return false;
    if (!currentRole.allowActions && col.action === "actions") return false;
    return true;
  };

  const captionData = getSectionData(caption);
  const columnsDataRaw = getSectionData(columns);
  const mergesData = getSectionData(merges);
  const footersDataRaw = getSectionData(footers);
  const tableRows = tableData?.find((d) => d.key === "data")?.value?.data || [];

  const headerRows = Array.isArray(columnsDataRaw[0])
    ? columnsDataRaw
    : [columnsDataRaw];
  const baseColumns = headerRows[0];
  const footerRows = Array.isArray(footersDataRaw[0])
    ? footersDataRaw
    : [footersDataRaw];
  const totalBodyRows = perPage;

  // Manager configurations.
  const captionManager = caption?.find((a) => a.key === "manager")?.value;
  const themeManager = theme
    ?.find((a) => a.key === "layoutVariant")
    ?.value?.find((a) => a.id === "caption");
  const tableManager = theme
    ?.find((a) => a.key === "layoutVariant")
    ?.value?.find((a) => a.id === "table");
  const columnsManager = getSectionManager(columns, "columnsVariant");
  const bodyManager = getSectionManager(tableData, "bodyVariant");
  const footersManager = getSectionManager(footers, "footerVariant");

  const headerCellManagers = columns
    ?.find((item) => item.key === "manager")
    ?.value?.filter((item) => item.id === "headerCell");
  const bodyCellManagers = tableData
    ?.find((item) => item.key === "manager")
    ?.value?.filter((item) => item.id === "bodyCell");
  const footerCellManagers = footers
    ?.find((item) => item.key === "manager")
    ?.value?.filter((item) => item.id === "footerCell");

  // MERGE HANDLING FUNCTIONS
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

    if (section === "body" && mergeItem.applyToAllRows) {
      if (colIndex === mergeItem.startCol) {
        return { props: { colSpan: mergeItem.colSpan, rowSpan: 1 }, mergeItem };
      }
      return null;
    }

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

  const renderCaption = () => (
    <caption
      className={`${themeManager?.dataPosition || "text-center"}`}
      style={{
        marginBottom: `${themeManager?.gapBelow || 10}px`,
        fontSize: `${captionManager?.fontSize || 12}px`,
        fontWeight: captionManager?.fontWeight || "normal",
        captionSide: themeManager?.captionSide || "top",
      }}
    >
      <span
        className={`bg-gray-200 border-transparent animate-pulse`}
        style={{
          paddingLeft:
            captionData?.length <= 84
              ? `${captionData.length * 6}px`
              : `${captionData.length}px`,
          paddingRight:
            captionData?.length <= 100
              ? `${captionData.length * 6}px`
              : `${captionData.length}px`,
        }}
      ></span>
    </caption>
  );

  const renderHeader = () => {
    return (
      <thead className={""}>
        {headerRows.map((_, headerRowIndex) => (
          <tr key={`header-${headerRowIndex}`}>
            {baseColumns.map((col, colIndex) => {
              if (!isColumnAllowed(col)) return null;
              const mergeResult = getMergeAttributes(
                headerRowIndex,
                colIndex,
                "header"
              );
              if (mergeResult === null) return null;
              const lastSpannedColumn =
                colIndex + (mergeResult.props?.colSpan || 1) - 1;
              // Check if this is the last cell (either naturally or due to merging)
              const isLastCell = lastSpannedColumn === baseColumns.length - 1;
              //fakeMerge function
              const getCoordinationCondition = (coordValue, index) => {
                // If undefined, return true (no condition applied)
                if (coordValue === undefined) return true;
                // If it's an array, return true if any item in the array matches the index.
                if (Array.isArray(coordValue)) {
                  return coordValue.some((item) =>
                    getCoordinationCondition(item, index)
                  );
                }
                // If it's an object with 'from' and 'to' properties, check the range.
                if (
                  typeof coordValue === "object" &&
                  coordValue !== null &&
                  "from" in coordValue &&
                  "to" in coordValue
                ) {
                  return index >= coordValue.from && index <= coordValue.to;
                }
                // Otherwise, assume it's a number.
                return coordValue === index;
              };
              // Filter managers based on the coordination conditions for both x and y.
              // This now handles numbers, range objects, or arrays containing either.
              const matchingHeaderCellManagers = headerCellManagers?.filter(
                (manager) => {
                  const xCondition = getCoordinationCondition(
                    manager?.coordination?.x,
                    colIndex
                  );
                  const yCondition = getCoordinationCondition(
                    manager?.coordination?.y,
                    headerRowIndex
                  );
                  return xCondition && yCondition;
                }
              );
              // Combine the classes for dataVariant (for one parent)
              const combinedHeaderVariant = matchingHeaderCellManagers
                ?.map((manager) => manager.dataVariant)
                .join(" ");
              // Combine the classes for dataPosition (for another parent)
              return (
                <th
                  key={colIndex}
                  {...mergeResult.props}
                  style={
                    tableManager?.dataRadius != undefined
                      ? {
                          borderTopLeftRadius:
                            headerRowIndex === 0 && colIndex === 0
                              ? `${
                                  tableManager?.dataRadius?.tl
                                    ? tableManager?.dataRadius?.tl
                                    : tableManager?.dataRadius?.t
                                    ? tableManager?.dataRadius?.t
                                    : tableManager?.dataRadius || 0
                                }px`
                              : undefined,
                          borderTopRightRadius:
                            headerRowIndex === 0 &&
                            (colIndex === baseColumns.length - 1 || isLastCell)
                              ? `${
                                  tableManager?.dataRadius?.tr
                                    ? tableManager?.dataRadius?.tr
                                    : tableManager?.dataRadius?.t
                                    ? tableManager?.dataRadius?.t
                                    : tableManager?.dataRadius || 0
                                }px`
                              : undefined,
                        }
                      : undefined
                  }
                  className={`bg-gray-300 border-transparent animate-pulse ${
                    columnsManager?.dataVariant || "px-8 py-4"
                  } ${
                    (typeof tableManager?.dataSpacing !== "object" &&
                      tableManager?.dataSpacing !== undefined &&
                      tableManager?.dataSpacing > 0) ||
                    (tableManager?.dataSpacing?.x > 0 &&
                      tableManager?.dataSpacing?.y > 0)
                      ? "border"
                      : `${
                          tableManager?.dataSpacing?.x > 0
                            ? "border-l"
                            : colIndex === 0
                            ? "border-l"
                            : ""
                        } ${
                          tableManager?.dataSpacing?.y > 0
                            ? "border-t"
                            : headerRowIndex === 0
                            ? "border-t"
                            : ""
                        } border-b border-r`
                  } ${combinedHeaderVariant}`}
                ></th>
              );
            })}
          </tr>
        ))}
      </thead>
    );
  };
  const renderBody = () => {
    return (
      <tbody>
        {Array.from({ length: totalBodyRows }).map((_, rowIndex) => (
          <tr key={rowIndex} className={``}>
            {baseColumns.map((col, colIndex) => {
              if (!isColumnAllowed(col)) return null;
              const mergeResult = getMergeAttributes(
                rowIndex,
                colIndex,
                "body"
              );
              if (mergeResult === null) return null;
              const lastSpannedColumn =
                colIndex + (mergeResult.props?.colSpan || 1) - 1;
              // Check if this is the last cell (either naturally or due to merging)
              const isLastCell = lastSpannedColumn === baseColumns.length - 1;
              //fakeMerge function
              const getCoordinationCondition = (coordValue, index) => {
                // If undefined, return true (no condition applied)
                if (coordValue === undefined) return true;
                // If it's an array, return true if any item in the array matches the index.
                if (Array.isArray(coordValue)) {
                  return coordValue.some((item) =>
                    getCoordinationCondition(item, index)
                  );
                }
                // If it's an object with 'from' and 'to' properties, check the range.
                if (
                  typeof coordValue === "object" &&
                  coordValue !== null &&
                  "from" in coordValue &&
                  "to" in coordValue
                ) {
                  return index >= coordValue.from && index <= coordValue.to;
                }
                // Otherwise, assume it's a number.
                return coordValue === index;
              };
              // Filter managers based on the coordination conditions for both x and y.
              // This now handles numbers, range objects, or arrays containing either.
              const matchingBodyCellManagers = bodyCellManagers?.filter(
                (manager) => {
                  const xCondition = getCoordinationCondition(
                    manager?.coordination?.x,
                    colIndex
                  );
                  const yCondition = getCoordinationCondition(
                    manager?.coordination?.y,
                    rowIndex
                  );
                  return xCondition && yCondition;
                }
              );
              // Combine the classes for dataVariant (for one parent)
              const combinedDataVariant = matchingBodyCellManagers
                ?.map((manager) => manager.dataVariant)
                .join(" ");
              // Combine the classes for dataPosition (for another parent)
              return (
                <td
                  key={colIndex}
                  {...mergeResult.props}
                  style={
                    tableManager?.dataRadius != undefined
                      ? {
                          borderBottomLeftRadius:
                            footersDataRaw?.length === 0 &&
                            rowIndex === tableRows.length - 1 &&
                            colIndex === 0
                              ? `${
                                  tableManager?.dataRadius?.bl
                                    ? tableManager?.dataRadius?.bl
                                    : tableManager?.dataRadius?.b
                                    ? tableManager?.dataRadius?.b
                                    : tableManager?.dataRadius || 0
                                }px`
                              : undefined,
                          borderBottomRightRadius:
                            footersDataRaw?.length === 0 &&
                            rowIndex === tableRows.length - 1 &&
                            (colIndex === baseColumns.length - 1 || isLastCell)
                              ? `${
                                  tableManager?.dataRadius?.br
                                    ? tableManager?.dataRadius?.br
                                    : tableManager?.dataRadius?.b
                                    ? tableManager?.dataRadius?.b
                                    : tableManager?.dataRadius || 0
                                }px`
                              : undefined,
                        }
                      : undefined
                  }
                  className={`bg-gray-200 border-transparent animate-pulse ${
                    bodyManager?.dataVariant || "px-8 py-4"
                  } ${
                    (typeof tableManager?.dataSpacing !== "object" &&
                      tableManager?.dataSpacing !== undefined &&
                      tableManager?.dataSpacing > 0) ||
                    (tableManager?.dataSpacing?.x > 0 &&
                      tableManager?.dataSpacing?.y > 0)
                      ? "border"
                      : `border-b border-r ${
                          tableManager?.dataSpacing?.y > 0 ? "border-t" : ""
                        } ${
                          tableManager?.dataSpacing?.x > 0
                            ? "border-l"
                            : "first:border-l"
                        }`
                  } ${combinedDataVariant}`}
                ></td>
              );
            })}
          </tr>
        ))}
      </tbody>
    );
  };

  const renderFooter = () => {
    return (
      <tfoot>
        {footerRows.map((row, footerRowIndex) => (
          <tr key={`footer-${footerRowIndex}`} className={``}>
            {baseColumns.map((col, colIndex) => {
              if (!isColumnAllowed(col)) return null;
              const mergeResult = getMergeAttributes(
                footerRowIndex,
                colIndex,
                "footer"
              );
              if (mergeResult === null) return null;
              // Compute last spanned column index
              const lastSpannedColumn =
                colIndex + (mergeResult.props?.colSpan || 1) - 1;
              // Check if this is the last cell (either naturally or due to merging)
              const isLastCell = lastSpannedColumn === baseColumns.length - 1;
              //fakeMerge function
              const getCoordinationCondition = (coordValue, index) => {
                // If undefined, return true (no condition applied)
                if (coordValue === undefined) return true;
                // If it's an array, return true if any item in the array matches the index.
                if (Array.isArray(coordValue)) {
                  return coordValue.some((item) =>
                    getCoordinationCondition(item, index)
                  );
                }
                // If it's an object with 'from' and 'to' properties, check the range.
                if (
                  typeof coordValue === "object" &&
                  coordValue !== null &&
                  "from" in coordValue &&
                  "to" in coordValue
                ) {
                  return index >= coordValue.from && index <= coordValue.to;
                }
                // Otherwise, assume it's a number.
                return coordValue === index;
              };
              // Filter managers based on the coordination conditions for both x and y.
              // This now handles numbers, range objects, or arrays containing either.
              const matchingFooterCellManagers = footerCellManagers?.filter(
                (manager) => {
                  const xCondition = getCoordinationCondition(
                    manager?.coordination?.x,
                    colIndex
                  );
                  const yCondition = getCoordinationCondition(
                    manager?.coordination?.y,
                    footerRowIndex
                  );
                  return xCondition && yCondition;
                }
              );
              // Combine the class names for dataVariant (to be used in one parent element)
              const combinedFooterVariant = matchingFooterCellManagers
                ?.map((manager) => manager.dataVariant)
                .join(" ");
              return (
                <td
                  key={colIndex}
                  {...mergeResult.props}
                  style={
                    tableManager?.dataRadius != undefined
                      ? {
                          borderBottomLeftRadius:
                            footersDataRaw?.length > 0 &&
                            footerRowIndex === footerRows.length - 1 &&
                            colIndex === 0
                              ? `${
                                  tableManager?.dataRadius?.bl
                                    ? tableManager?.dataRadius?.bl
                                    : tableManager?.dataRadius?.b
                                    ? tableManager?.dataRadius?.b
                                    : tableManager?.dataRadius || 0
                                }px`
                              : undefined,
                          borderBottomRightRadius:
                            footersDataRaw?.length > 0 &&
                            footerRowIndex === footerRows.length - 1 &&
                            (colIndex === baseColumns.length - 1 || isLastCell)
                              ? `${
                                  tableManager?.dataRadius?.br
                                    ? tableManager?.dataRadius?.br
                                    : tableManager?.dataRadius?.b
                                    ? tableManager?.dataRadius?.b
                                    : tableManager?.dataRadius || 0
                                }px`
                              : undefined,
                        }
                      : undefined
                  }
                  className={`bg-gray-300 border-transparent animate-pulse ${
                    footersManager?.dataVariant || "px-8 py-4"
                  } ${
                    (typeof tableManager?.dataSpacing !== "object" &&
                      tableManager?.dataSpacing !== undefined &&
                      tableManager?.dataSpacing > 0) ||
                    (tableManager?.dataSpacing?.x > 0 &&
                      tableManager?.dataSpacing?.y > 0)
                      ? "border"
                      : `border-b border-r ${
                          tableManager?.dataSpacing?.y > 0 ? "border-t" : ""
                        } ${
                          tableManager?.dataSpacing?.x > 0
                            ? "border-l"
                            : "first:border-l"
                        }`
                  } ${combinedFooterVariant}`}
                ></td>
              );
            })}
          </tr>
        ))}
      </tfoot>
    );
  };

  return (
    <div className="overflow-auto w-full custom-scrollbar">
      <table
        className="w-full table-auto border-separate"
        style={{
          borderSpacing: `${
            typeof tableManager?.dataSpacing === "object"
              ? tableManager.dataSpacing.x !== 0
                ? tableManager.dataSpacing.x
                : 2
              : tableManager?.dataSpacing !== 0
              ? tableManager?.dataSpacing
              : 2
          }px ${
            typeof tableManager?.dataSpacing === "object"
              ? tableManager.dataSpacing.y !== 0
                ? tableManager.dataSpacing.y
                : 2
              : tableManager?.dataSpacing !== 0
              ? tableManager?.dataSpacing
              : 2
          }px`,
        }}
      >
        {captionData?.length > 0 && renderCaption()}
        {renderHeader()}
        {renderBody()}
        {footersDataRaw?.length > 0 && renderFooter()}
      </table>
    </div>
  );
};

export default Skeleton;
