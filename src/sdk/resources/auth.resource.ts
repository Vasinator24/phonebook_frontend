import type { AxiosInstance } from "axios";
import type { LoginData, User } from "../../types";

export default class AuthResource {
  constructor(private client: AxiosInstance) {}

  async login(data: LoginData): Promise<User> {
    const res = await this.client.post<User>("/login", data);
    return res.data;
  }

  async logout(): Promise<void> {
    await this.client.post("/logout");
  }

  async me(): Promise<User> {
    const res = await this.client.get<User>("/me");
    return res.data;
  }
}
