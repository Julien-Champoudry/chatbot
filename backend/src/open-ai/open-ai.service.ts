import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { ChatModel } from 'openai/resources';

@Injectable()
export class OpenAiService {
  private readonly openAiClient: OpenAI;

  private readonly maxTokens: number;
  private readonly maxNumberOfChoices: number;

  constructor(private readonly configService: ConfigService) {
    const openaiApiKey = this.configService.get<string>('OPEN_AI_API_KEY');

    if (!openaiApiKey) {
      throw new Error(
        'OPEN_AI_API_KEY or OPEN_AI_MODEL_VERSION is not defined',
      );
    }

    this.openAiClient = new OpenAI({
      apiKey: openaiApiKey,
    });
    this.maxTokens = 1000;
    this.maxNumberOfChoices = 1;
  }

  async chat(question: string, model: ChatModel, openaiClientID: string) {
    const aiResponse = await this.openAiClient.chat.completions.create({
      user: openaiClientID,
      model: model,
      stream: true,
      messages: [{ role: 'user', content: question }],
      ...(this.maxTokens ? { max_tokens: this.maxTokens } : {}),
      ...(this.maxNumberOfChoices ? { n: this.maxNumberOfChoices } : {}),
    });

    console.log('aiResponse', aiResponse);

    return aiResponse;
  }
}
