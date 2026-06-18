import type { AxiosInstance } from "axios";
import type { CreatePhone, Phone, UpdatePhone } from "../../types";

export default class PhonesResource {
  constructor(private client: AxiosInstance) {}

  async getByUser(user_id: number): Promise<Phone[]> {
    const res = await this.client.get<Phone[]>(`/phones?user_id=${user_id}`);
    return res.data;
  }

  async create(data: CreatePhone): Promise<Phone> {
    const res = await this.client.post<Phone>("/phones/create", data);
    return res.data;
  }

  async delete(id: number): Promise<void> {
    const res = await this.client.delete<void>(`/phones/delete?id=${id}`);
    return res.data;
  }

  async edit(
    id: number,
    data: UpdatePhone
  ): Promise<Phone> {
    const res = await this.client.put<Phone>(`/phones/update?id=${id}`, data);
    return res.data;
  }
}
