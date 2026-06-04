export type User = {
  id: number;
  username: string;
  email: string;
  names: string;
  phones?: Phone[];
};

export type Phone = {
  id?: number;
  user_id?: number;
  userID?: number;
  number: string;
};
