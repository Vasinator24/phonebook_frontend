import Client from "./client";
import AuthResource from "./resources/auth.resource";
import UsersResource from "./resources/users.resource";
import PhonesResource from "./resources/phones.resource";

const client = new Client("http://localhost:8080").getClient();

const sdk = {
  auth: new AuthResource(client),
  users: new UsersResource(client),
  phones: new PhonesResource(client),
};

export default sdk;