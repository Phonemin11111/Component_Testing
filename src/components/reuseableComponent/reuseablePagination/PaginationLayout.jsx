import React from "react";
import PaginationBody from "./PaginationBody";
import SearchPage from "./SearchPage";
import ItemPerPage from "./ItemPerPage";

const PaginationLayout = ({ data }) => {
  const paginationArray = Array.isArray(data) ? data : [];
  const paginationData = Object.fromEntries(
    paginationArray.map((item) => {
      return [item.key, item.value];
    })
  );

  const paginationEngines = paginationData?.paginationEngines;
  const theme = paginationData?.paginationVariant;
  const filteredLayoutVariant = theme?.find((a) => a.key === "layoutVariant")
    ?.value;
  const paginationPosition = filteredLayoutVariant?.find(
    (a) => a.id === "pagination"
  );

  return (
    <div
      style={{
        gap: paginationPosition?.gapBetween || "18px",
      }}
      className={` flex ${
        paginationPosition?.reverse.Y === true ? "flex-col-reverse" : "flex-col"
      } ${
        paginationPosition?.reverse.X === true
          ? "md:flex-row-reverse"
          : "md:flex-row"
      } items-center`}
    >
      <span className=" flex flex-row gap-1 items-center">
        {paginationEngines && paginationEngines?.perPage !== false && (
          <span>
            <ItemPerPage data={data} />
          </span>
        )}
        {paginationEngines && paginationEngines?.goPage !== false && (
          <span>
            <SearchPage data={data} />
          </span>
        )}
      </span>

      {paginationEngines && paginationEngines?.pagination !== false && (
        <span>
          <PaginationBody data={data} />
        </span>
      )}
    </div>
  );
};

export default PaginationLayout;
