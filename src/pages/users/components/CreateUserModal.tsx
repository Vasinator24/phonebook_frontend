import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type CreateUserModalProps = {
  onClose: () => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
};

export function CreateUserModal({ onClose, onSubmit }: CreateUserModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <form onSubmit={onSubmit} className="bg-white w-[420px] rounded-xl p-5">
        <h2 className="text-xl font-bold mb-3">Create User</h2>

        <Label className="mb-1 block">Username</Label>
        <Input name="username" className="mb-2" placeholder="Username" />

        <Label className="mb-1 block">Full name</Label>
        <Input name="names" className="mb-2" placeholder="Full name" />

        <Label className="mb-1 block">Email</Label>
        <Input name="email" className="mb-2" placeholder="Email" />

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
