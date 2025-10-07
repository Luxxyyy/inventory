import http from './http';

export type SheetResponse = {
  id: number;
  sheet: string;
  source_id: number;
  source_name?: string;
  latitude: string;
  longitude: string;
  date_added: string;
};

export async function getSheets(): Promise<SheetResponse[]> {
  const { data } = await http.get('/sheets');
  return data;
}

export async function addSheet(
  sheet: string,
  source_id: number,
  longitude: string,
  latitude: string
) {
  const { data } = await http.post('/sheets', {
    sheet,
    source_id,
    longitude,
    latitude,
  });
  return data;
}

export async function updateSheet(
  id: number,
  sheet: string,
  source_id: number,
  longitude: string,
  latitude: string
) {
  const { data } = await http.put(`/sheets/${id}`, {
    sheet,
    source_id,
    longitude,
    latitude,
  });
  return data;
}

export async function deleteSheet(id: number) {
  const { data } = await http.delete(`/sheets/${id}`);
  return data;
}
