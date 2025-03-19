import DashboardLayout from "../components/dashboard/DashboardLayout";
import TestOne from "../components/test/TestOne";
import TestTwo from "../components/test/TestTwo";
import Calculator from "../pages/dashboard/Calculator";
import Home from "../pages/dashboard/Home";
import TablePageCopy from "../pages/dashboard/TablePageCopy";
import TablePageDetail from "../pages/dashboard/TablePageDetail";
import TablePageFour from "../pages/dashboard/TablePageFour";
import TablePageOne from "../pages/dashboard/TablePageOne";
import TablePageThree from "../pages/dashboard/TablePageThree";
import TablePageTwo from "../pages/dashboard/TablePageTwo";
import Notfound from "../pages/Notfound";

const dashboardRoute = [
  {
    path: "/cms-admin",
    element: <DashboardLayout />,
    errorerrorElement: <Notfound />,
    children: [
      {
        path: "/cms-admin",
        element: <Home />,
      },
      {
        path: "/cms-admin/tablePageOne",
        element: <TablePageOne />,
      },
      {
        path: "/cms-admin/tablePageTwo",
        element: <TablePageTwo />,
      },
      {
        path: "/cms-admin/tablePageThree",
        element: <TablePageThree />,
      },
      {
        path: "/cms-admin/tablePageFour",
        element: <TablePageFour />,
      },
      {
        path: "/cms-admin/tablePageCopy",
        element: <TablePageCopy />,
      },
      {
        path: "/cms-admin/testOne",
        element: <TestOne />,
      },
      {
        path: "/cms-admin/testTwo",
        element: <TestTwo />,
      },
      {
        path: "/cms-admin/tablePageDetail/:id",
        element: <TablePageDetail />,
      },
      {
        path: "/cms-admin/calculator",
        element: <Calculator />,
      },
    ],
  },
];

export default dashboardRoute;
