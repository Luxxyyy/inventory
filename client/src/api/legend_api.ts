import http from './http';

export async function addLegendItem(
  label: string,
  type: string,
  color: string,
  cssClass: string
) {
  const { data } = await http.post('/legend', {
    label,
    type,
    color,
    cssClass,
  });
  return data;
}

export async function getLegendItems() {
  const { data } = await http.get('/legend');
  return data;
}

export async function updateLegendItem(
  id: number,
  label: string,
  type: string,
  color: string,
  cssClass: string
) {
  const { data } = await http.put(`/legend/${id}`, {
    label,
    type,
    color,
    cssClass,
  });
  return data;
}

export async function deleteLegendItem(id: number) {
  const { data } = await http.delete(`/legend/${id}`);
  return data;
}