import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FormHandler, User } from "../../../types";
import type { PhoneRow } from "./PhonesTable";

type EditPhoneModalProps = {
  editPhone: PhoneRow | null;
  isEditDirty: boolean;
  onChange: FormHandler;
  onClose: () => void;
  onSubmit: FormHandler;
  users: User[];
};

export function EditPhoneModal({
  editPhone,
  isEditDirty,
  onChange,
  onClose,
  onSubmit,
  users,
}: EditPhoneModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <form
        onSubmit={onSubmit}
        onChange={onChange}
        className="bg-white w-[420px] rounded-xl p-5"
      >
        <h2 className="text-xl font-bold mb-3">Edit Phone</h2>

        <Label className="mb-1 block">Phone number</Label>
        <Input
          name="number"
          className="mb-2"
          defaultValue={editPhone?.number}
          placeholder="Phone number"
        />

        <Label className="mb-1 block">User</Label>
        <select
          name="user_id"
          className="w-full p-2 border rounded mb-3"
          defaultValue={String(editPhone?.user_id ?? editPhone?.userID ?? "")}
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
            type="submit"
            disabled={!isEditDirty}
            className="flex-1 bg-green-500 hover:bg-green-600"
          >
            Save
          </Button>

          <Button
            type="button"
            onClick={onClose}
            variant="outline"
            className="flex-1"
          >
            Close
          </Button>
        </div>
      </form>
    </div>
  );
}
