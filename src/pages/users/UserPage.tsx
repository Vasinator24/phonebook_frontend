import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import sdk from "../../sdk";
import {
  createUserSchema,
  getValidationMessage,
  phoneSchema,
  updateUserSchema,
  type Phone,
  type User,
} from "../../types";
import { CreateUserModal } from "./components/CreateUserModal";
import { EditUserModal } from "./components/EditUserModal";
import { UserPhonesTable } from "./components/UserPhonesTable";
import { UsersTable } from "./components/UsersTable";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [phones, setPhones] = useState<Phone[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const selectedUser = users.find((user) => user.id === selectedUserId);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [editUser, setEditUser] = useState<User | null>(null);
  const [editPhones, setEditPhones] = useState<Phone[]>([]);
  const [originalEditPhones, setOriginalEditPhones] = useState<Phone[]>([]);
  const [isEditDirty, setIsEditDirty] = useState(false);
  const editFormRef = useRef<HTMLFormElement | null>(null);

  const isDirty = useCallback(
    (form: HTMLFormElement) => {
      if (!editUser) return false;

      const formData = new FormData(form);
      const names = String(formData.get("names") || "").trim();
      const email = String(formData.get("email") || "").trim();
      const userChanged = names !== editUser.names || email !== editUser.email;

      const formPhones = editPhones.map((phone, index) => ({
        ...phone,
        number: String(formData.get(`phone-${index}`) || "").trim(),
      }));

      const hasDeletedPhone = originalEditPhones.some(
        (oldPhone) =>
          oldPhone.id && !formPhones.some((phone) => phone.id === oldPhone.id)
      );

      const hasChangedPhone = formPhones.some((phone) => {
        if (!phone.id) {
          return String(phone.number).length > 0;
        }

        const originalPhone = originalEditPhones.find(
          (oldPhone) => oldPhone.id === phone.id
        );

        return originalPhone?.number !== phone.number;
      });

      return userChanged || hasDeletedPhone || hasChangedPhone;
    },
    [editPhones, editUser, originalEditPhones]
  );

  useEffect(() => {
    if (isModalOpen && editFormRef.current) {
      setIsEditDirty(isDirty(editFormRef.current));
    }
  }, [editPhones, isDirty, isModalOpen]);

  useEffect(() => {
    (async () => {
      const data = await sdk.users.getAll();
      setUsers(data);
    })();
  }, []);

  async function handleSelectUser(userId: number) {
    setSelectedUserId(userId);
    const data = await sdk.phones.getByUser(userId);
    setPhones(data);
  }

  async function openEditModal(user: User) {
    setEditUser(user);

    const data = await sdk.phones.getByUser(user.id);
    setEditPhones(data);
    setOriginalEditPhones(data);
    setIsEditDirty(false);

    setIsModalOpen(true);
  }

  function addPhoneField() {
    setEditPhones((prev) => [...prev, { number: "" }]);
  }

  function removePhone(index: number) {
    setEditPhones((prev) => prev.filter((_, i) => i !== index));
  }

  function handleEditFormChange(e: FormEvent<HTMLFormElement>) {
    setIsEditDirty(isDirty(e.currentTarget));
  }

  function openCreateModal() {
    setIsCreateModalOpen(true);
  }

  async function handleCreateUser(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const validation = createUserSchema.safeParse({
      username: formData.get("username"),
      names: formData.get("names"),
      email: formData.get("email"),
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

  async function handleSave(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editUser) return;
    const formData = new FormData(e.currentTarget);

    const validation = updateUserSchema.safeParse({
      names: formData.get("names"),
      email: formData.get("email"),
    });

    if (!validation.success) {
      alert(getValidationMessage(validation.error));
      return;
    }

    const formPhones = editPhones.map((phone, index) => ({
      ...phone,
      number: String(formData.get(`phone-${index}`) || ""),
    }));
    const phonesToValidate = formPhones.filter(
      (phone) => phone.id || String(phone.number).trim()
    );
    const validatedPhones: Phone[] = [];
    const usedNumbers = new Set<string>();
    const allExistingPhones = users.flatMap((user) => user.phones || []);

    for (const phone of phonesToValidate) {
      const phoneValidation = phoneSchema.safeParse({
        number: phone.number,
      });

      if (!phoneValidation.success) {
        alert(getValidationMessage(phoneValidation.error));
        return;
      }

      const number = phoneValidation.data.number;
      validatedPhones.push({ ...phone, number });

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
      const userChanged =
        validation.data.names !== editUser.names ||
        validation.data.email !== editUser.email;

      const deletedPhones = originalEditPhones.filter(
        (oldPhone) =>
          oldPhone.id && !formPhones.some((phone) => phone.id === oldPhone.id)
      );

      const changedPhones = validatedPhones.filter((phone) => {
        if (!phone.id) return false;

        const originalPhone = originalEditPhones.find(
          (oldPhone) => oldPhone.id === phone.id
        );

        return originalPhone?.number !== phone.number;
      });

      const newPhones = validatedPhones.filter((phone) => !phone.id);
      const hasPhoneChanges =
        deletedPhones.length > 0 ||
        changedPhones.length > 0 ||
        newPhones.length > 0;

      if (!userChanged && !hasPhoneChanges) {
        setIsModalOpen(false);
        return;
      }

      if (userChanged) {
        await sdk.users.update(editUser.id, validation.data);
      }

      for (const phone of deletedPhones) {
        if (phone.id) {
          await sdk.phones.delete(phone.id);
        }
      }

      for (const phone of changedPhones) {
        if (phone.id) {
          await sdk.phones.edit(phone.id, {
            user_id: editUser.id,
            number: phone.number,
          });
        }
      }

      for (const phone of newPhones) {
        await sdk.phones.create({
          user_id: editUser.id,
          number: phone.number,
        });
      }

      if (hasPhoneChanges && selectedUserId === editUser.id) {
        const refreshedPhones = await sdk.phones.getByUser(editUser.id);
        setPhones(refreshedPhones);
      }

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
      <UsersTable
        selectedUserId={selectedUserId}
        users={users}
        onCreateUser={openCreateModal}
        onDeleteUser={handleDeleteUser}
        onEditUser={openEditModal}
        onSelectUser={handleSelectUser}
      />

      <UserPhonesTable
        phones={phones}
        selectedUser={selectedUser}
        selectedUserId={selectedUserId}
      />

      {isModalOpen && (
        <EditUserModal
          editPhones={editPhones}
          editUser={editUser}
          formRef={editFormRef}
          isEditDirty={isEditDirty}
          onAddPhone={addPhoneField}
          onChange={handleEditFormChange}
          onClose={() => setIsModalOpen(false)}
          onRemovePhone={removePhone}
          onSubmit={handleSave}
        />
      )}

      {isCreateModalOpen && (
        <CreateUserModal
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateUser}
        />
      )}
    </div>
  );
}
