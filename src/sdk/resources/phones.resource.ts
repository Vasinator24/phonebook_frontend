import type { AxiosInstance } from "axios";
import type { Phone } from "../../types";

export default class PhonesResource {
  constructor(private client: AxiosInstance) {}

  async getByUser(user_id: number): Promise<Phone[]> {
    const res = await this.client.get(`/phones?user_id=${user_id}`);
    return res.data;
  }

  async create(data: Omit<Phone, "id">): Promise<Phone> {
    const res = await this.client.post("/phones/create", data);
    return res.data;
  }

  async delete(id: number): Promise<void> {
    const res = await this.client.delete(`/phones/delete?id=${id}`);
    return res.data;
  }

  async edit(
    id: number,
    data: Pick<Phone, "number" | "user_id">
  ): Promise<Phone> {
    const res = await this.client.put(`/phones/update?id=${id}`, data);
    return res.data;
  }
}
