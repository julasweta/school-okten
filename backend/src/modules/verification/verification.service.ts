import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ITokenPayload } from '../../common/interfaces/ITOkenPayload';
import { extractTokenFromHeader } from '../../common/utils/extract-token';

@Injectable()
export class VerificationService {
  constructor(private readonly jwtService: JwtService) {}

  async decodeToken(token: string): Promise<ITokenPayload> {
    console.log('verif service token', token);
    const bearerRegex = token.includes('Bearer');
    console.log(bearerRegex);

    //console.log('startsWithBearer', bearerRegex);
    if (bearerRegex) {
      const extractToken = extractTokenFromHeader(token);
      const decodedToken = this.jwtService.decode(extractToken);
      return decodedToken;
    }

    const decodedToken = this.jwtService.decode(token);
    // console.log('decodedToken', decodedToken);
    return decodedToken;
  }

  async signToken(payload: ITokenPayload, time: string): Promise<string> {
    try {
      return this.jwtService.sign(payload, { expiresIn: time });
    } catch (err) {
      throw new BadRequestException(' error decoder ');
    }
  }

  async createToken(payload: ITokenPayload, time: string): Promise<string> {
    //console.log('payload', payload);
    const token = this.signToken(payload, time);
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
