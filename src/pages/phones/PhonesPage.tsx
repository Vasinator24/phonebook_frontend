import { useEffect, useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import sdk from "../../sdk";
import type { Phone, User } from "../../types";

const phoneSchema = z.object({
  number: z
    .string()
    .trim()
    .regex(/^\d{8,}$/, "Phone number must contain at least 8 digits."),
});

const createPhoneSchema = phoneSchema.extend({
  user_id: z
    .string()
    .min(1, "Please select a user.")
    .transform((value) => Number(value))
    .refine((value) => value > 0, "Please select a user."),
});

const updatePhoneSchema = createPhoneSchema;

function getValidationMessage(error: z.ZodError) {
  return error.issues[0]?.message || "Invalid data.";
}

function phoneExists(
  phones: Array<Phone & { userName: string }>,
  number: string,
  currentPhoneId?: number
) {
  return phones.some(
    (phone) => phone.number === number && phone.id !== currentPhoneId
  );
}

export default function PhonesPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [phones, setPhones] = useState<Array<Phone & { userName: string }>>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editPhone, setEditPhone] = useState<(Phone & { userName: string }) | null>(null);
  const [editNumber, setEditNumber] = useState("");
  const [editUserId, setEditUserId] = useState("");
  const [createNumber, setCreateNumber] = useState("");
  const [createUserId, setCreateUserId] = useState("");

  async function loadPhones() {
    const users: User[] = await sdk.users.getAll();
    setUsers(users);

    const rows = users.flatMap((user) =>
      (user.phones || []).map((phone) => ({
        id: phone.id,
        number: phone.number,
        user_id: phone.user_id ?? phone.userID ?? user.id,
        userID: phone.userID,
        userName: user.names,
      }))
    );

    setPhones(rows);
  }

  useEffect(() => {
    sdk.users.getAll().then((users: User[]) => {
      setUsers(users);

      const rows = users.flatMap((user) =>
        (user.phones || []).map((phone) => ({
          id: phone.id,
          number: phone.number,
          user_id: phone.user_id ?? phone.userID ?? user.id,
          userID: phone.userID,
          userName: user.names,
        }))
      );

      setPhones(rows);
    });
  }, []);

  function openEditModal(phone: Phone & { userName: string }) {
    setEditPhone(phone);
    setEditNumber(phone.number);
    setEditUserId(String(phone.user_id ?? phone.userID ?? ""));
    setIsModalOpen(true);
  }

  function openCreateModal() {
    setCreateNumber("");
    setCreateUserId(users[0]?.id ? String(users[0].id) : "");
    setIsCreateModalOpen(true);
  }

  async function handleCreate() {
    const validation = createPhoneSchema.safeParse({
      number: createNumber,
      user_id: createUserId,
    });

    if (!validation.success) {
      alert(getValidationMessage(validation.error));
      return;
    }

    if (phoneExists(phones, validation.data.number)) {
      alert("This phone number already exists.");
      return;
    }

    try {
      await sdk.phones.create(validation.data);

      await loadPhones();
      setIsCreateModalOpen(false);
    } catch (err) {
      console.error("CREATE PHONE FAILED:", err);
      alert("Create phone failed!");
    }
  }

  async function handleSave() {
    if (!editPhone) return;
    if (!editPhone.id) return;

    const validation = updatePhoneSchema.safeParse({
      number: editNumber,
      user_id: editUserId,
    });

    if (!validation.success) {
      alert(getValidationMessage(validation.error));
      return;
    }

    if (phoneExists(phones, validation.data.number, editPhone.id)) {
      alert("This phone number already exists.");
      return;
    }

    try {
      await sdk.phones.edit(editPhone.id, validation.data);
      await loadPhones();
      setIsModalOpen(false);
    } catch (err) {
      console.error("UPDATE PHONE FAILED:", err);
      alert("Update phone failed!");
    }
  }

  async function handleDelete(phone: Phone & { userName: string }) {
    if (!phone.id) return;

    const confirmed = window.confirm(`Delete ${phone.number}?`);
    if (!confirmed) return;

    try {
      await sdk.phones.delete(phone.id);
      await loadPhones();
    } catch (err) {
      console.error("DELETE PHONE FAILED:", err);
      alert("Delete phone failed!");
    }
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-xl shadow p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Phones</h2>

          <Button
            onClick={openCreateModal}
            className="bg-green-600 hover:bg-green-700"
          >
            Add Phone
          </Button>
        </div>

        <table className="w-full border rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 text-left">Phone</th>
              <th className="p-2 text-left">User</th>
              <th className="p-2 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {phones.map((phone) => (
              <tr key={phone.id} className="border-t">
                <td className="p-2">{phone.number}</td>
                <td className="p-2">{phone.userName}</td>
                <td className="p-2">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      onClick={() => openEditModal(phone)}
                      className="bg-blue-500 hover:bg-blue-600"
                    >
                      Edit
                    </Button>

                    <Button
                      size="sm"
                      onClick={() => handleDelete(phone)}
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

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white w-[420px] rounded-xl p-5">
            <h2 className="text-xl font-bold mb-3">Edit Phone</h2>

            <Label className="mb-1 block">Phone number</Label>
            <Input
              className="mb-2"
              value={editNumber}
              onChange={(e) => setEditNumber(e.target.value)}
              placeholder="Phone number"
            />

            <Label className="mb-1 block">User</Label>
            <select
              className="w-full p-2 border rounded mb-3"
              value={editUserId}
              onChange={(e) => setEditUserId(e.target.value)}
            >
              <option value="">Select user</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.names}
                </option>
              ))}
            </select>

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
            <h2 className="text-xl font-bold mb-3">Add Phone</h2>

            <Label className="mb-1 block">Phone number</Label>
            <Input
              className="mb-2"
              value={createNumber}
              onChange={(e) => setCreateNumber(e.target.value)}
              placeholder="Phone number"
            />

            <Label className="mb-1 block">User</Label>
            <select
              className="w-full p-2 border rounded mb-3"
              value={createUserId}
              onChange={(e) => setCreateUserId(e.target.value)}
            >
              <option value="">Select user</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.names}
                </option>
              ))}
            </select>

            <div className="flex gap-2">
              <Button
                onClick={handleCreate}
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
