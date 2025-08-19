import axios from 'axios';

export async function getFruits(): Promise<{fruits: string[], desc: string[]}> {
  const response = await axios.get('/apiFruits');
  return response.data;
}
