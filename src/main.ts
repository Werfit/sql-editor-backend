import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const configService = app.get(ConfigService);

  const whitelist = configService.get("application.whitelist");
  app.enableCors({
    origin: whitelist,
  });

  const port = configService.getOrThrow("application.port");
  await app.listen(port);
}
bootstrap();
