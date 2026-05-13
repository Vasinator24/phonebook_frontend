import { useState } from "react";
import type { User } from "../../types";
import sdk from "../../sdk";

const Users = () => {
  const [user, setUser] = useState<User[] | null>(null);

  // Invoke the API to fetch users and set the state
  const resp = sdk.users
    .getUsers()
    .then((response) => {
      setUser(response.data);
    })
    .catch((error) => {
      console.error("Error fetching users:", error);
    });

  if (resp != null && Array.isArray(resp)) {
    setUser(resp);
  }

  return (
    <>
      {user ? (
        <ul>
          {user.map((u) => (
            <li key={u.id}>
              {u.username} - {u.email}
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading users...</p>
      )}
    </>
  );
};

export default Users;
