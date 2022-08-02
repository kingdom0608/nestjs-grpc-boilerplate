import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export function generateTypeormModuleOptions(): TypeOrmModuleOptions {
  return {
    type: 'mysql',
    host: process.env.MYSQL_HOST,
    port: 3306,
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    timezone: '+09:00',
    synchronize: false,
    keepConnectionAlive: true,
    autoLoadEntities: true,
    logging: process.env.STAGE === 'local',
  };
}
