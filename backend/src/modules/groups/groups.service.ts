// groups.service.ts
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Group } from './schema/group.schema';
import { Model } from 'mongoose';
import { GroupBaseDto } from './dto/group-base.dto';

@Injectable()
export class GroupsService {
  constructor(@InjectModel(Group.name) private groupModel: Model<Group>) {}

  async createGroup(body: GroupBaseDto) {
    const isGroup = await this.groupModel.findOne({ title: body.title });
    if (isGroup) {
      throw new HttpException('This group allready is', HttpStatus.BAD_REQUEST);
    }
    return await this.groupModel.create({ title: body.title });
  }

  async findGroups() {
    return await this.groupModel.find().exec();
  }

  async findNameGroup(groupName: string) {
    const res = await this.groupModel.findOne({ title: groupName });
    return res;
  }

  async removeGroup(id: string) {
    return await this.groupModel.findByIdAndDelete(id);
  }
}
