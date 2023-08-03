import { Module } from '@nestjs/common';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import APP_CONFIG from './configs/app.config';

import { UsersModule } from './modules/users/users.module';

const passwordEncode = encodeURIComponent(
  APP_CONFIG.ENV.DATABASE.MONGODB.PASSWORD,
);
// const connectionUri =
//   `mongodb://${
//     APP_CONFIG.ENV.DATABASE.MONGODB.PASSWORD.trim() === ''
//       ? ''
//       : `${APP_CONFIG.ENV.DATABASE.MONGODB.USERNAME}:${passwordEncode}@`
//   }${APP_CONFIG.ENV.DATABASE.MONGODB.HOST}:${
//     APP_CONFIG.ENV.DATABASE.MONGODB.PORT
//   }/` + `${APP_CONFIG.ENV.DATABASE.MONGODB.NAME}`;

const connectionUri =
  'mongodb+srv://dungma:Demo12345@cluster0.kwc7zxx.mongodb.net/?retryWrites=true&w=majority';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MongooseModule.forRootAsync({
      useFactory: (): MongooseModuleOptions => ({
        uri: connectionUri,
      }),
    }),
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
