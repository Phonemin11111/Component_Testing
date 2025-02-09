import React, { useEffect } from "react";

const ItemPerPage = ({ data }) => {
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
  const perPage = paginationDataObject?.perPage;
  const setPerPage = paginationDataObject?.setPerPage;
  const defaultPerPage = paginationDataObject?.defaultPerPage;
  const colorVariant = paginationDataObject?.paginationVariant;
  const filteredColorVariant = colorVariant
    ?.find((a) => a.key === "paginationVariant")
    ?.value?.find((a) => a.id === "colorScheme");

  const handleSelectChange = (event) => {
    setPerPage(parseInt(event.target.value));
  };

  return (
    <div>
      <span className="  w-full h-full flex flex-row items-center justify-center gap-1">
        <select
          name="selectItemsPerPage"
          id="selectItemsPerPage"
          value={perPage}
          onChange={handleSelectChange}
          className={` text-cyan-900 border ${
            filteredColorVariant?.colorVariant
              ? filteredColorVariant?.colorVariant
              : "text-cyan-900 border-cyan-500"
          } rounded py-1 focus:outline-none appearance-none w-[32px] text-center`}
        >
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={5}>5</option>
          <option value={10}>10</option>
          {defaultPerPage > 10 && (
            <option value={defaultPerPage}>{defaultPerPage}</option>
          )}
        </select>
        <label
          htmlFor="selectItemsPerPage"
          className={` ${
            filteredColorVariant?.colorVariant
              ? filteredColorVariant?.colorVariant
              : "text-cyan-900"
          }`}
        >
          Per
        </label>
      </span>
    </div>
  );
};

export default ItemPerPage;
