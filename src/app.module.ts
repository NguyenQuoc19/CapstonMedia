import appConfig from './config/app.config';
import databaseConfig from "./config/database.config";
import envValidationSchema from './config/env.config';

import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule } from "@nestjs/config";
import { UploadModule } from './shared/upload/upload.module';
import { PrismaModule } from './shared/prisma/prisma.module';
import { HealthModule } from './shared/health/health.module';
import { AppController } from './app.controller';
import { AllExceptionFilter } from './common/filters/all-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { MediaModule } from './modules/media/media.module';
import { CommentModule } from './modules/comment/comment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [
        appConfig,
        databaseConfig,
      ],
      isGlobal: true,
      envFilePath: ".env",
      validationSchema: envValidationSchema,
    }),
    AuthModule,
    UsersModule,
    PrismaModule,
    HealthModule,
    UploadModule,
    MediaModule,
    CommentModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Global Response Wrapper
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },

    // Global Error Handler
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
  ],
})
export class AppModule { }
