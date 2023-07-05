import { DocumentBuilder } from "@nestjs/swagger";

export const config = new DocumentBuilder()
    .setTitle("Backend задача от Яндекса")
    .setDescription("Приложение для доставки")
    .setVersion('Alpha')
    .build();