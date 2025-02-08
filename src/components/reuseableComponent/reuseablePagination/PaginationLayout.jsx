import React from "react";
import PaginationBody from "./PaginationBody";

const PaginationLayout = ({ data }) => {
  const paginationArray = Array.isArray(data) ? data : [];
  const paginationData = Object.fromEntries(
    paginationArray.map((item) => {
      return [item.key, item.value];
    })
  );

  const paginationEngines = paginationData?.paginationEngines;

  return (
    <div className="">
      {paginationEngines && paginationEngines?.pagination !== false && (
        <span>
          <PaginationBody data={data} />
        </span>
      )}
    </div>
  );
};

export default PaginationLayout;
