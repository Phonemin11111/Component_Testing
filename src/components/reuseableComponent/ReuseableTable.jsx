import React from "react";

const ReusableTable = ({ columns, data }) => {
  const tableColumns = columns;
  const tableData = data;

  return (
    <div>
      <div className="overflow-auto">
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              {tableColumns?.map((col, index) => (
                <th
                  key={index}
                  className="px-4 py-2 text-left text-sm font-medium text-gray-700 border border-gray-300"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData?.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {tableColumns?.map((col, colIndex) => (
                  <td
                    key={colIndex}
                    className="px-4 py-2 text-sm text-gray-600 border border-gray-300"
                  >
                    {row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReusableTable;
