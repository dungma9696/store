import { NestFactory } from '@nestjs/core';
import { BadRequestException, Logger, ValidationPipe } from '@nestjs/common';
import { useContainer, ValidationError } from 'class-validator';
import helmet from 'helmet';
import * as morgan from 'morgan';
import * as compression from 'compression';

import { API_PREFIX, API_VERSION } from './constants';

import { AppModule } from './app.module';
import { setupSwagger } from './configs/setup-swagger';
import CONFIG from './configs/app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: CONFIG.ENV.SHARE.SECURE.CORS.ORIGIN,
    methods: CONFIG.ENV.SHARE.SECURE.CORS.METHODS,
    allowedHeaders: CONFIG.ENV.SHARE.SECURE.CORS.ALLOWED_HEADERS,
    exposedHeaders: CONFIG.ENV.SHARE.SECURE.CORS.EXPOSED_HEADERS,
    credentials: CONFIG.ENV.SHARE.SECURE.CORS.CREDENTIALS,
    preflightContinue: CONFIG.ENV.SHARE.SECURE.CORS.PREFLIGHT_CONTINUE,
  });

  app.setGlobalPrefix(`/${API_PREFIX}/${API_VERSION}`);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.use(helmet());
  app.use(compression());
  app.use(morgan('dev'));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (errors: ValidationError[]) => {
        return new BadRequestException(errors);
      },
    }),
  );

  setupSwagger(app);

  await app.listen(CONFIG.ENV.APP.PORT).then(() => {
    console.log('============================')
    Logger.log('Server listening on port ' + CONFIG.ENV.APP.PORT);
  });
}
bootstrap();
