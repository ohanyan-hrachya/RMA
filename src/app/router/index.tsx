import { Route, Routes } from "react-router-dom";
import { Manager } from "../layout";

const ROUTES = [
  {
    layout: <Manager />,
    routes: [{ path: "/", element: <div>Overview</div> }],
  },
];

export const Router = () => {
  return (
    <Routes>
      {ROUTES.map((route, idx) => (
        <Route key={idx} element={route.layout}>
          {route.routes.map((r, i) => (
            <Route key={i} path={r.path} element={r.element} />
          ))}
        </Route>
      ))}
    </Routes>
  );
};
