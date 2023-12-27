export interface ITokenPayload {
  id: string;
  type: 'access' | 'refresh';
  iat?: number;
}
