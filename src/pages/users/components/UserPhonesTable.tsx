import type { Phone, User } from "../../../types";

type UserPhonesTableProps = {
  phones: Phone[];
  selectedUser?: User;
  selectedUserId: number | null;
};

export function UserPhonesTable({
  phones,
  selectedUser,
  selectedUserId,
}: UserPhonesTableProps) {
  return (
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
            {phones.map((phone) => (
              <tr key={phone.id} className="border-t">
                <td className="p-2">{phone.number}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
