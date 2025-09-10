import http from './http';

export type PurokItem = {
  id: number;
  purok: string;
  balangay_id: number;
  balangay_name: string;
  source_id: number;
  source_name: string;
  latitude: string;
  longitude: string;
  date_added: string;
};

export async function getPuroks(): Promise<PurokItem[]> {
  const { data } = await http.get('/puroks');
  return data;
}

export async function addPurok(
  purok: string,
  balangay_id: number,
  source_id: number,
  latitude: string,
  longitude: string
) {
  const { data } = await http.post('/puroks', {
    purok,
    balangay_id,
    source_id,
    latitude,
    longitude,
  });
  return data;
}
