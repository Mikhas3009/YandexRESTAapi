import { NestFactory } from '@nestjs/core';
import { MainModule } from './main.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { config } from './config/swagger-config';
import { SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(MainModule);
    const PORT = process.env.PORT||3500;
    const doc = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/api/swagger',app,doc)
    await app.listen(PORT,()=>{
        console.log(`listening on port: ${PORT}`);
    });
}
bootstrap();