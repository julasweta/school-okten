import { IUser } from "./IUser";

export interface Order {
  _id: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  age: number;
  course: string;
  course_format: string;
  course_type: string;
  status: string;
  sum: number;
  alreadyPaid: boolean;
  created_at: string;
  user: IUser;
  groupName: string;
}
