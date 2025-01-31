import React from "react";
import { Outlet } from "react-router";
import DashboardSideBar from "./DashboardSideBar";
import DashboardHeader from "./DashboardHeader";

const DashboardLayout = () => {
  return (
    <div className="grid grid-cols-11 gap-3 w-screen h-screen bg-gray-100">
      <div className="col-span-2 w-full h-full bg-white p-5">
        <DashboardSideBar />
      </div>
      <div className=" grid grid-rows-9 col-span-9 w-full h-full gap-3 overflow-auto">
        <div className=" row-span-1 w-full h-full bg-white p-5">
          <DashboardHeader />
        </div>
        <div className=" row-span-8 w-full min-h-screen h-max bg-white p-5">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
