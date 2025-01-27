import { createBrowserRouter } from "react-router";
import dashboardRoute from "./dashboardRoute";
import publicRoute from "./publicRoute";

const routeRegister = [...publicRoute, ...dashboardRoute];

const routes = createBrowserRouter(routeRegister);

export default routes;
