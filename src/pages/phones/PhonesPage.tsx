import { useCallback, useEffect, useState, type FormEvent } from "react";
import sdk from "../../sdk";
import {
  createPhoneSchema,
  getValidationMessage,
  updatePhoneSchema,
  type User,
} from "../../types";
import { CreatePhoneModal } from "./components/CreatePhoneModal";
import { EditPhoneModal } from "./components/EditPhoneModal";
import { PhonesTable, type PhoneRow } from "./components/PhonesTable";

function phoneExists(
  phones: PhoneRow[],
  number: string,
  currentPhoneId?: number
) {
  return phones.some(
    (phone) => phone.number === number && phone.id !== currentPhoneId
  );
}

function mapUsersToPhoneRows(users: User[]): PhoneRow[] {
  return users.flatMap((user) =>
    (user.phones || []).map((phone) => ({
      id: phone.id,
      number: phone.number,
      user_id: phone.user_id ?? phone.userID ?? user.id,
      userID: phone.userID,
      userName: user.names,
    }))
  );
}

export default function PhonesPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [phones, setPhones] = useState<PhoneRow[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editPhone, setEditPhone] = useState<PhoneRow | null>(null);
  const [isEditDirty, setIsEditDirty] = useState(false);

  const isDirty = useCallback(
    (form: HTMLFormElement) => {
      if (!editPhone) return false;

      const formData = new FormData(form);
      const number = String(formData.get("number") || "").trim();
      const userId = Number(formData.get("user_id"));
      const originalUserId = editPhone.user_id ?? editPhone.userID;

      return number !== editPhone.number || userId !== originalUserId;
    },
    [editPhone]
  );

  async function loadPhones() {
    const users = await sdk.users.getAll();
    setUsers(users);
    setPhones(mapUsersToPhoneRows(users));
  }

  useEffect(() => {
    sdk.users.getAll().then((users) => {
      setUsers(users);
      setPhones(mapUsersToPhoneRows(users));
    });
  }, []);

  function openEditModal(phone: PhoneRow) {
    setEditPhone(phone);
    setIsEditDirty(false);
    setIsModalOpen(true);
  }

  function openCreateModal() {
    setIsCreateModalOpen(true);
  }

  async function handleCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const validation = createPhoneSchema.safeParse({
      number: formData.get("number"),
      user_id: formData.get("user_id"),
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

  async function handleSave(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editPhone?.id) return;
    const formData = new FormData(e.currentTarget);

    const validation = updatePhoneSchema.safeParse({
      number: formData.get("number"),
      user_id: formData.get("user_id"),
    });

    if (!validation.success) {
      alert(getValidationMessage(validation.error));
      return;
    }

    if (phoneExists(phones, validation.data.number, editPhone.id)) {
      alert("This phone number already exists.");
      return;
    }

    const originalUserId = editPhone.user_id ?? editPhone.userID;
    const phoneChanged =
      validation.data.number !== editPhone.number ||
      validation.data.user_id !== originalUserId;

    if (!phoneChanged) {
      setIsModalOpen(false);
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

  function handleEditFormChange(e: FormEvent<HTMLFormElement>) {
    setIsEditDirty(isDirty(e.currentTarget));
  }

  async function handleDelete(phone: PhoneRow) {
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
      <PhonesTable
        phones={phones}
        onAddPhone={openCreateModal}
        onDeletePhone={handleDelete}
        onEditPhone={openEditModal}
      />

      {isModalOpen && (
        <EditPhoneModal
          editPhone={editPhone}
          isEditDirty={isEditDirty}
          onChange={handleEditFormChange}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSave}
          users={users}
        />
      )}

      {isCreateModalOpen && (
        <CreatePhoneModal
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreate}
          users={users}
        />
      )}
    </div>
  );
}
