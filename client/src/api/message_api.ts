import http from './http';

export type MessageItem = {
  id: number;
  conversation_id: number;
  sender_id: number;
  receiver_id: number;
  message: string;
  message_type: string;
  message_status: string;
  thumbnail?: string | null;
  image_fullview?: string | null;
  date_added: string;
};

export async function getMessages(conversationId: number): Promise<MessageItem[]> {
  const { data } = await http.get(`/messages/conversation/${conversationId}`);
  return data;
}

export async function sendMessage(payload: {
  conversation_id: number;
  sender_id: number;
  receiver_id: number;
  message: string;
  message_type?: string;
  message_status?: string;
  thumbnail?: string | null;
  image_fullview?: string | null;
}) {
  const { data } = await http.post('/messages/send', payload);
  return data;
}
