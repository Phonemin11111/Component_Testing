import React from "react";
import { useGetDetailedItemQuery } from "../../features/api/fakeStoreApi";
import { useParams } from "react-router";

const TablePageDetail = () => {
  const { id } = useParams();
  const { data } = useGetDetailedItemQuery({ id });
  const detail = data;
  console.log(data);

  return (
    <div>
      <div className=" flex flex-col gap-5">
        <span>Detail Page</span>
        <img className=" w-36 aspect-square" src={detail?.image} alt="" />
        <span>{detail?.id}</span>
        <span>{detail?.title}</span>
        <span>{detail?.price}</span>
        <span>{detail?.description}</span>
        <span>{detail?.category}</span>
      </div>
    </div>
  );
};

export default TablePageDetail;
