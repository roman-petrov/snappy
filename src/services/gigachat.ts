import type { FeatureType } from '../prompts/index';
import { getSystemPrompt } from '../prompts/index';

interface GigaChatTokenResponse {
  access_token: string;
  expires_at: number;
}

interface GigaChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface GigaChatCompletionRequest {
  model: string;
  messages: GigaChatMessage[];
  temperature?: number;
  max_tokens?: number;
}

interface GigaChatCompletionResponse {
  choices: Array<{
    message: {
      content: string;
      role: string;
    };
    index: number;
    finish_reason: string;
  }>;
  created: number;
  model: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

class GigaChatService {
  private clientId: string;
  private clientSecret: string;
  private scope: string;
  private accessToken: string | null = null;
  private tokenExpiresAt: number = 0;

  constructor() {
    this.clientId = process.env.GIGACHAT_CLIENT_ID || '';
    this.clientSecret = process.env.GIGACHAT_CLIENT_SECRET || '';
    this.scope = process.env.GIGACHAT_SCOPE || 'GIGACHAT_API_PERS';
  }

  private getAuthHeader = (): string => {
    const credentials = `${this.clientId}:${this.clientSecret}`;
    return `Basic ${btoa(credentials)}`;
  };

  private getAccessToken = async (): Promise<string> => {
    if (this.accessToken && Date.now() < this.tokenExpiresAt) {
      return this.accessToken;
    }

    const response = await fetch('https://ngw.devices.sberbank.ru:9443/api/v2/oauth', {
      method: 'POST',
      headers: {
        'Authorization': this.getAuthHeader(),
        'RqUID': crypto.randomUUID(),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `scope=${this.scope}`,
    });

    if (!response.ok) {
      throw new Error(`Failed to get access token: ${response.statusText}`);
    }

    const data = await response.json() as GigaChatTokenResponse;
    this.accessToken = data.access_token;
    this.tokenExpiresAt = data.expires_at;

    return this.accessToken;
  };

  processText = async (text: string, feature: FeatureType): Promise<string> => {
    const token = await this.getAccessToken();
    const systemPrompt = getSystemPrompt(feature);

    const requestBody: GigaChatCompletionRequest = {
      model: 'GigaChat',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: text,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    };

    const response = await fetch('https://gigachat.devices.sberbank.ru/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`GigaChat API error: ${response.statusText}`);
    }

    const data = await response.json() as GigaChatCompletionResponse;
    
    if (!data.choices || data.choices.length === 0) {
      throw new Error('No response from GigaChat');
    }

    return data.choices[0].message.content.trim();
  };
}

export const gigaChatService = new GigaChatService();
