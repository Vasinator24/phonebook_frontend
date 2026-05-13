export type User = {
  id: number;
  username: string;
  email: string;
  names: string;
};

export type Phone = {
  id: number;
  user_id: number;
  number: string;
};
