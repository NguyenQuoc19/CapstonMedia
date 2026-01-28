import { join } from 'path';
import { ROOT } from './common/constants/storage.constant';
import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { ProjectConfig } from './config/app.config';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix("api");
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  const config = app.get(ConfigService);
  const { port } = config.get<ProjectConfig>("project")!;

  app.useStaticAssets(join(process.cwd(), ROOT), {
    prefix: `/${ROOT}`,
  });

  await app.listen(port);
}
bootstrap();
