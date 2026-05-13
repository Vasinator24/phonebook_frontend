import type { AxiosInstance } from "axios";
import axios from "axios";

class Client {
  private client: AxiosInstance;

  constructor(baseUrl: string) {
    this.client = axios.create({
      baseURL: baseUrl,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  getClient(): AxiosInstance {
    return this.client;
  }
}

export default Client;
