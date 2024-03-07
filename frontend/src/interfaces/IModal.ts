import * as yup from "yup";
export interface EditOrderModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
}

export interface EditOrderFormData {
  name?: string;
  surname?: string;
  email?: string;
  phone?: string;
  age?: number;
  course?: Course;
  course_format?: CourseFormat;
  course_type?: CourseType;
  status?: StatusWork;
  sum?: number;
  alreadyPaid?: boolean;
  created_at?: Date;
}

export enum StatusWork {
  InWork = "In work",
  New = "New",
  Aggre = "Aggre",
  Disaggre = "Disaggre",
  Dubbing = "Dubbing",
}

export enum Course {
  FS = "FS",
  QACX = "QACX",
  JCX = "JCX",
  JSCX = "JSCX",
  FE = "FE",
  PCX = "PCX",
}

export enum CourseType {
  PRO = "pro",
  MINIMAL = "minimal",
  PREMIUM = "premium",
  INCUBATOR = "incubator",
  VIP = "vip",
}

export enum CourseFormat {
  STATIC = "static",
  ONLINE = "online",
}
