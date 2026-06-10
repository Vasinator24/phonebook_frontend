import type { AxiosInstance } from "axios";
import type { CreateUser, UpdateUser, User } from "../../types";

export default class UsersResource {
  constructor(private client: AxiosInstance) {}

  async getAll(): Promise<User[]> {
    const res = await this.client.get<User[]>("/users");
    return res.data;
  }

  async create(data: CreateUser): Promise<User> {
    const res = await this.client.post<User>("/users/create", data);
    return res.data;
  }
  
  async delete(id: number): Promise<void> {
    const res = await this.client.delete<void>(`/users/delete?id=${id}`);
    return res.data;
  }

  async update(id: number, data: UpdateUser): Promise<User> {
    const res = await this.client.put<User>(`/users/update?id=${id}`, data);
    return res.data;
  }
}
