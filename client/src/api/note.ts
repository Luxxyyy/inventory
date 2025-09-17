import http from './http';

export const getNotes = async () => {
  const response = await http.get("/notes");
  return response.data;
};

export const addNote = async (noteData) => {
  const response = await http.post("/notes", noteData);
  return response.data;
};