import { sdk } from "./telemetry";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { AppConfigService, CorsConfigService } from "nest-config";
import { requestContextMiddleware } from "common";

async function bootstrap() {
  await sdk.start();

  const app = await NestFactory.create(AppModule);

  const config = app.get(AppConfigService);
  const corsConfigService = app.get(CorsConfigService);

  app.enableCors(corsConfigService.getCorsOptions());

  app.use(requestContextMiddleware);

  await app.listen(config.port);

  console.log(`🚀 Server running on port ${config.port}`);
}

bootstrap();
