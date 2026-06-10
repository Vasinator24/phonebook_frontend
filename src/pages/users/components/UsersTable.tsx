import { Button } from "@/components/ui/button";
import type { User } from "../../../types";

type UsersTableProps = {
  selectedUserId: number | null;
  users: User[];
  onCreateUser: () => void;
  onDeleteUser: (user: User) => void;
  onEditUser: (user: User) => void;
  onSelectUser: (userId: number) => void;
};

export function UsersTable({
  selectedUserId,
  users,
  onCreateUser,
  onDeleteUser,
  onEditUser,
  onSelectUser,
}: UsersTableProps) {
  return (
    <div className="flex-1 bg-white rounded-xl shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Users</h2>

        <Button
          onClick={onCreateUser}
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
          {users.map((user) => {
            const isSelected = user.id === selectedUserId;

            return (
              <tr
                key={user.id}
                onClick={() => onSelectUser(user.id)}
                className={`border-t cursor-pointer ${
                  isSelected ? "bg-gray-300 hover:bg-gray-300" : "hover:bg-gray-50"
                }`}
              >
                <td className="p-2">{user.names}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditUser(user);
                      }}
                      className="bg-blue-500 hover:bg-blue-600"
                    >
                      Edit
                    </Button>

                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteUser(user);
                      }}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
