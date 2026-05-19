import type { AxiosInstance } from "axios";

export default class PhonesResource {
  constructor(private client: AxiosInstance) {}

  async getByUser(user_id: number) {
    const res = await this.client.get(`/phones?user_id=${user_id}`);
    return res.data;
  }

  async create(data: { number: string }) {
    const res = await this.client.post("/phones/create", data);
    return res.data;
  }

  async delete(id: number) {
    const res = await this.client.delete(`/phones/delete?id=${id}`);
    return res.data;
  }

  async edit(id: number, data: { number: string }) {
    const res = await this.client.put(`/phones/update?id=${id}`, data);
    return res.data;
  }
}
