import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { OpenAiService } from './open-ai/open-ai.service';

interface ChatInput {
  prompt: string;
}

class ChatOuput {
  completion: string;
}

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly openAIservice: OpenAiService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/health')
  getHealth(): string {
    return 'OK';
  }

  @Post('/api/chat')
  async postChat(@Body() chatInput: ChatInput): Promise<ChatOuput> {
    // Validation param here
    // const chatCompletion = await this.openAIservice.chat(
    //   chatInput.prompt,
    //   '123',
    // );
    // console.log('chatCompletion', chatCompletion);
    // console.log('controller', chatCompletion.controller);
    console.log('chatInput', chatInput);
    return {
      completion: 'No response',
    };
  }
}
