import * as process from 'process';
import { ClientOptions } from 'openai';

export interface IOpenAiRequestConfiguration {
  model: string;
  maxNumberOfChoices: number;
  maxTokens?: number;
}

interface IOpenAiClientConfiguration {
  openAiClient: ClientOptions;
}

export const openAiClientConfiguration = (): IOpenAiClientConfiguration => {
  return {
    openAiClient: {
      apiKey: process.env.OPEN_AI_API_KEY,
    },
  };
};

export const openAiRequestConfiguration = (): {
  openAiRequest: IOpenAiRequestConfiguration;
} => {
  if (!process.env.OPEN_AI_MODEL_VERSION) {
    throw new Error('OPEN_AI_MODEL_VERSION is not defined');
  }
  return {
    openAiRequest: {
      model: process.env.OPEN_AI_MODEL_VERSION,
      maxNumberOfChoices: 1,
    },
  };
};
