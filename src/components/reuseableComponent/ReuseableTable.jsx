import React from "react";

const ReusableTable = ({ columns, data, actions }) => {
  const tableColumns = columns;
  const tableData = data;
  const tableActions = actions;
  const actionsColumnIndex = tableColumns?.findIndex(
    (col) => col.action === "action" && col.key
  );
  const filteredColumns = tableColumns?.filter((col) => !col.action);

  return (
    <div>
      <div className="overflow-auto">
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              {filteredColumns?.map((col, index) => (
                <th
                  key={index}
                  className="px-4 py-2 text-left text-sm font-medium text-gray-700 border border-gray-300"
                >
                  <span className="flex flex-row items-center justify-center gap-1">
                    {col.icon && <span>{col.icon}</span>}
                    {col.header}
                  </span>
                </th>
              ))}
              {actionsColumnIndex !== -1 && (
                <th className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300">
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
                    className="px-4 py-2 text-sm text-gray-600 border border-gray-300"
                  >
                    {row[col.key]}
                  </td>
                ))}
                {tableActions?.length > 0 && (
                  <td className="px-4 py-2 text-sm text-gray-600 border border-gray-300">
                    <div className="flex flex-row items-center justify-center gap-2">
                      {tableActions?.map((action, actionIndex) => (
                        <button
                          key={actionIndex}
                          onClick={() => action.onClick(row)}
                          className={`${
                            action.className ||
                            "text-blue-500 hover:text-blue-700"
                          } flex flex-row items-center justify-center gap-1`}
                        >
                          {action.icon && (
                            <span className="">{action.icon}</span>
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
