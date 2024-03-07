import { Course, CourseFormat, CourseType, StatusWork } from "./IModal";
import { IUser } from "./IUser";

export interface Order {
  _id: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  age: number;
  course: Course;
  course_format: CourseFormat;
  course_type: CourseType;
  status: StatusWork;
  sum: number;
  already_paid: boolean;
  created_at: Date;
  user: IUser;
  groupName: string;
}
