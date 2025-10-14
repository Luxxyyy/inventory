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

function makeSafePayload(payload: Record<string, any>) {
  const allowed = [
    'conversation_id',
    'sender_id',
    'receiver_id',
    'message',
    'message_type',
    'message_status',
    'thumbnail',
    'image_fullview',
  ];
  const out: Record<string, any> = {};
  for (const k of allowed) {
    const v = payload[k];
    if (v === undefined) {
      out[k] = null;
    } else if (
      typeof v === 'string' ||
      typeof v === 'number' ||
      typeof v === 'boolean' ||
      v === null
    ) {
      out[k] = v;
    } else {
      try {
        out[k] = JSON.stringify(v);
      } catch {
        out[k] = String(v);
      }
    }
  }
  return out;
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
  try {
    const safePayload = makeSafePayload(payload as Record<string, any>);
    const { data } = await http.post('/messages/send', safePayload);
    return data;
  } catch (err) {
    console.error('sendMessage error (client):', err);
    throw err;
  }
}
