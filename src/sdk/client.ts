import axios from "axios";

class Client {
  private client;

  constructor(baseUrl: string) {
    this.client = axios.create({
      baseURL: baseUrl,
      headers: { "Content-Type": "application/json" },
    });
  }

  getClient() {
    return this.client;
  }
}

export default Client;
