import { Link, Outlet, useNavigate } from "react-router-dom";

export default function RootLayout() {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("token");
    navigate("/login");
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

        <button onClick={logout}>Logout</button>
      </nav>

      <Outlet />
    </div>
  );
}