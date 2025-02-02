import React from "react";

const ReusableTable = ({
  columns,
  data,
  actions,
  horizontalActions,
  actionsBetween,
}) => {
  const tableColumns = columns;
  const tableData = data;
  const tableActions = actions;
  const actionsColumnIndex = tableColumns?.findIndex(
    (col) => col.action === "actions" && col.key
  );
  const filteredColumns = tableColumns?.filter((col) => !col.action);

  const customStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 5px;
    height: 5px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #cefafe;
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #cefafe;
  }
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

  return (
    <div>
      <style>{customStyles}</style>
      <div className=" overflow-auto w-full custom-scrollbar">
        <table className="w-full table-auto border-collapse border border-cyan-300">
          <thead className="bg-cyan-100 rounded-t-lg">
            <tr>
              {filteredColumns?.map((col, index) => (
                <th
                  key={index}
                  className="px-4 py-2 text-left text-sm font-medium text-gray-700 border border-cyan-300"
                >
                  <span className="flex flex-row items-center justify-center gap-1">
                    {col.icon && <span>{col.icon}</span>}
                    {col.header}
                  </span>
                </th>
              ))}
              {actionsColumnIndex !== -1 && (
                <th className="px-4 py-2 text-sm font-medium text-gray-700 border-b border-cyan-300">
                  {tableColumns[actionsColumnIndex]?.header}
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {tableData?.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {filteredColumns?.map((col, colIndex) => (
                  <td
                    key={colIndex}
                    className="px-4 py-2 text-sm text-gray-600 border border-cyan-300"
                  >
                    {row[col.key]}
                  </td>
                ))}
                {tableActions?.length > 0 && (
                  <td className="px-4 py-2 text-sm text-gray-600 border border-cyan-300">
                    <div
                      className={`flex ${
                        horizontalActions ? "flex-row" : "flex-col"
                      }  items-center justify-center gap-2`}
                      style={{
                        gap: `${actionsBetween ? actionsBetween : 8}px`,
                      }}
                    >
                      {tableActions?.map((action, actionIndex) => (
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
                            gap: `${
                              action.gapBetween ? action.gapBetween : 4
                            }px`,
                          }}
                        >
                          {action.icon && (
                            <span className={`${action.iconVariant}`}>
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReusableTable;
