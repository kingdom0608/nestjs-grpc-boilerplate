import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export function generateTypeormModuleOptions(): TypeOrmModuleOptions {
  console.log(process.env);
  return {
    type: 'mysql',
    host: process.env.MYSQL_HOST,
    port: 3306,
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    autoLoadEntities: true,
    timezone: '+09:00',
    synchronize: false,
    keepConnectionAlive: true,
  };
}
