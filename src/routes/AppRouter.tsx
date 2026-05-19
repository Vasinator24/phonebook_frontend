import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import UserPage from "../pages/users/UserPage";
import PhonesPage from "../pages/phones/PhonesPage";
import LoginPage from "../pages/auth/LoginPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <div style={{ padding: 20 }}>
        <nav style={{ marginBottom: 20 }}>
          <Link to="/users">Users</Link>

          <span style={{ margin: "0 10px" }}>|</span>

          <Link to="/phones">Phones</Link>

          <span style={{ margin: "0 10px" }}>|</span>

          <Link to="/">Login</Link>
        </nav>

        <Routes>
          <Route path="/" element={<LoginPage />} />

          <Route path="/users" element={<UserPage />} />

          <Route path="/phones" element={<PhonesPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}