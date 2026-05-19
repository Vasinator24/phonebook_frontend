import { useEffect, useState } from "react";
import sdk from "../../sdk";

export default function PhonesPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [phones, setPhones] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [newPhone, setNewPhone] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  const currentUser = users[currentIndex];

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (currentUser?.id) {
      loadPhones(currentUser.id);
    }
  }, [currentUser]);

  async function loadUsers() {
    const data = await sdk.users.getAll();
    setUsers(data);
  }

  async function loadPhones(userId: number) {
    const data = await sdk.phones.getByUser(userId);
    setPhones(data);
  }

  async function addPhone() {
    if (!currentUser || !newPhone.trim()) return;

    await sdk.phones.create({
      number: newPhone.trim(),
    });

    setNewPhone("");
    loadPhones(currentUser.id);
  }

  async function removePhone(id: number) {
    await sdk.phones.delete(id);
    loadPhones(currentUser.id);
  }

  async function editPhone(id: number) {
    if (!editValue.trim()) return;

    await sdk.phones.edit(id, {
      number: editValue.trim(),
    });

    setEditingId(null);
    setEditValue("");
    loadPhones(currentUser.id);
  }

  function nextUser() {
    setCurrentIndex((i) => Math.min(i + 1, users.length - 1));
  }

  function prevUser() {
    setCurrentIndex((i) => Math.max(i - 1, 0));
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Phones</h2>

      {currentUser && (
        <div style={{ marginBottom: 20 }}>
          <h3>{currentUser.names}</h3>

          <button onClick={prevUser}>Prev</button>
          <button onClick={nextUser} style={{ marginLeft: 10 }}>
            Next
          </button>
        </div>
      )}

      <div style={{ marginBottom: 20 }}>
        <input
          placeholder="Phone number"
          value={newPhone}
          onChange={(e) => setNewPhone(e.target.value)}
        />

        <button onClick={addPhone} style={{ marginLeft: 10 }}>
          Add
        </button>
      </div>

      {phones.map((p) => (
        <div
          key={p.id}
          style={{ border: "1px solid gray", padding: 10, marginBottom: 10 }}
        >
          {editingId === p.id ? (
            <>
              <input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
              />

              <button onClick={() => editPhone(p.id)}>Save</button>
              <button onClick={() => setEditingId(null)}>Cancel</button>
            </>
          ) : (
            <>
              <div>{p.number}</div>

              <button
                onClick={() => {
                  setEditingId(p.id);
                  setEditValue(p.number);
                }}
              >
                Edit
              </button>

              <button onClick={() => removePhone(p.id)}>
                Delete
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}