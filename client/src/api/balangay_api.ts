import http from './http';

export type BalangayResponse = {
  balangays: string[];
  source: (string | null)[];
  longitude: (string | null)[];
  latitude: (string | null)[];
  date_added: (string | null)[];
};

export async function getBalangays(): Promise<BalangayResponse> {
  const { data } = await http.get('/balangays');
  return data;
}

export async function addBalangay(
  balangay: string,
  source: string,
  longitude: string,
  latitude: string
) {
  const { data } = await http.post('/balangays', { balangay, source, longitude, latitude });
  return data;
}