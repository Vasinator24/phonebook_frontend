import type { AxiosInstance } from "axios";

export default class UsersResource {
  constructor(private client: AxiosInstance) {}

  async getAll() {
    const res = await this.client.get("/users");
    return res.data;
  }

   async create(data: {
    names: string;
    email: string;
    password: string;
  }) {
    const res = await this.client.post("/users/create", data);
    return res.data;
  }
  
  async delete(id: number) {
    const res = await this.client.delete(`/users?id=${id}`);
    return res.data;
  }
}