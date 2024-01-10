export interface IPaginationResponse<T> {
  page: number;
  limit: number;
  itemsFound: number;
  data: T[];
}

export interface ActivateUser {
  password: string;
}
