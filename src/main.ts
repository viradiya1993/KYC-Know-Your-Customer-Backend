import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as helmet from 'helmet';

const port = process.env.PORT || 3030;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  /**
  * Helmet can help protect your app from some well-known
  * web vulnerabilities by setting HTTP headers appropriately.
  * Generally, Helmet is just a collection of 12 smaller
  * middleware functions that set security-related HTTP headers
  *
  * https://github.com/helmetjs/helmet#how-it-works
  */
  await app.use(helmet());

  await app.enableCors();
  await app.setGlobalPrefix('/api/v1');

  /** Swagger documentation */
  const APP_NAME = process.env.npm_package_name;
  const APP_VERSION = process.env.npm_package_version;

  const options = new DocumentBuilder()
    .setTitle(APP_NAME)
    .setDescription(`The ${APP_NAME} API description`)
    .setVersion(APP_VERSION)
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(port);
  Logger.log(`Server running on http://localhost:${port}`, 'Bootstrap');
}
bootstrap();
