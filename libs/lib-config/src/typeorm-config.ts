import { TypeOrmModuleOptions } from '@nestjs/typeorm';

/**
 * 환경변수 파일 파싱
 */
export function parsedEnvFile() {
  switch (process.env.NODE_ENV) {
    case 'prod':
      return 'env/prod.env';
    case 'dev':
      return 'env/dev.env';
    case 'local':
      return 'env/local.env';
    case 'test':
      return 'env/test.env';
    default:
      throw new Error('stage type is wrong');
  }
}

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
