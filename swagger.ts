import { INestApplication } from '@nestjs/common';
import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerCustomOptions,
} from '@nestjs/swagger';
import * as fs from 'fs';

export type TDomain = 'product' | 'user';

export function setupSwagger(app: INestApplication, domain: TDomain) {
  const file = './package.json';
  const packageJsonData = JSON.parse(fs.readFileSync(file, 'utf8'));

  const options = new DocumentBuilder()
    .setTitle(`NestJS Boilerplate APP-${domain.toUpperCase()} Server`)
    .setDescription(`NestJS Boilerplate APP-${domain.toUpperCase()} 서버`)
    .setVersion(`${packageJsonData.version}`)
    .build();

  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'NestJS Boilerplate API Server',
  };

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(
    `/app-${domain}/${packageJsonData.version}/docs`,
    app,
    document,
    customOptions,
  );
}
