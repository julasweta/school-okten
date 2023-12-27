import { ConfigService, registerAs } from '@nestjs/config';

const configService = new ConfigService();
const token = 'allConfigs';

export default registerAs(token, () => ({
  app_port: configService.get<number>('APP_PORT'),
  app_host: configService.get<string>('APP_HOST'),

  db_host: configService.get<string>('APP_MONGOOSE_HOST'),
}));
