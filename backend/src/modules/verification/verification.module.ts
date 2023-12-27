import { Module } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: 'secret',
        signOptions: {
          expiresIn: '24h',
        },
      }),
    }),
  ],
  controllers: [],
  providers: [VerificationService],
  exports: [VerificationService],
})
export class VerificationModule {}
