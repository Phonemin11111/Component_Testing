import DashboardLayout from "../components/dashboard/DashboardLayout";
import Home from "../pages/dashboard/Home";
import TablePageOne from "../pages/dashboard/TablePageOne";
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
    ],
  },
];

export default dashboardRoute;
