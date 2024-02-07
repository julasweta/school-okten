export const columns = [
  "_id",
  "name",
  "surname",
  "email",
  "phone",
  "age",
  "course",
  "course_format",
  "course_type",
  "status",
  "sum",
  "already_paid",
  "created_at",
  "groupName",
  "userId",
];

export interface ISearchColumns {
  name: string;
  surname: string;
  email: string;
  phone: string;
  age: string;
  course: string;
  course_format: string;
  course_type: string;
  status: string;
  groupName: string;
  isMe: string;
}

export const searchColumns: Array<keyof ISearchColumns> = [
  "name",
  "surname",
  "email",
  "phone",
  "age",
  "course",
  "course_format",
  "course_type",
  "status",
  "groupName",
  "isMe",
];
