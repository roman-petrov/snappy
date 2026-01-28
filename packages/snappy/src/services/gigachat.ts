import type { FeatureType } from '../prompts/index';
import { getSystemPrompt } from '../prompts/index';
import { config } from '../config';

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
  stream: boolean;
  repetition_penalty: number;
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
  private accessToken: string | null = null;
  private tokenExpiresAt: number = 0;

  private getAccessToken = async (): Promise<string> => {
    if (this.accessToken && Date.now() < this.tokenExpiresAt) {
      return this.accessToken;
    }

    const authKey = config.GIGACHAT_AUTH_KEY.trim().replace(/\s+/g, '');
    const response = await fetch('https://ngw.devices.sberbank.ru:9443/api/v2/oauth', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Basic ${authKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        RqUID: crypto.randomUUID(),
      },
      body: `scope=${encodeURIComponent(config.GIGACHAT_SCOPE)}`,
    });

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(`Failed to get access token: ${response.status} ${response.statusText}${errBody ? ` — ${errBody}` : ''}`);
    }

    const data = (await response.json()) as GigaChatTokenResponse;
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
        { role: 'system', content: systemPrompt },
        { role: 'user', content: text },
      ],
      stream: false,
      repetition_penalty: 1,
    };

    const response = await fetch('https://gigachat.devices.sberbank.ru/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(`GigaChat API error: ${response.status} ${response.statusText}${errBody ? ` — ${errBody}` : ''}`);
    }

    const data = (await response.json()) as GigaChatCompletionResponse;

    if (!data.choices || data.choices.length === 0) {
      throw new Error('No response from GigaChat');
    }

    return data.choices[0].message.content.trim();
  };
}

export const gigaChatService = new GigaChatService();
