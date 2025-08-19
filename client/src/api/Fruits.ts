import axios from 'axios';

export async function getFruits(): Promise<{fruits: string[], desc: string[]}> {
  const response = await axios.get('/api/fruits');
  return response.data;
}
