import type { ConfigService } from '@nestjs/config';
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const getTypeOrmConfig = async (
	configService: ConfigService,
): Promise<TypeOrmModuleOptions> => ({
	type: 'postgres',
	host: 'localhost',
	port: configService.get('PORT'),
	database: configService.get('rutube-2'),
	username: configService.get('USERNAME'),
	password: configService.get('PASSWORD'),
	autoLoadEntities: true,
	synchronize: true,
});
