import { createBrowserRouter, Navigate } from "react-router-dom";

import RootLayout from "../layouts/RootLayout";

import UserPage from "../pages/users/UserPage";
import PhonesPage from "../pages/phones/PhonesPage";

const routes = [
  {
    path: "/users",
    element: <UserPage />,
  },
  {
    path: "/phones",
    element: <PhonesPage />,
  },
];

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/users" replace />,
      },

      ...routes.map((route) => ({
        ...route,
      })),
    ],
  },

  {
    path: "*",
    element: <Navigate to="/users" replace />,
  },
]);
