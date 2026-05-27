import type { AxiosInstance } from "axios";

export default class UsersResource {
  constructor(private client: AxiosInstance) {}

  async getAll() {
    const res = await this.client.get("/users");
    return res.data;
  }

  async create(data: {
    username?: string;
    names: string;
    email: string;
    password: string;
  }) {
    const res = await this.client.post("/users/create", data);
    return res.data;
  }

  async createByAdmin(data: {
    username: string;
    names: string;
    email: string;
    password: string;
    role: string;
  }) {
    const res = await this.client.post("/users/admin-create", data);
    return res.data;
  }
  
  async delete(id: number) {
    const res = await this.client.delete(`/users/delete?id=${id}`);
    return res.data;
  }

  async update(id: number, data: { names: string; email: string}) {
  const res = await this.client.put(`/users/update?id=${id}`, data);
  return res.data;
}
}
