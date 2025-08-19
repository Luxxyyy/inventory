import axios from 'axios';

export async function getFruits(): Promise<string[]> {
  const response = await axios.get('http://localhost:8080/api');
  return response.data.fruits;
}
