import { useEffect, useState } from "react";
import sdk from "../../sdk";

type User = {
  id: number;
  username?: string;
  names: string;
  email: string;
  role?: string;
};

type Phone = {
  id?: number;
  number: string;
};

function getCurrentUserFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

export default function UsersPage() {
  const currentUser = getCurrentUserFromToken();
  const currentUserId = currentUser?.user_id;
  const isAdmin = currentUser?.role === "admin";
  const [users, setUsers] = useState<User[]>([]);
  const [phones, setPhones] = useState<Phone[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [editUser, setEditUser] = useState<User | null>(null);
  const [editNames, setEditNames] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhones, setEditPhones] = useState<Phone[]>([]);

  const [createUsername, setCreateUsername] = useState("");
  const [createNames, setCreateNames] = useState("");
  const [createEmail, setCreateEmail] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [createRole, setCreateRole] = useState("user");

  // LOAD USERS
  useEffect(() => {
    (async () => {
      const data = await sdk.users.getAll();
      setUsers(data);
    })();
  }, []);

  // SELECT USER
  async function handleSelectUser(userId: number) {
    setSelectedUserId(userId);
    const data = await sdk.phones.getByUser(userId);
    setPhones(data);
  }

  // OPEN MODAL
  async function openEditModal(user: User) {
    setEditUser(user);
    setEditNames(user.names);
    setEditEmail(user.email);

    const data = await sdk.phones.getByUser(user.id);
    setEditPhones(data);

    setIsModalOpen(true);
  }

  // PHONE UPDATE
  function updatePhoneValue(index: number, value: string) {
    const copy = [...editPhones];
    copy[index].number = value;
    setEditPhones(copy);
  }

  function addPhoneField() {
    setEditPhones((prev) => [...prev, { number: "" }]);
  }

  function removePhone(index: number) {
    setEditPhones((prev) => prev.filter((_, i) => i !== index));
  }

  function openCreateModal() {
    setCreateUsername("");
    setCreateNames("");
    setCreateEmail("");
    setCreatePassword("");
    setCreateRole("user");
    setIsCreateModalOpen(true);
  }

  async function handleCreateUser() {
    if (!isAdmin) return;

    try {
      await sdk.users.createByAdmin({
        username: createUsername,
        names: createNames,
        email: createEmail,
        password: createPassword,
        role: createRole,
      });

      const refreshedUsers = await sdk.users.getAll();
      setUsers(refreshedUsers);
      setIsCreateModalOpen(false);
    } catch (err) {
      console.error("CREATE USER FAILED:", err);
      alert("Create user failed!");
    }
  }

  async function handleDeleteUser(user: User) {
    if (!isAdmin) return;

    const confirmed = window.confirm(`Delete ${user.names}?`);
    if (!confirmed) return;

    try {
      await sdk.users.delete(user.id);

      const refreshedUsers = await sdk.users.getAll();
      setUsers(refreshedUsers);

      if (selectedUserId === user.id) {
        setSelectedUserId(null);
        setPhones([]);
      }

      if (editUser?.id === user.id) {
        setIsModalOpen(false);
        setEditUser(null);
      }
    } catch (err) {
      console.error("DELETE USER FAILED:", err);
      alert("Delete user failed!");
    }
  }

  // SAVE
  async function handleSave() {
    if (!editUser) return;

    try {
      await sdk.users.update(editUser.id, {
        names: editNames,
        email: editEmail,
      });

      const oldPhones = await sdk.phones.getByUser(editUser.id);

      for (const old of oldPhones) {
        const stillExists = editPhones.find(p => p.id === old.id);

        if (!stillExists && old.id) {
          await sdk.phones.delete(old.id);
        }
      }

      for (const p of editPhones) {
        if (!p.number.trim()) continue;

        if (p.id) {
          await sdk.phones.edit(p.id, {
            number: p.number,
          });
        } else {
          await sdk.phones.create({
            user_id: editUser.id,
            number: p.number,
          });
        }
      }

      const refreshedPhones = await sdk.phones.getByUser(editUser.id);
      setPhones(refreshedPhones);

      const refreshedUsers = await sdk.users.getAll();
      setUsers(refreshedUsers);

      setIsModalOpen(false);

    } catch (err) {
      console.error("SAVE FAILED:", err);
      alert("Save failed!");
    }
  }

  return (
    <div className="flex gap-6 p-6 bg-gray-100 min-h-screen">

      {/* USERS */}
      <div className="flex-1 bg-white rounded-xl shadow p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Users</h2>

          {isAdmin && (
            <button
              onClick={openCreateModal}
              className="px-3 py-1 bg-green-600 text-white rounded"
            >
              Create User
            </button>
          )}
        </div>

        <table className="w-full border rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr
                key={u.id}
                onClick={() => handleSelectUser(u.id)}
                className="border-t cursor-pointer hover:bg-gray-50"
              >
                <td className="p-2">{u.names}</td>
                <td className="p-2">{u.email}</td>
                {(isAdmin || currentUserId === u.id) && (
                  <td className="p-2">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditModal(u);
                        }}
                        className="px-3 py-1 bg-blue-500 text-white rounded"
                      >
                        Edit
                      </button>

                      {isAdmin && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteUser(u);
                          }}
                          className="px-3 py-1 bg-red-500 text-white rounded"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                )}
                {!isAdmin && currentUserId !== u.id && <td className="p-2" />}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PHONES */}
      <div className="flex-1 bg-white rounded-xl shadow p-4">
        <h2 className="text-xl font-bold mb-4">Phones</h2>

        {!selectedUserId ? (
          <p className="text-gray-500">Select user</p>
        ) : (
          <table className="w-full border rounded-lg overflow-hidden">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2 text-left">Number</th>
              </tr>
            </thead>

            <tbody>
              {phones.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="p-2">{p.number}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white w-[420px] rounded-xl p-5">

            <h2 className="text-xl font-bold mb-3">Edit User</h2>

            <input
              className="w-full p-2 border rounded mb-2"
              value={editNames}
              onChange={(e) => setEditNames(e.target.value)}
              placeholder="Name"
            />

            <input
              className="w-full p-2 border rounded mb-2"
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
              placeholder="Email"
            />

            <hr className="my-3" />

            <h3 className="font-semibold mb-2">Phones</h3>

            {editPhones.map((p, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  className="flex-1 p-2 border rounded"
                  value={p.number}
                  onChange={(e) => updatePhoneValue(i, e.target.value)}
                />

                <button
                  onClick={() => removePhone(i)}
                  className="px-3 bg-red-500 text-white rounded"
                >
                  ✕
                </button>
              </div>
            ))}

            <button
              onClick={addPhoneField}
              className="w-full py-2 bg-gray-200 rounded mb-3"
            >
              + Add phone
            </button>

            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="flex-1 bg-green-500 text-white py-2 rounded"
              >
                Save
              </button>

              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 bg-gray-300 py-2 rounded"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {isCreateModalOpen && isAdmin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white w-[420px] rounded-xl p-5">

            <h2 className="text-xl font-bold mb-3">Create User</h2>

            <input
              className="w-full p-2 border rounded mb-2"
              value={createUsername}
              onChange={(e) => setCreateUsername(e.target.value)}
              placeholder="Username"
            />

            <input
              className="w-full p-2 border rounded mb-2"
              value={createNames}
              onChange={(e) => setCreateNames(e.target.value)}
              placeholder="Full name"
            />

            <input
              className="w-full p-2 border rounded mb-2"
              value={createEmail}
              onChange={(e) => setCreateEmail(e.target.value)}
              placeholder="Email"
            />

            <input
              className="w-full p-2 border rounded mb-2"
              type="password"
              value={createPassword}
              onChange={(e) => setCreatePassword(e.target.value)}
              placeholder="Password"
            />

            <select
              className="w-full p-2 border rounded mb-3"
              value={createRole}
              onChange={(e) => setCreateRole(e.target.value)}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>

            <div className="flex gap-2">
              <button
                onClick={handleCreateUser}
                className="flex-1 bg-green-500 text-white py-2 rounded"
              >
                Create
              </button>

              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="flex-1 bg-gray-300 py-2 rounded"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
