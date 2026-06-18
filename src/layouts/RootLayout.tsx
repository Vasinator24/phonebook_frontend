import { Link, Outlet } from "react-router-dom";

export default function RootLayout() {
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
      </nav>

      <Outlet />
    </div>
  );
}
