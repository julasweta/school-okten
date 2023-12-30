import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ITokenPayload } from '../../common/interfaces/ITOkenPayload';
import { extractTokenFromHeader } from '../../common/utils/extract-token';

@Injectable()
export class VerificationService {
  constructor(private readonly jwtService: JwtService) {}

  async decodeToken(token: string): Promise<ITokenPayload> {
    try {
      const extractToken = extractTokenFromHeader(token);
      return this.jwtService.decode(extractToken);
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

  async createToken(payload: ITokenPayload): Promise<string> {
    const token = this.signToken(payload);

    return token;
  }

  async verifyToken(refreshToken: string): Promise<ITokenPayload> {
    try {
      return await this.jwtService.verify(refreshToken);
    } catch (err) {
      throw new BadRequestException(' error decoder ');
    }
  }
}
