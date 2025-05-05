import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { OpenAiService } from './open-ai/open-ai.service';
import { GatewayModule } from './gateway/gateway.module';

@Module({
  imports: [ConfigModule.forRoot(), GatewayModule],
  controllers: [AppController],
  providers: [AppService, OpenAiService],
})
export class AppModule {}
