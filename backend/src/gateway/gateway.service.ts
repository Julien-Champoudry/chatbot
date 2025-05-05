import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { ChatModel } from 'openai/resources';
import { Socket, Server } from 'socket.io';
import { OpenAiService } from '../open-ai/open-ai.service';

interface ChatInput {
  prompt: string;
  model: string;
  clientId: string;
}

export const validModels: Array<string> = [
  'gpt-4o',
  'gpt-4o-2024-05-13',
  'gpt-4-turbo',
  'gpt-4-turbo-2024-04-09',
  'gpt-4-0125-preview',
  'gpt-4-turbo-preview',
  'gpt-4-1106-preview',
  'gpt-4-vision-preview',
  'gpt-4',
  'gpt-4-0314',
  'gpt-4-0613',
  'gpt-4-32k',
  'gpt-4-32k-0314',
  'gpt-4-32k-0613',
  'gpt-3.5-turbo',
  'gpt-3.5-turbo-16k',
  'gpt-3.5-turbo-0301',
  'gpt-3.5-turbo-0613',
  'gpt-3.5-turbo-1106',
  'gpt-3.5-turbo-0125',
  'gpt-3.5-turbo-16k-0613',
];

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class Gateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly openAIservice: OpenAiService) {}

  @SubscribeMessage('chatCompletion')
  async generateChatCOmpletion(
    @MessageBody() data: ChatInput,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const { prompt, clientId, model } = data;

      console.log('data', data);
      console.log('test', validModels.includes(model));

      if (!validModels.includes(model)) {
        throw new Error('Invalid Model');
      }

      const stream = await this.openAIservice.chat(
        prompt,
        model as ChatModel,
        clientId,
      );

      for await (const chunk of stream) {
        const content = chunk.choices?.[0]?.delta?.content;
        if (content) {
          client.emit('chatToken', content);
        }
      }
      client.emit('chatEnd', '[end]');
    } catch (err: unknown) {
      console.log('err', err);
      if (err instanceof Error) {
        client.emit('events', { completion: err.message });
        return;
      }

      client.emit('events', { completion: 'OpenAI error' });
    }
  }
}
