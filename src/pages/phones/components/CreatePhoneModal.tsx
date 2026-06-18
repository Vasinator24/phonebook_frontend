import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { User } from "../../../types";

type CreatePhoneModalProps = {
  onClose: () => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  users: User[];
};

export function CreatePhoneModal({
  onClose,
  onSubmit,
  users,
}: CreatePhoneModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <form onSubmit={onSubmit} className="bg-white w-[420px] rounded-xl p-5">
        <h2 className="text-xl font-bold mb-3">Add Phone</h2>

        <Label className="mb-1 block">Phone number</Label>
        <Input name="number" className="mb-2" placeholder="Phone number" />

        <Label className="mb-1 block">User</Label>
        <select
          name="user_id"
          className="w-full p-2 border rounded mb-3"
          defaultValue={users[0]?.id ? String(users[0].id) : ""}
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
            className="flex-1 bg-green-500 hover:bg-green-600"
          >
            Create
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
