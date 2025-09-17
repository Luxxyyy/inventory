import { useEffect, useState, useCallback } from "react";
import http from "../api/http";
import "../design/logs.css";
import { toast, ToastContainer } from "react-toastify";

type NoteEntry = {
  id: number;
  user_id: number;
  title: string;
  message: string;
  image: string | null;
  isDone: boolean;
  latitude: number;
  longitude: number;
  created_at: string;
  User: {
    username: string;
    role: string;
  };
};

const ITEMS_PER_PAGE = 15;

const Notes = () => {
  const [notes, setNotes] = useState<NoteEntry[]>([]);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Function to fetch notes from the API
  const fetchNotes = useCallback(() => {
    setLoading(true);
    http
      .get("/notes")
      .then((res) => {
        setNotes(res.data);
        setError("");
      })
      .catch(() => {
        setError("Failed to load notes.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  // Handle marking a note as done
  const handleMarkAsDone = async (id: number) => {
    try {
      await http.patch(`/notes/${id}/done`);
      toast.success("Note marked as done!");
      fetchNotes(); // Re-fetch notes to update the list
    } catch (err) {
      console.error(err);
      toast.error("Failed to mark note as done.");
    }
  };

  // Calculate pagination data
  const totalPages = Math.ceil(notes.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentNotes = notes.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="container-fluid mt-4">
      <ToastContainer />
      <h2>Map Notes</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {loading && <div className="loading-indicator">Loading notes...</div>}
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="logs-header">
            <tr>
              <th>User</th>
              <th>Title</th>
              <th>Message</th>
              <th>Image</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentNotes.map((note) => (
              <tr key={note.id}>
                <td>{note.User?.username}</td>
                <td>{note.title}</td>
                <td>{note.message}</td>
                <td>
                  {note.image && (
                    <img
                      src={note.image}
                      alt="Note"
                      style={{ width: "50px", height: "50px", objectFit: "cover" }}
                    />
                  )}
                </td>
                <td>
                  {note.isDone ? (
                    <span className="badge bg-success">Done</span>
                  ) : (
                    <span className="badge bg-warning text-dark">Pending</span>
                  )}
                </td>
                <td>{new Date(note.created_at).toLocaleString()}</td>
                <td>
                  {!note.isDone && (
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => handleMarkAsDone(note.id)}
                    >
                      Done
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="d-flex justify-content-center align-items-center mt-3">
        <button
          className="btn btn-sm btn-outline-secondary me-2"
          disabled={currentPage === 1}
          onClick={() => goToPage(currentPage - 1)}
        >
          &laquo; Prev
        </button>
        {[...Array(totalPages)].map((_, i) => {
          const page = i + 1;
          return (
            <button
              key={page}
              className={`btn btn-sm me-1 ${
                currentPage === page
                  ? "btn-primary text-white"
                  : "btn-outline-primary"
              }`}
              onClick={() => goToPage(page)}
            >
              {page}
            </button>
          );
        })}
        <button
          className="btn btn-sm btn-outline-secondary ms-2"
          disabled={currentPage === totalPages}
          onClick={() => goToPage(currentPage + 1)}
        >
          Next &raquo;
        </button>
      </div>
    </div>
  );
};

export default Notes;