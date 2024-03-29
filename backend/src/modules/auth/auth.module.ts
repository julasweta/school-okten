import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { CustomConfigService } from '../../config/config.service';
import { VerificationModule } from '../verification/verification.module';
import { VerificationService } from '../verification/verification.service';
import { CustomConfigModule } from '../../config/config.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../users/schema/user.schema';
import { UsersModule } from '../users/users.module';
import { BearerStrategy } from './dto/bearer.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule } from '@webeleon/nestjs-redis';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    CustomConfigModule,
    ConfigModule,
    PassportModule.register({
      defaultStrategy: 'bearer',
      property: 'user',
    }),
    RedisModule.forRoot({
      url: 'redis://redis:6379',
    }),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: 'secret',
        signOptions: {
          expiresIn: '24h',
        },
      }),
    }),
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          auth: {
            user: 'stugarka@gmail.com',
            pass: 'oueq hezr ohjk rsin',
          },
        },
        defaults: {
          from: '"nest-modules" <modules@nestjs.com>',
        },
        template: {
          dir: process.cwd() + '/templates/',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
    UsersModule,
    VerificationModule,
  ],
  controllers: [AuthController],
  providers: [
    CustomConfigService,
    ConfigService,
    AuthService,
    VerificationService,
    BearerStrategy,
  ],
  exports: [PassportModule, AuthService, VerificationService],
})
export class AuthModule {}
