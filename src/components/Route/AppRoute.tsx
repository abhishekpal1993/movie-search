import { Fallback } from "components/Shared/Fallback/Fallback";
import React from "react";
import {
  Navigate,
  NavLink,
  Route,
  Routes
} from "react-router-dom";

const Search = React.lazy(() => import("components/Pages/Search/Search"));
const Favourites = React.lazy(
  () => import("components/Pages/Favourites/Favourites")
);

export const AppRoute: React.FC<{}> = () => {
  return (
    <React.Suspense fallback={<Fallback />}>
      <header className="p-3 bg-dark text-white">
        <div className="container">
          <div className="d-flex flex-wrap align-items-center justify-content-between">
            <NavLink
              to="/"
              className={({ isActive }) =>
                "nav text-decoration-none " +
                (isActive ? "text-secondary" : "text-white")
              }
            >
              Home
            </NavLink>
            <div className="text-end">
              <NavLink
                to="/favourites"
                className={({ isActive }) =>
                  "btn me-2 " + (isActive ? "btn-warning" : "btn-outline-light")
                }
              >
                Favourites
              </NavLink>
            </div>
          </div>
        </div>
      </header>
      <Routes>
        <Route path="/*">
          {/* default page */}
          <Route index element={<Search />} />
          {/* favourites page */}
          <Route caseSensitive path="favourites" element={<Favourites />} />

          {/* fail safe */}
          <Route path="*" element={<Navigate to="/" replace={true} />} />
        </Route>
      </Routes>
    </React.Suspense>
  );
};
