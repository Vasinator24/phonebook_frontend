import { Button } from "@/components/ui/button";
import type { Phone } from "../../../types";

export type PhoneRow = Phone & { userName: string };

type PhonesTableProps = {
  phones: PhoneRow[];
  onAddPhone: () => void;
  onDeletePhone: (phone: PhoneRow) => void;
  onEditPhone: (phone: PhoneRow) => void;
};

export function PhonesTable({
  phones,
  onAddPhone,
  onDeletePhone,
  onEditPhone,
}: PhonesTableProps) {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Phones</h2>

        <Button
          onClick={onAddPhone}
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
                    onClick={() => onEditPhone(phone)}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    Edit
                  </Button>

                  <Button
                    size="sm"
                    onClick={() => onDeletePhone(phone)}
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
  );
}
