import http from './http';

type NewNoteData = {
  title: string;
  message: string;
  image?: string | null; 
  isDone?: boolean;
  latitude: number;
  longitude: number;
};

export const getNotes = async () => {
  const response = await http.get("/notes");
  return response.data;
};

export const addNote = async (noteData: NewNoteData) => {
  const response = await http.post("/notes", noteData);
  return response.data;
};