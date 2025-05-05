import { Module } from '@nestjs/common';
import { Gateway } from './gateway.service';
import { OpenAiService } from '../open-ai/open-ai.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [Gateway, OpenAiService, ConfigService],
})
export class GatewayModule {}
