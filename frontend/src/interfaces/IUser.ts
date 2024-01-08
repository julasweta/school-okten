export interface IUser {
  _id: string;
  login?: string;
  name?: string;
  surname: string;
  email: string;
  phone: string;
  age: number;
  course: string;
  course_type: string;
  course_format: string;
  sum: number | null;
  already_paid: boolean | null;
  utm: string;
  msg: string | null;
  status: string;
  userId: string;
  created_at: string;
  groupName: string;
}

