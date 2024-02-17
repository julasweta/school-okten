import { Types } from 'mongoose';
import { StatusUser } from '../../users/interfaces/users.types';
import { CreateOrderDto } from './create-order.dto';

export interface UserPartial {
  email: string;
  name: string;
  role: string;
  status: StatusUser;
  _id?: string | number | Types.ObjectId;
}

export class OrderResponseMapper {
  static toResOrderMapper(
    data: Partial<CreateOrderDto>,
  ): Partial<CreateOrderDto> {
    const userPartial: UserPartial = {
      email: data.user?.email,
      name: data.user?.name,
      role: data.user?.role,
      status: data.user?.status,
      _id: data.user?._id,
    };

    return {
      ...data,
      name: data.name,
      user: userPartial,
      surname: data.surname,
      email: data.email,
      phone: data.phone,
      age: data.age,
      course: data.course,
      course_format: data.course_format,
      course_type: data.course_type,
      status: data.status,
      sum: data.sum,
      _id: data._id,
      already_paid: data.already_paid,
      created_at: data.created_at,
      groupName: data.groupName,
    };
  }
}
