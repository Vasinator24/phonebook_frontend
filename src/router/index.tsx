import { createBrowserRouter, Navigate } from "react-router-dom";

import RootLayout from "../layouts/RootLayout";

import LoginPage from "../pages/auth/LoginPage";
import UserPage from "../pages/users/UserPage";

import ProtectedRoute from "../components/ProtectedRoute";

const routes = [
  {
    path: "/users",
    element: <UserPage />,
  },
];

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },

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
        element: (
          <ProtectedRoute>
            {route.element}
          </ProtectedRoute>
        ),
      })),
    ],
  },

  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
]);