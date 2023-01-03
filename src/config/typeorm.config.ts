import type { ConfigService } from '@nestjs/config';
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const getTypeOrmConfig = async (
  configService: ConfigService,
): Promise<TypeOrmModuleOptions> => ({
  type: 'postgres',
  host: 'localhost',
  port: configService.get('PORT_DB'),
  database: configService.get('DATABASE'),
  username: configService.get('USERNAME_DB'),
  password: configService.get('PASSWORD_DB'),
  autoLoadEntities: true,
  synchronize: true,
});
