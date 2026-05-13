import { useState } from "react";
import type { Phone } from "../../types";

const Phones = () => {
  const [phones, setPhones] = useState<Phone[]>([]);

  // Invoke the API to fetch phones and set the state

  function handlePhoneCreate() {
    
  }

  return (
    <div>
      <div>
        <button onClick={handlePhoneCreate()}>Add Phone</button>
        <button
          onClick={() =>
            setPhones([{ id: 1, user_id: 1, number: "123-456-7890" }])
          }
        >
          Load Sample Phones
        </button>
      </div>
      <div>
        <h1>Phones</h1>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {phones.length === 0 ? (
              <tr>
                <td colSpan={2}>No phones found.</td>
              </tr>
            ) : (
              phones.map((phone, index) => (
                <tr key={(phone as any).id ?? index}>
                  <td>
                    {(phone as any).name ??
                      `${(phone as any).firstName ?? ""} ${(phone as any).lastName ?? ""}`.trim() ??
                      "-"}
                  </td>
                  <td>
                    {(phone as any).phoneNumber ?? (phone as any).number ?? "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Phones;
