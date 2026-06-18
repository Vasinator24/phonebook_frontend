import type { FormEvent, RefObject } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Phone, User } from "../../../types";

type EditUserModalProps = {
  editPhones: Phone[];
  editUser: User | null;
  formRef: RefObject<HTMLFormElement | null>;
  isEditDirty: boolean;
  onAddPhone: () => void;
  onChange: (e: FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
  onRemovePhone: (index: number) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
};

export function EditUserModal({
  editPhones,
  editUser,
  formRef,
  isEditDirty,
  onAddPhone,
  onChange,
  onClose,
  onRemovePhone,
  onSubmit,
}: EditUserModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <form
        ref={formRef}
        onSubmit={onSubmit}
        onChange={onChange}
        className="bg-white w-[420px] rounded-xl p-5"
      >
        <h2 className="text-xl font-bold mb-3">Edit User</h2>

        <Label className="mb-1 block">Name</Label>
        <Input
          name="names"
          className="mb-2"
          defaultValue={editUser?.names}
          placeholder="Name"
        />

        <Label className="mb-1 block">Email</Label>
        <Input
          name="email"
          className="mb-2"
          defaultValue={editUser?.email}
          placeholder="Email"
        />

        <hr className="my-3" />

        <h3 className="font-semibold mb-2">Phones</h3>

        {editPhones.map((phone, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <Input
              name={`phone-${index}`}
              className="flex-1"
              defaultValue={phone.number || ""}
            />

            <Button
              type="button"
              onClick={() => onRemovePhone(index)}
              className="bg-red-500 hover:bg-red-600"
            >
              x
            </Button>
          </div>
        ))}

        <Button
          type="button"
          onClick={onAddPhone}
          variant="outline"
          className="w-full mb-3"
        >
          + Add phone
        </Button>

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
