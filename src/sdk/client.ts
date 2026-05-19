import axios from "axios";

class Client {
  private client;

  constructor(baseUrl: string) {
    this.client = axios.create({
      baseURL: baseUrl,
      headers: { "Content-Type": "application/json" },
    });

    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  getClient() {
    return this.client;
  }
}

export default Client;