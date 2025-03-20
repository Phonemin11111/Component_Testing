import React from "react";

const Skeleton = ({ rows = 10, columns = 10, data, paginationCore }) => {
  return (
    <table className="w-full table-auto border-separate border-spacing-2">
      <thead>
        <tr>
          {Array.from({ length: columns }).map((_, index) => (
            <th
              key={index}
              className="p-6 bg-gray-300 border-gray-300 animate-pulse rounded"
            ></th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <tr key={rowIndex}>
            {Array.from({ length: columns }).map((_, colIndex) => (
              <td key={colIndex} className="p1">
                <div className="h-6 bg-gray-300 rounded animate-pulse"></div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Skeleton;
