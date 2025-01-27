import DashboardLayout from "../components/dashboard/DashboardLayout";
import Home from "../pages/dashboard/Home";
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
    ],
  },
];

export default dashboardRoute;
