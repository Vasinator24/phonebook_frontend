import { useEffect, useState } from "react";
import sdk from "../../sdk";

export default function UserPage() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const data = await sdk.users.getAll();
    setUsers(data);
  }

  async function remove(id: number) {
    await sdk.users.delete(id);
    load();
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Users</h2>

      {users.map(u => (
        <div key={u.id}>
          {u.username} - {u.names}
          <button onClick={() => remove(u.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}