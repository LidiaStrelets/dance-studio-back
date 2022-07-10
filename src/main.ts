import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@pipes/validation.pipe';
import 'dotenv/config';
import 'module-alias/register';

const PORT = process.env.PORT || 3000;

async function startServer() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Dance studio')
    .setDescription('The dance studio api description')
    .setVersion('1.0')
    .addTag('dance_studio')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
startServer();
