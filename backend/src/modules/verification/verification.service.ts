import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ITokenPayload } from '../../common/interfaces/ITOkenPayload';

@Injectable()
export class VerificationService {
  constructor(private readonly jwtService: JwtService) {}

  async decodeToken(token: string): Promise<ITokenPayload> {
    try {
      return this.jwtService.decode(token);
    } catch (err) {
      throw new BadRequestException(' error decoder ');
    }
  }

  async signToken(payload: ITokenPayload): Promise<any> {
    try {
      return this.jwtService.sign(payload);
    } catch (err) {
      throw new BadRequestException(' error decoder ');
    }
  }

  async verifyToken(refreshToken: string): Promise<ITokenPayload> {
    try {
      return await this.jwtService.verify(refreshToken);
    } catch (err) {
      throw new BadRequestException(' error decoder ');
    }
  }
}
