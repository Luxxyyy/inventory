import http from './http';

export type ConversationItem = {
  id: number;
  user1_id: number;
  user2_id: number;
  created_at: string;
  updated_at: string;
};

export async function getOrCreateConversation(user1_id: number, user2_id: number): Promise<ConversationItem> {
  const { data } = await http.post('/conversations', { user1_id, user2_id });
  return data;
}

export async function getAllConversations(): Promise<ConversationItem[]> {
  const { data } = await http.get('/conversations');
  return data;
}
