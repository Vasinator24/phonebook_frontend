import axios from "axios";

class Client {
  private client;

  constructor(baseUrl: string) {
    this.client = axios.create({
      baseURL: baseUrl,
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (
          error.response?.status === 401 &&
          window.location.pathname !== "/login"
        ) {
          window.location.replace("/login");
        }

        return Promise.reject(error);
      }
    );
  }

  getClient() {
    return this.client;
  }
}

export default Client;
