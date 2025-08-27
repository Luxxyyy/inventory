import http from './http';

export type SourceType = {
  id?: number;
  balangay: string;
  source: string;
  latitude: string;
  longitude: string;
};

export async function getSources(): Promise<SourceType[]> {
  const { data } = await http.get('/sources');
  return data;
}

export async function addSource(balangay: string, source: string, latitude: string, longitude: string) {
  const { data } = await http.post('/sources', { balangay, source, latitude, longitude });
  return data;
}