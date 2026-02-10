
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsConfigService } from 'nest-config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const corsConfigService = app.get(CorsConfigService);

  app.enableCors(corsConfigService.getCorsOptions());

  await app.listen(3000);
}
bootstrap();
