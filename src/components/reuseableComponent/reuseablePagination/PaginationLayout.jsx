import React from "react";
import PaginationBody from "./PaginationBody";

const PaginationLayout = ({ data }) => {
  return (
    <div className="">
      <PaginationBody data={data} />
    </div>
  );
};

export default PaginationLayout;
