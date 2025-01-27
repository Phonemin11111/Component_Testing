import ReactDOM from "react-dom/client";
import "./index.css";
import routes from "./routers/route.jsx";
import { RouterProvider } from "react-router/dom";
import { store } from "./features/app/store.js";
import { Provider } from "react-redux";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={routes} />
  </Provider>
);
