import React, { useState } from "react";
import { useNavigate } from "react-router";

// Utility: Convert array of { key, value } items into an object.
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

// Utility: Retrieve nested value (e.g. "user.name") from an object.
const getNestedValue = (obj, key) => {
  if (!key) return "";
  return key
    .split(".")
    .reduce(
      (acc, part) => (acc && acc[part] !== undefined ? acc[part] : ""),
      obj
    );
};

// Utility: Process footer rows by calculating sums where needed.
const processFooterRows = (footerRows, tableRows) =>
  footerRows.map((row) =>
    row.map((cell) => {
      if (!cell.sumChecked && cell.footer === true && cell.toSum) {
        let rowsToSum = tableRows;
        if (cell.sumOnly && Array.isArray(cell.sumOnly)) {
          rowsToSum = tableRows.filter((_, index) =>
            cell.sumOnly.includes(index)
          );
        } else if (cell.sumLimit) {
          rowsToSum = tableRows.slice(0, cell.sumLimit);
        }
        const total = rowsToSum.reduce(
          (sum, item) => sum + Number(getNestedValue(item, cell.toSum) || 0),
          0
        );
        return {
          ...cell,
          footer: Number(total.toFixed(3)).toLocaleString(),
        };
      }
      return cell;
    })
  );

// Utility: Build a mapping for cells that allow summing on click.
const buildSumConfigs = (processedFooterRows) => {
  const sumConfigs = {};
  processedFooterRows.flat().forEach((cell) => {
    const groupKey = cell.sumChecked !== undefined ? cell.sumChecked : cell.key;
    if (groupKey && cell.sumChecked !== undefined) {
      sumConfigs[groupKey] = cell;
    }
  });
  return sumConfigs;
};

const ReusableTable = ({ data }) => {
  // Parse and extract configuration.
  const tableDataObject = parseTableData(data);
  const {
    caption,
    columns,
    data: tableData,
    action,
    merges,
    footers,
    captionVariant: theme,
    access,
  } = tableDataObject;

  const currentRole = getCurrentRole(access);
  const navigate = useNavigate();

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

  // Extract configuration pieces.
  const captionData = getSectionData(caption);
  const columnsDataRaw = getSectionData(columns);
  const mergesData = getSectionData(merges);
  const footersDataRaw = getSectionData(footers);
  const actionsData = action
    ?.flatMap((a) => a.actions || [])
    .find((a) => a.key === "data")?.value;
  const tableRows = tableData?.find((d) => d.key === "data")?.value?.data || [];
  const deleteQuery =
    tableData?.find((item) => item.key === "data")?.value?.deleteQuery || {};

  const [deletedItem] = typeof deleteQuery === "function" ? deleteQuery() : [];
  const handleDelete = async (id) => {
    if (!deletedItem) {
      console.error("deletedItem is not defined"); // Debugging step
      return;
    }

    try {
      const { data } = await deletedItem({ id }); // ✅ This should now work
      console.log("Deleted item:", data);
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };
  // Handle multi-row headers/footers.
  const headerRows = Array.isArray(columnsDataRaw[0])
    ? columnsDataRaw
    : [columnsDataRaw];
  const baseColumns = headerRows[0];
  const footerRows = Array.isArray(footersDataRaw[0])
    ? footersDataRaw
    : [footersDataRaw];

  // Process footer rows for precomputed sums.
  const processedFooterRows = processFooterRows(footerRows, tableRows);
  const sumConfigs = buildSumConfigs(processedFooterRows);
  const totalBodyRows = tableRows.length;

  // Manager configurations.
  const captionManager = caption?.find((a) => a.key === "manager")?.value;
  const themeManager = theme
    ?.find((a) => a.key === "layoutVariant")
    ?.value?.find((a) => a.id === "caption");
  const columnsManager = getSectionManager(columns, "columnsVariant");
  const bodyManager = getSectionManager(tableData, "bodyVariant");
  const actionsManager = action
    ?.flatMap((a) => a.actions || [])
    ?.find((a) => a.key === "manager")
    ?.value?.find((item) => item.id === "actionsVariant");
  const photosManager = action
    ?.flatMap((a) => a.photos || [])
    ?.find((a) => a.key === "manager")
    ?.value?.find((item) => item.id === "photosVariant");
  const footersManager = getSectionManager(footers, "footerVariant");

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

    const getColumnConfigByIndex = (idx) =>
      idx < baseColumns.length ? baseColumns[idx] : null;

    const combined = [];
    indices.forEach((idx) => {
      const colConfig = getColumnConfigByIndex(idx);
      if (!colConfig) return;
      let value = "";
      if (colConfig.action) {
        if (colConfig.action === "actions") {
          value = actionsData.map((a) => a.label).join(" ");
        }
      } else if (isHeader) {
        value = colConfig.header;
      } else if (isFooter) {
        value = processedFooterRows[colConfig.key] || "";
      } else {
        value = getNestedValue(row, colConfig.key);
      }
      if (value && !combined.includes(value)) combined.push(value);
    });

    const separator = mergeItem.separator || " / ";
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

  // ------------
  // CHECKBOX LOGIC
  // ------------
  const [selectedRows, setSelectedRows] = useState([]);
  const [computedSums, setComputedSums] = useState({});

  const getRowId = (row, rowIndex) =>
    row.id !== undefined ? row.id : rowIndex;

  const handleRowCheckboxChange = (row, rowIndex) => {
    const rowKey = getRowId(row, rowIndex);
    setSelectedRows((prev) =>
      prev.some((selected) => getRowId(selected, rowIndex) === rowKey)
        ? prev.filter((selected) => getRowId(selected, rowIndex) !== rowKey)
        : [...prev, row]
    );
  };

  const allSelected =
    tableRows.length > 0 &&
    tableRows.every((row, rowIndex) =>
      selectedRows.some(
        (selected) => getRowId(selected, rowIndex) === getRowId(row, rowIndex)
      )
    );

  // Sum on click for footer cells.
  const handleSumClick = (groupKey) => {
    const config = sumConfigs[groupKey];
    if (!config || !config.toSum) return;
    if (selectedRows.length === 0) {
      setComputedSums((prev) => ({ ...prev, [groupKey]: 0 }));
      return;
    }
    const sum = selectedRows.reduce(
      (acc, row) => acc + Number(getNestedValue(row, config.toSum) || 0),
      0
    );
    setComputedSums((prev) => ({
      ...prev,
      [groupKey]: Number(sum.toFixed(3)).toLocaleString(),
    }));
  };

  // ------------
  // RENDERING HELPERS
  // ------------
  const renderHeaderCellContent = (cell, col, headerRowIndex) => {
    if (col.action === "checkMarks") {
      if (!currentRole.allowCheckbox) return "";
      return (
        <input
          type="checkbox"
          className="w-4 h-4"
          checked={allSelected}
          onChange={(e) =>
            e.target.checked
              ? setSelectedRows([...tableRows])
              : setSelectedRows([])
          }
        />
      );
    }
    return cell.header || "";
  };

  const renderBodyCellContent = (row, rowIndex, col) => {
    if (col.action) {
      if (col.action === "checkMarks") {
        if (!currentRole.allowCheckbox) return null;
        return (
          <input
            type="checkbox"
            className="w-4 h-4"
            checked={selectedRows.some(
              (selected) =>
                getRowId(selected, rowIndex) === getRowId(row, rowIndex)
            )}
            onChange={() => handleRowCheckboxChange(row, rowIndex)}
          />
        );
      } else if (col.action === "badges") {
        const badgesManager = action?.flatMap((a) => a.badges || []);
        if (badgesManager?.length) {
          const status = row.status; // e.g. "Alive", "Dead", or "unknown"
          // Find the badge that defines the current status
          const badgeForStatus = badgesManager.find((badge) => badge[status]);
          // Get status-specific data if available
          const statusData = badgeForStatus ? badgeForStatus[status] : null;

          // Use status-specific variants if they exist; otherwise fallback to value-level or defaults.
          const dataVariant =
            statusData?.dataVariant ||
            badgeForStatus?.value?.dataVariant ||
            "bg-cyan-600";
          const dataTextVariant =
            statusData?.dataTextVariant ||
            badgeForStatus?.value?.dataTextVariant ||
            "text-white";
          const commonStyles = badgeForStatus?.value || {};
          const dataBorderVariant =
            statusData?.dataBorderVariant ||
            commonStyles.dataBorderVariant ||
            "border-transparent";

          // Calculate style values with fallback defaults
          const paddingY =
            (statusData?.dataSize?.y ?? commonStyles?.dataSize?.y ?? 6) + "px";
          const paddingX =
            (statusData?.dataSize?.x ?? commonStyles?.dataSize?.x ?? 10) + "px";
          const fontSize =
            (statusData?.dataTextSize ?? commonStyles?.dataTextSize ?? 12) +
            "px";

          const dataFont = statusData?.dataFont ?? commonStyles?.dataFont;
          const fontWeight =
            typeof dataFont === "number" ? dataFont : dataFont || 600;

          const borderSize =
            statusData?.dataBorderSize ?? commonStyles?.dataBorderSize;
          const borderWidth =
            typeof borderSize === "number" ? `${borderSize}px` : borderSize;

          const dataRadius = statusData?.dataRadius ?? commonStyles?.dataRadius;
          const borderRadius =
            typeof dataRadius === "number"
              ? `${dataRadius}px`
              : dataRadius || "16px";

          const style = {
            padding: `${paddingY} ${paddingX}`,
            fontSize,
            fontWeight,
            borderWidth,
            borderRadius,
          };

          return (
            <div
              className={`
                ${dataVariant} ${dataTextVariant} border ${dataBorderVariant}
                hover:opacity-80 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
              `}
              style={style}
            >
              {status}
            </div>
          );
        }
      } else if (col.action === "photos") {
        const imageUrl = getNestedValue(row, col.key);
        if (imageUrl) {
          return (
            <div
              style={{
                width:
                  typeof photosManager?.dataSize?.x === "number"
                    ? `${photosManager?.dataSize?.x || 64}px`
                    : photosManager?.dataSize?.x || "100%",
                height:
                  typeof photosManager?.dataSize?.y === "number" &&
                  `${photosManager?.dataSize?.y || 64}px`,
                aspectRatio: photosManager?.dataRatio || "1 / 1",
                overflow: "hidden",
                borderRadius: photosManager?.dataRadius
                  ? `${photosManager.dataRadius}px`
                  : "8px",
              }}
            >
              <img
                title={imageUrl}
                src={imageUrl}
                alt="Preview"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: photosManager?.dataFit || "cover",
                }}
              />
            </div>
          );
        }
      } else if (col.action === "links") {
        const linkUrl = getNestedValue(row, col.key);
        if (linkUrl) {
          return (
            <button className="w-[54px] text-cyan-500 hover:text-cyan-700 ">
              <a
                title={linkUrl}
                href={linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-nowrap flex flex-row items-center justify-center gap-[2px] hover:gap-[4px] group transition-all duration-200 ease-out hover:scale-110"
              >
                <span className="relative z-10 underline group-hover:underline-offset-3 decoration-1 underline-offset-1 font-light transition-all duration-200 ease-out">
                  Visit
                </span>
                <span className="relative z-10 text-[16px]">⮺</span>
              </a>
            </button>
          );
        }
      } else if (col.action === "actions") {
        if (!currentRole.allowActions) return null;
        let filteredActions = actionsData;
        if (Array.isArray(currentRole.allowActions)) {
          filteredActions = actionsData?.filter(
            (action) =>
              action.label && currentRole.allowActions.includes(action.label)
          );
        }
        return (
          <div
            className={`flex ${
              actionsManager?.dataPosition || "items-center justify-center"
            } ${
              actionsManager?.actionsFlexType === "horizontal"
                ? "flex-row"
                : "flex-col"
            }`}
            style={{ gap: `${actionsManager?.actionsBetween || 8}px` }}
          >
            {filteredActions?.map((action, actionIndex) => (
              <button
                key={actionIndex}
                onClick={() => {
                  if (
                    typeof action.onClick === "function" &&
                    action.onClick.toString().includes("navigator")
                  ) {
                    action.onClick(navigate, row);
                  } else if (
                    typeof action.onClick === "function" &&
                    action.onClick.toString().includes("eradicator")
                  ) {
                    action.onClick(handleDelete, row);
                  } else if (action.onClick) {
                    action.onClick(row);
                  }
                }}
                className={`flex items-center justify-center ${
                  action.actionVariant || "text-gray-500 hover:text-gray-700"
                } ${
                  action.iconFlexType === "horizontal" ? "flex-row" : "flex-col"
                }`}
                style={{ gap: `${action.gapBetween || 4}px` }}
              >
                {action.icon && (
                  <span className={action.iconVariant}>{action.icon}</span>
                )}
                {action.label}
              </button>
            ))}
          </div>
        );
      }
      return "";
    } else {
      let value = getNestedValue(row, col.key);
      if (!isNaN(value) && value !== "" && value !== null) {
        value = Number(value).toLocaleString();
      }
      return value;
    }
  };

  // ---------------------
  // RENDER: Caption, Header, Body, Footer
  // ---------------------
  const renderCaption = () => (
    <caption
      style={{
        marginBottom: `${themeManager?.gapBelow || 10}px`,
        fontSize: `${captionManager?.fontSize || 12}px`,
        fontWeight: captionManager?.fontWeight || "normal",
        captionSide: themeManager?.captionSide || "top",
      }}
      className={`${captionManager?.captionVariant || ""} ${
        themeManager?.dataPosition || "text-center"
      }`}
    >
      {captionData}
    </caption>
  );

  const renderHeader = () => (
    <thead className={columnsManager?.dataVariant || "bg-cyan-100"}>
      {headerRows.map((row, headerRowIndex) => (
        <tr key={`header-${headerRowIndex}`}>
          {baseColumns.map((col, colIndex) => {
            if (!isColumnAllowed(col)) return null;
            const cell = row.find((c) => c.key === col.key) || {};
            const mergeResult = getMergeAttributes(
              headerRowIndex,
              colIndex,
              "header"
            );
            if (mergeResult === null) return null;
            let content = renderHeaderCellContent(cell, col, headerRowIndex);
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
            return (
              <th
                key={colIndex}
                {...mergeResult.props}
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
  );

  const renderBody = () => (
    <tbody>
      {tableRows.map((row, rowIndex) => (
        <tr
          key={rowIndex}
          className={`${bodyManager?.dataColor || "hover:bg-cyan-50"}`}
        >
          {baseColumns.map((col, colIndex) => {
            if (!isColumnAllowed(col)) return null;
            const mergeResult = getMergeAttributes(rowIndex, colIndex, "body");
            if (mergeResult === null) return null;
            let content = renderBodyCellContent(row, rowIndex, col);
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
            return (
              <td
                key={colIndex}
                {...mergeResult.props}
                className={`${
                  bodyManager?.dataVariant ||
                  "px-4 py-2 text-sm text-gray-600 border border-cyan-300"
                }`}
              >
                <span
                  className={`flex flex-row ${
                    bodyManager?.dataPosition || "items-center justify-center"
                  }`}
                >
                  {content}
                </span>
              </td>
            );
          })}
        </tr>
      ))}
    </tbody>
  );

  const renderFooter = () => (
    <tfoot>
      {processedFooterRows.map((row, footerRowIndex) => (
        <tr key={`footer-${footerRowIndex}`}>
          {baseColumns.map((col, colIndex) => {
            if (!isColumnAllowed(col)) return null;
            const mergeResult = getMergeAttributes(
              footerRowIndex,
              colIndex,
              "footer"
            );
            if (mergeResult === null) return null;
            const cell =
              row.find((c) => {
                if (typeof c.col === "number") return c.col === colIndex;
                return c.col === col.key;
              }) || {};
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
            const groupKey =
              cell.sumChecked !== undefined ? cell.sumChecked : cell.key;
            if (groupKey && sumConfigs[groupKey]) {
              content =
                cell.sumChecked !== undefined ? (
                  computedSums[groupKey] !== undefined ? (
                    computedSums[groupKey]
                  ) : (
                    0
                  )
                ) : (
                  <button
                    className="hover:opacity-75"
                    onClick={() => handleSumClick(groupKey)}
                    style={{ cursor: "pointer" }}
                  >
                    {cell.footer === true ? "Click to Sum" : cell.footer}
                  </button>
                );
            }
            return (
              <td
                key={colIndex}
                {...mergeResult.props}
                className={`${
                  footersManager?.dataVariant ||
                  "px-4 py-2 text-left text-sm font-medium text-gray-700 border border-cyan-300 bg-cyan-50"
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
        </tr>
      ))}
    </tfoot>
  );

  return (
    <div className="overflow-auto w-full custom-scrollbar">
      <table className="w-full table-auto border-collapse">
        {renderCaption()}
        {renderHeader()}
        {renderBody()}
        {footersDataRaw?.length > 0 && renderFooter()}
      </table>
    </div>
  );
};

export default ReusableTable;
