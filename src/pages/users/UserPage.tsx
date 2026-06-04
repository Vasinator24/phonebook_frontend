import { useEffect, useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import sdk from "../../sdk";
import type { Phone, User } from "../../types";

const createUserSchema = z.object({
  username: z.string().trim().min(3, "Username must be at least 3 characters."),
  names: z.string().trim().min(3, "Name must be at least 3 characters."),
  email: z.string().trim().email("Email is invalid."),
});

const updateUserSchema = z.object({
  names: z.string().trim().min(3, "Name must be at least 3 characters."),
  email: z.string().trim().email("Email is invalid."),
});

const phoneSchema = z.object({
  number: z
    .string()
    .trim()
    .regex(/^\d{8,}$/, "Phone number must contain at least 8 digits."),
});

function getValidationMessage(error: z.ZodError) {
  return error.issues[0]?.message || "Invalid data.";
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [phones, setPhones] = useState<Phone[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const selectedUser = users.find((user) => user.id === selectedUserId);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [editUser, setEditUser] = useState<User | null>(null);
  const [editNames, setEditNames] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhones, setEditPhones] = useState<Phone[]>([]);

  const [createUsername, setCreateUsername] = useState("");
  const [createNames, setCreateNames] = useState("");
  const [createEmail, setCreateEmail] = useState("");

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
    setIsCreateModalOpen(true);
  }

  async function handleCreateUser() {
    const validation = createUserSchema.safeParse({
      username: createUsername,
      names: createNames,
      email: createEmail,
    });

    if (!validation.success) {
      alert(getValidationMessage(validation.error));
      return;
    }

    try {
      await sdk.users.create(validation.data);

      const refreshedUsers = await sdk.users.getAll();
      setUsers(refreshedUsers);
      setIsCreateModalOpen(false);
    } catch (err) {
      console.error("CREATE USER FAILED:", err);
      alert("Create user failed!");
    }
  }

  async function handleDeleteUser(user: User) {
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

    const validation = updateUserSchema.safeParse({
      names: editNames,
      email: editEmail,
    });

    if (!validation.success) {
      alert(getValidationMessage(validation.error));
      return;
    }

    const activePhones = editPhones.filter((phone) => phone.number.trim());
    const usedNumbers = new Set<string>();
    const allExistingPhones = users.flatMap((user) => user.phones || []);

    for (const phone of activePhones) {
      const phoneValidation = phoneSchema.safeParse({
        number: phone.number,
      });

      if (!phoneValidation.success) {
        alert(getValidationMessage(phoneValidation.error));
        return;
      }

      const number = phoneValidation.data.number;
      if (usedNumbers.has(number)) {
        alert("This phone number is already added in the form.");
        return;
      }

      const duplicatePhone = allExistingPhones.find(
        (existingPhone) =>
          existingPhone.number === number && existingPhone.id !== phone.id
      );

      if (duplicatePhone) {
        alert("This phone number already exists.");
        return;
      }

      usedNumbers.add(number);
    }

    try {
      await sdk.users.update(editUser.id, validation.data);

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
          const phoneValidation = phoneSchema.parse({
            number: p.number,
          });

          await sdk.phones.edit(p.id, {
            user_id: editUser.id,
            number: phoneValidation.number,
          });
        } else {
          const phoneValidation = phoneSchema.parse({
            number: p.number,
          });

          await sdk.phones.create({
            user_id: editUser.id,
            number: phoneValidation.number,
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

          <Button
            onClick={openCreateModal}
            className="bg-green-600 hover:bg-green-700"
          >
            Create User
          </Button>
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
                <td className="p-2">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditModal(u);
                      }}
                      className="bg-blue-500 hover:bg-blue-600"
                    >
                      Edit
                    </Button>

                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteUser(u);
                      }}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PHONES */}
      <div className="flex-1 bg-white rounded-xl shadow p-4">
        <h2 className="text-xl font-bold mb-1">Phones</h2>
        {selectedUser && (
          <p className="text-sm text-gray-600 mb-4">{selectedUser.names}</p>
        )}

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

            <Label className="mb-1 block">Name</Label>
            <Input
              className="mb-2"
              value={editNames}
              onChange={(e) => setEditNames(e.target.value)}
              placeholder="Name"
            />

            <Label className="mb-1 block">Email</Label>
            <Input
              className="mb-2"
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
              placeholder="Email"
            />

            <hr className="my-3" />

            <h3 className="font-semibold mb-2">Phones</h3>

            {editPhones.map((p, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <Input
                  className="flex-1"
                  value={p.number}
                  onChange={(e) => updatePhoneValue(i, e.target.value)}
                />

                <Button
                  onClick={() => removePhone(i)}
                  className="bg-red-500 hover:bg-red-600"
                >
                  ✕
                </Button>
              </div>
            ))}

            <Button
              onClick={addPhoneField}
              variant="outline"
              className="w-full mb-3"
            >
              + Add phone
            </Button>

            <div className="flex gap-2">
              <Button
                onClick={handleSave}
                className="flex-1 bg-green-500 hover:bg-green-600"
              >
                Save
              </Button>

              <Button
                onClick={() => setIsModalOpen(false)}
                variant="outline"
                className="flex-1"
              >
                Close
              </Button>
            </div>

          </div>
        </div>
      )}

      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white w-[420px] rounded-xl p-5">

            <h2 className="text-xl font-bold mb-3">Create User</h2>

            <Label className="mb-1 block">Username</Label>
            <Input
              className="mb-2"
              value={createUsername}
              onChange={(e) => setCreateUsername(e.target.value)}
              placeholder="Username"
            />

            <Label className="mb-1 block">Full name</Label>
            <Input
              className="mb-2"
              value={createNames}
              onChange={(e) => setCreateNames(e.target.value)}
              placeholder="Full name"
            />

            <Label className="mb-1 block">Email</Label>
            <Input
              className="mb-2"
              value={createEmail}
              onChange={(e) => setCreateEmail(e.target.value)}
              placeholder="Email"
            />

            <div className="flex gap-2">
              <Button
                onClick={handleCreateUser}
                className="flex-1 bg-green-500 hover:bg-green-600"
              >
                Create
              </Button>

              <Button
                onClick={() => setIsCreateModalOpen(false)}
                variant="outline"
                className="flex-1"
              >
                Close
              </Button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
