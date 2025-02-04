import React, { useState, useEffect, useRef } from "react";

const PaginationBody = ({ totalPages, currentPage, setCurrentPage }) => {
  const [dropdownType, setDropdownType] = useState(null);
  const [position, setPosition] = useState("bottom");

  const dropdownRefs = useRef({});
  const buttonRefs = useRef({});

  const handleDropdownClick = (e, page) => {
    const buttonRect = e.target.getBoundingClientRect();
    const spaceBelow = window.innerHeight - buttonRect.bottom;
    setPosition(spaceBelow >= 130 ? "bottom" : "top");
    setDropdownType((prev) => (prev === page ? null : page));
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
    setDropdownType(null);
  };

  const handlePrevClick = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
    setDropdownType(null);
  };

  const handleNextClick = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
    setDropdownType(null);
  };

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

  const handleClickOutside = (event) => {
    if (!dropdownType) return;

    const activeDropdown = dropdownRefs.current[dropdownType];
    const activeButton = buttonRefs.current[dropdownType];

    if (!activeDropdown || !activeButton) {
      setDropdownType(null);
      return;
    }

    if (
      activeDropdown &&
      !activeDropdown.contains(event.target) &&
      activeButton &&
      !activeButton.contains(event.target)
    ) {
      setDropdownType(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownType]);

  useEffect(() => {
    if (dropdownType !== null && !getPagination().includes(dropdownType)) {
      setDropdownType(null);
    }
  }, [currentPage, totalPages]);

  return (
    <div className="flex items-center gap-1 md:gap-2 relative">
      <button
        onClick={handlePrevClick}
        disabled={currentPage === 1}
        className="px-3 py-1 hover:bg-cyan-100 text-cyan-900 flex items-center justify-center border border-cyan-500 rounded disabled:opacity-50"
        aria-label="Previous Page"
      >
        Prev
      </button>
      <ul className="flex gap-1 md:gap-2">
        {getPagination().map((page, index) => (
          <li key={index} className="relative">
            {typeof page === "number" ? (
              <button
                onClick={() => handlePageClick(page)}
                className={`w-[32px] flex justify-center items-center py-1 border border-cyan-500 rounded cursor-pointer transition-all ${
                  page === currentPage
                    ? "bg-cyan-500 text-white"
                    : "hover:bg-cyan-100 text-cyan-900"
                }`}
                aria-label={`Page ${page}`}
              >
                {page}
              </button>
            ) : (
              <div className="relative">
                <button
                  ref={(el) => (buttonRefs.current[page] = el)}
                  onClick={(e) => handleDropdownClick(e, page)}
                  aria-expanded={dropdownType === page}
                  className="px-1 md:px-0 md:w-[32px] text-cyan-500 flex justify-center items-center py-1 cursor-pointer hover:bg-cyan-100 rounded-[50%]"
                >
                  •••
                </button>

                {dropdownType === page && (
                  <ul
                    ref={(el) => (dropdownRefs.current[page] = el)}
                    className={` left-1/2 transform -translate-x-1/2 absolute z-10 min-w-[32px] bg-white border border-cyan-500 rounded shadow-md text-center ${
                      position === "top" ? "bottom-full mb-1" : "top-full mt-1"
                    }`}
                  >
                    {page === "left" ? (
                      <li className="bg-white border-b border-cyan-300 rounded-t p-0.5">
                        <button
                          onClick={() => handlePageClick(totalPages)}
                          className="block text-cyan-500 w-full p-1 hover:bg-cyan-100 rounded-t"
                        >
                          ⥬
                        </button>
                      </li>
                    ) : page === "right" ? (
                      <li className="bg-white border-b border-cyan-300 rounded-t p-0.5">
                        <button
                          onClick={() => handlePageClick(1)}
                          className="block text-cyan-500 w-full p-1 hover:bg-cyan-100 rounded-t"
                        >
                          ⥪
                        </button>
                      </li>
                    ) : null}

                    <div className="max-h-32 overflow-auto custom-scrollbar rounded p-0.5">
                      {getDropdownPages(page).map((dropdownPage) => (
                        <li key={dropdownPage}>
                          <button
                            onClick={() => handlePageClick(dropdownPage)}
                            className="block text-cyan-900 w-full p-0.5 hover:bg-cyan-100 rounded"
                          >
                            {dropdownPage}
                          </button>
                        </li>
                      ))}
                    </div>
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
        className="px-3 py-1 text-cyan-900 flex items-center justify-center hover:bg-cyan-100 border border-cyan-500 rounded disabled:opacity-50"
        aria-label="Next Page"
      >
        Next
      </button>
    </div>
  );
};

export default PaginationBody;
