import { createBrowserRouter, Navigate } from "react-router-dom";

import { ProtectedRoute } from "../auth/ProtectedRoute";
import RootLayout from "../layouts/RootLayout";

import LoginPage from "../pages/login/LoginPage";
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
    path: "/login",
    element: <LoginPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
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
    ],
  },

  {
    path: "*",
    element: <Navigate to="/users" replace />,
  },
]);
