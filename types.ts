
export enum MessageRole {
  USER = 'user',
  AI = 'ai',
}

export interface ChatMessage {
  role: MessageRole;
  content: string;
}
