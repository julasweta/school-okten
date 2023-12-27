export interface ITokenPayload {
  email: string;
  type: 'access' | 'refresh';
  iat?: number;
}
