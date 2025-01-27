import PublicLayout from "../components/public/PublicLayout";
import Notfound from "../pages/Notfound";
import Home from "../pages/public/Home";

const publicRoute = [
    {
        path: "/",
        element: <PublicLayout />,
        errorerrorElement: <Notfound />,
        children: [
          {
            path: "/",
            element: <Home />,
          },
        ],
      },
    
  ];
  
  export default publicRoute;