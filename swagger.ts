import { INestApplication } from '@nestjs/common';
import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerCustomOptions,
} from '@nestjs/swagger';
import * as fs from 'fs';

export function setupSwagger(app: INestApplication) {
  const file = './package.json';
  const packageJsonData = JSON.parse(fs.readFileSync(file, 'utf8'));

  const options = new DocumentBuilder()
    .setTitle('NestJS Boilerplate API Server')
    .setDescription('NestJS Boilerplate API 서버')
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
    `/api/${packageJsonData.version}/docs`,
    app,
    document,
    customOptions,
  );
}
