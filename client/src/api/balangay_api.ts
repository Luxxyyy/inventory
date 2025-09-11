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
  source_id: number,
  longitude: string,
  latitude: string
) {
  const { data } = await http.post('/balangays', { balangay, source_id, longitude, latitude });
  return data;
}

export async function updateBalangay(
  id: number,
  balangay: string,
  source_id: number,
  longitude: string,
  latitude: string
) {
  const { data } = await http.put(`/balangays/${id}`, {
    balangay,
    source_id,
    longitude,
    latitude,
  });
  return data;
}

