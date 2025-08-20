import http from './http';


export type FruitsResponse = { fruits: string[]; desc: (string | null)[] };


export async function getFruits(): Promise<FruitsResponse> {
const { data } = await http.get('/fruits');
return data;
}


export async function addFruit(fruit_name: string, description?: string) {
const { data } = await http.post('/fruits', { fruit_name, description });
return data;
}