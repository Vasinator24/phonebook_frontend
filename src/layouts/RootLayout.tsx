import { Link, Outlet, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "../auth/useAuth";

export default function RootLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login", { replace: true });
  }

  return (
    <div style={{ padding: 20 }}>
      <nav
        style={{
          display: "flex",
          gap: 20,
          marginBottom: 20,
          alignItems: "center",
        }}
      >
        <Link to="/users">Users</Link>
        <Link to="/phones">Phones</Link>
        <span style={{ marginLeft: "auto" }}>{user?.names}</span>
        <Button size="sm" variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </nav>

      <Outlet />
    </div>
  );
}
