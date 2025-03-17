import React, { useState, useEffect, useRef } from "react";

const PaginationBody = ({ data }) => {
  const paginationDataArray = Array.isArray(data) ? data : [];
  const paginationDataObject = Object.fromEntries(
    paginationDataArray.map((item) => {
      if (!item.key || item.value === undefined) {
        console.warn("Invalid data format:", item);
        return [];
      }
      return [item.key, item.value];
    })
  );

  const colorVariant = paginationDataObject?.paginationVariant;
  const totalPages = paginationDataObject?.totalPages;
  const currentPage = paginationDataObject?.currentPage;
  const setCurrentPage = paginationDataObject?.setCurrentPage;

  const filteredColorVariant = colorVariant
    ?.find((a) => a.key === "paginationVariant")
    ?.value?.find((a) => a.id === "colorVariant");

  const [dropdownType, setDropdownType] = useState(null);
  const [position, setPosition] = useState("bottom");

  const dropdownRefs = useRef({});
  const buttonRefs = useRef({});

  const handleDropdownClick = (e, page) => {
    const buttonRect = e.target.getBoundingClientRect();
    const spaceBelow = window.innerHeight - buttonRect.bottom;
    setPosition(spaceBelow >= 145 ? "bottom" : "top");
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
        className={`px-3 py-1 flex items-center justify-center border rounded disabled:opacity-50 ${
          filteredColorVariant?.colorVariant
            ? `${filteredColorVariant?.colorVariant} ${filteredColorVariant?.hoverVariant} ${filteredColorVariant?.backgroundVariant}`
            : `hover:bg-cyan-100 text-cyan-900 border-cyan-500`
        }`}
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
                className={`w-[32px] flex justify-center items-center py-1 border ${
                  filteredColorVariant?.colorVariant
                    ? `${
                        page === currentPage &&
                        !filteredColorVariant?.activeVariant
                          ? "border-cyan-500"
                          : filteredColorVariant?.colorVariant?.substring(
                              15,
                              filteredColorVariant?.colorVariant?.length
                            )
                      } ${
                        page === currentPage
                          ? filteredColorVariant?.activeVariant
                          : filteredColorVariant?.hoverVariant
                      } ${
                        page === currentPage
                          ? "border-cyan-500"
                          : filteredColorVariant?.backgroundVariant
                      }`
                    : "border-cyan-500"
                } rounded cursor-pointer transition-all ${
                  page === currentPage
                    ? `${
                        filteredColorVariant?.activeVariant
                          ? `${filteredColorVariant?.activeVariant}`
                          : "bg-cyan-500 text-white"
                      }`
                    : `${
                        filteredColorVariant?.colorVariant
                          ? filteredColorVariant?.colorVariant
                          : `${
                              page === currentPage ? null : "hover:bg-cyan-100"
                            } text-cyan-900`
                      }`
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
                  className={`px-1 md:px-0 md:w-[32px] flex justify-center items-center py-1 cursor-pointer rounded-[50%] ${
                    filteredColorVariant?.colorVariant
                      ? `${filteredColorVariant?.colorVariant} ${filteredColorVariant?.hoverVariant}`
                      : "hover:bg-cyan-100 text-cyan-500"
                  }`}
                >
                  •••
                </button>

                {dropdownType === page && (
                  <ul
                    ref={(el) => (dropdownRefs.current[page] = el)}
                    className={` left-1/2 transform -translate-x-1/2 absolute z-10 min-w-[32px] border ${
                      filteredColorVariant?.colorVariant
                        ? `${filteredColorVariant?.colorVariant} ${filteredColorVariant?.dropdownVariant}`
                        : "bg-white border-cyan-300"
                    } rounded shadow-md text-center ${
                      position === "top" ? "bottom-full mb-1" : "top-full mt-1"
                    }`}
                  >
                    {page === "left" ? (
                      <li
                        className={` border-b rounded-t ${
                          filteredColorVariant?.colorVariant
                            ? `${filteredColorVariant?.colorVariant} ${filteredColorVariant?.hoverVariant}`
                            : "bg-white border-cyan-300"
                        }`}
                      >
                        <button
                          onClick={() => handlePageClick(totalPages)}
                          className={`block tracking-[-7px] text-xl pr-[5px] pb-[3px] w-full  rounded-t ${
                            filteredColorVariant?.colorVariant
                              ? `${filteredColorVariant?.colorVariant} ${filteredColorVariant?.hoverVariant}`
                              : "text-cyan-500 hover:bg-cyan-100"
                          }`}
                        >
                          {">>"}
                        </button>
                      </li>
                    ) : page === "right" ? (
                      <li
                        className={` border-b rounded-t ${
                          filteredColorVariant?.colorVariant
                            ? `${filteredColorVariant?.colorVariant} ${filteredColorVariant?.hoverVariant}`
                            : "bg-white border-cyan-300"
                        }`}
                      >
                        <button
                          onClick={() => handlePageClick(1)}
                          className={`block tracking-[-7px] text-xl pr-[7px] pb-[3px] w-full rounded-t ${
                            filteredColorVariant?.colorVariant
                              ? `${filteredColorVariant?.colorVariant} ${filteredColorVariant?.hoverVariant}`
                              : "text-cyan-500 hover:bg-cyan-100"
                          }`}
                        >
                          {"<<"}
                        </button>
                      </li>
                    ) : null}

                    <div className="max-h-32 overflow-auto custom-scrollbar rounded p-0.5">
                      {getDropdownPages(page).map((dropdownPage) => (
                        <li key={dropdownPage}>
                          <button
                            onClick={() => handlePageClick(dropdownPage)}
                            className={`block w-full p-0.5 rounded ${
                              filteredColorVariant?.colorVariant
                                ? `${filteredColorVariant?.colorVariant} ${filteredColorVariant?.hoverVariant}`
                                : "text-cyan-900 hover:bg-cyan-100"
                            }`}
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
        className={`px-3 py-1 flex items-center justify-center border ${
          filteredColorVariant?.colorVariant
            ? `${filteredColorVariant?.colorVariant} ${filteredColorVariant?.hoverVariant} ${filteredColorVariant?.backgroundVariant}`
            : "hover:bg-cyan-100 text-cyan-900 border-cyan-500"
        } rounded disabled:opacity-50`}
        aria-label="Next Page"
      >
        Next
      </button>
    </div>
  );
};

export default PaginationBody;
