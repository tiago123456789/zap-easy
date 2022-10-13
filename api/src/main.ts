import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as bodyParser from 'body-parser';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  const config = new DocumentBuilder()
    .setTitle('Zap-easy api')
    .setDescription('The api help you send text, voice, image or document message using your whatsapp more easily. WARNING: THE UNOFFICIAL SOLUCTION')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.useGlobalPipes(new ValidationPipe());
  app.use(bodyParser.json({
    limit: '15mb'
  }));

  await app.listen(3000);
}
bootstrap();

