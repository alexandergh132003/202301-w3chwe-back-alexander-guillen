export interface UserCredentials {
  username: string;
  password: string;
}

export interface JwtPayload {
  username: string;
  id: string;
}
