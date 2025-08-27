import http from './http';

export type PurokResponse = {
  puroks: string[];
  balangays: string[] | null[];
  source: (string | null)[];
  latitude: (string | null)[];
  longitude: (string | null)[];
  date_added: (string | null)[];
};

export async function getPuroks(): Promise<PurokResponse> {
  const { data } = await http.get('/puroks');
  return data;
}

export async function addPurok(
  purok: string,
  balangay: string,
  source: string,
  latitude: string,
  longitude: string
) {
  const { data } = await http.post('/puroks', { purok, balangay, source, latitude, longitude });
  return data;
}