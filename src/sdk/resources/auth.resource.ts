import type { AxiosInstance } from "axios";

export default class AuthResource {
  constructor(private client: AxiosInstance) {}

  async login(email: string, password: string) {
    const res = await this.client.post("/login", {
      email,
      password,
    });

    return res.data;
  }
}