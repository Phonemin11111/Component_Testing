import React, { useState } from "react";

const SearchPage = ({ data }) => {
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
  const setSearchParams = paginationDataObject?.setSearchParams;
  const currentPage = paginationDataObject?.currentPage;
  const setCurrentPage = paginationDataObject?.setCurrentPage;
  const filteredColorVariant = colorVariant
    ?.find((a) => a.key === "paginationVariant")
    ?.value?.find((a) => a.id === "colorScheme");

  const [searchPage, setSearchPage] = useState("");

  const handleSearchPage = (e) => {
    if (e.key === "Enter") {
      handleJumpToPage();
    }
  };

  const handleJumpToPage = () => {
    const pageNumber = parseInt(searchPage);
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      setSearchParams(`?page=${pageNumber}`);
      setSearchPage("");
      r;
    } else {
      setSearchPage("");
      alert("Invalid page number! Please search a page that is existed.");
    }
  };

  console.log(filteredColorVariant?.colorVariant?.substring(0, 11));

  return (
    <div className=" w-full h-full flex flex-row items-center justify-center gap-1">
      <button
        onClick={handleJumpToPage}
        htmlFor="goToPage"
        className={` ${
          filteredColorVariant?.colorVariant
            ? filteredColorVariant?.colorVariant
            : "text-cyan-900"
        } ${
          filteredColorVariant?.buttonVariant
            ? `${filteredColorVariant?.buttonVariant}`
            : "hover:text-cyan-600"
        }`}
      >
        Page,
      </button>
      <input
        type="text"
        id="goToPage"
        value={searchPage}
        onChange={(e) => setSearchPage(e.target.value)}
        onKeyUp={handleSearchPage}
        placeholder={currentPage}
        className={`border ${
          filteredColorVariant?.colorVariant
            ? filteredColorVariant?.colorVariant
            : "text-cyan-900 border-cyan-500"
        } rounded w-[32px] p-1 focus:outline-none`}
      />
      <span
        className={` ${
          filteredColorVariant?.colorVariant
            ? filteredColorVariant?.colorVariant
            : "text-cyan-900"
        }`}
      >
        of {totalPages}
      </span>
    </div>
  );
};

export default SearchPage;
