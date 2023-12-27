import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CustomConfigService {
  constructor(private readonly configs: ConfigService) {}

  get app_port(): string {
    return this.configs.get<string>('APP_PORT');
  }
  get app_host(): string {
    return this.configs.get<string>('APP_HOST');
  }

  get db_host(): string {
    return this.configs.get<string>('APP_MONGOOSE_HOST');
  }
}
