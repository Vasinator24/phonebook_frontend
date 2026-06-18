import Client from "./client";
import UsersResource from "./resources/users.resource";
import PhonesResource from "./resources/phones.resource";

const apiHost = import.meta.env.VITE_API_HOST || "http://localhost";
const apiPort = import.meta.env.VITE_API_PORT || "8080";
const apiUrl = `${apiHost}:${apiPort}`;

const client = new Client(apiUrl).getClient();

const sdk = {
  users: new UsersResource(client),
  phones: new PhonesResource(client),
};

export default sdk;
