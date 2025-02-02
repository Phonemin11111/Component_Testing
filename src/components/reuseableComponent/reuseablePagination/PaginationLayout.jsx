import React from "react";
import PaginationBody from "./PaginationBody";

const PaginationLayout = ({ totalPages, currentPage, setCurrentPage }) => {
  return (
    <div className="">
      <PaginationBody
        totalPages={totalPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default PaginationLayout;
