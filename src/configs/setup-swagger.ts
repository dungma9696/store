import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import APP_CONFIG from './app.config';
import { Environment } from '../constants';

export function setupSwagger(app: INestApplication): void {
  if (
    [Environment.test, Environment.production].indexOf(
      APP_CONFIG.ENV.NAME as Environment,
    ) === -1
  ) {
    const serverUrl =
      [Environment.local].indexOf(APP_CONFIG.ENV.NAME as Environment) > -1
        ? `http://localhost:${APP_CONFIG.ENV.APP.PORT}`
        : `${APP_CONFIG.ENV.SHARE.PUBLIC.GATEWAY_CONFIG.METHOD}://${APP_CONFIG.ENV.SHARE.PUBLIC.GATEWAY_CONFIG.HOST}`;

    const serviceApi = `${APP_CONFIG.ENV.APP.NAME.slice(
      0,
      1,
    ).toUpperCase()}${APP_CONFIG.ENV.APP.NAME.slice(1)}`;
    const apiDocOptions = new DocumentBuilder()
      .setTitle(`${serviceApi} API`)
      .setVersion('1.0')
      .setDescription(`API Documentation for ${serviceApi}`)
      .addServer(serverUrl, `api server`)
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, apiDocOptions, {
      operationIdFactory: (controllerKey: string, methodKey: string) =>
        methodKey,
    });
    SwaggerModule.setup('documentation', app, document);
  }
}
