import React, { useState } from "react";

const PaginationBody = ({ totalPages, currentPage, setCurrentPage }) => {
  const [dropdownType, setDropdownType] = useState(null);
  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
    setDropdownType(null);
  };

  const handlePrevClick = () => setCurrentPage((prev) => Math.max(1, prev - 1));
  const handleNextClick = () =>
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));

  const getPagination = () => {
    if (totalPages <= 5)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, 4, "left"];
    if (currentPage >= totalPages - 2)
      return [
        "right",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];

    return ["left", currentPage - 1, currentPage, currentPage + 1, "right"];
  };

  const getDropdownPages = (type) => {
    const isLeft = type === "left";
    const isRight = type === "right";
    const offset = isLeft ? 2 : 1;
    const maxPages = totalPages - 4;

    if (isLeft) {
      if (currentPage <= 3) {
        return Array.from({ length: maxPages }, (_, i) => i + 5);
      }
      return Array.from(
        { length: currentPage - offset },
        (_, i) => currentPage - i - offset
      );
    }

    if (isRight) {
      if (currentPage < totalPages - 2) {
        return Array.from(
          { length: totalPages - (currentPage + 1) },
          (_, i) => currentPage + i + 2
        );
      }
      return Array.from({ length: maxPages }, (_, i) => totalPages - i - 4);
    }

    return [];
  };

  return (
    <div className="flex items-center gap-2 relative">
      <button
        onClick={handlePrevClick}
        disabled={currentPage === 1}
        className="px-3 py-1 hover:bg-gray-100 flex items-center justify-center border border-gray-500 rounded disabled:opacity-50"
        aria-label="Previous Page"
      >
        Prev
      </button>

      <ul className="flex gap-2">
        {getPagination().map((page, index) => (
          <li key={index} className="relative">
            {typeof page === "number" ? (
              <button
                onClick={() => handlePageClick(page)}
                className={`w-[32px] flex justify-center items-center py-1 border border-gray-500 rounded cursor-pointer transition-all ${
                  page === currentPage
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-100"
                }`}
                aria-label={`Page ${page}`}
              >
                {page}
              </button>
            ) : (
              <div className="relative">
                <button
                  onClick={() =>
                    setDropdownType(dropdownType === page ? null : page)
                  }
                  aria-expanded={dropdownType === page}
                  className="w-[32px] flex justify-center items-center py-1 cursor-pointer hover:bg-gray-100 rounded-[50%]"
                >
                  •••
                </button>

                {dropdownType === page && (
                  <ul
                    className={`bottom-full ml-[-2px] absolute z-10 bg-white border border-gray-500 rounded shadow-md max-h-32 overflow-auto px-1.5 text-center`}
                  >
                    {getDropdownPages(page).map((dropdownPage) => (
                      <li key={dropdownPage}>
                        <button
                          onClick={() => handlePageClick(dropdownPage)}
                          className="block w-full py-1 hover:bg-gray-200"
                        >
                          {dropdownPage}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>

      <button
        onClick={handleNextClick}
        disabled={currentPage === totalPages}
        className="px-3 py-1 flex items-center justify-center hover:bg-gray-100 border border-gray-500 rounded disabled:opacity-50"
        aria-label="Next Page"
      >
        Next
      </button>
    </div>
  );
};

export default PaginationBody;
