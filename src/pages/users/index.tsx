import { useEffect, useState } from "react";
import sdk from "../../sdk";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const data = await sdk.users.getAll();
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div>
      <h1>Users</h1>

      {users.map(u => (
        <div key={u.id}>
          {u.username} - {u.email}
        </div>
      ))}
    </div>
  );
}
