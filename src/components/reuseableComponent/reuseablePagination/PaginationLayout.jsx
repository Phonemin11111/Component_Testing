import React from "react";
import PaginationBody from "./PaginationBody";

const PaginationLayout = ({ totalPages, currentPage, setCurrentPage }) => {
  return (
    <div>
      <PaginationBody
        totalPages={totalPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default PaginationLayout;
