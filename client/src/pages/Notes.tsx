import { useEffect, useState, useCallback } from "react";
import http from "../api/http";
import "../design/logs.css";
import { toast, ToastContainer } from "react-toastify";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

type NoteEntry = {
  id: number;
  user_id: number;
  title: string;
  message: string;
  image: string | null;
  full_image: string | null;
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

  const [open, setOpen] = useState(false);
  const [noteToMarkDoneId, setNoteToMarkDoneId] = useState<number | null>(null);

  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);

  const fetchNotes = useCallback(() => {
    setLoading(true);
    http
      .get("/notes")
      .then((res) => {
        const sortedNotes = res.data.sort((a: NoteEntry, b: NoteEntry) => {
          if (!a.isDone && b.isDone) return -1;
          if (a.isDone && !b.isDone) return 1;
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
        setNotes(sortedNotes);
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

  const handleOpenConfirm = (id: number) => {
    setNoteToMarkDoneId(id);
    setOpen(true);
  };

  const handleCloseConfirm = () => {
    setOpen(false);
    setNoteToMarkDoneId(null);
  };

  const handleConfirmDone = async () => {
    if (noteToMarkDoneId === null) return;

    try {
      await http.put(`/notes/${noteToMarkDoneId}`, { isDone: true });
      toast.success("Note marked as done!");
      fetchNotes();
      handleCloseConfirm();
    } catch (err) {
      console.error(err);
      toast.error("Failed to mark note as done.");
      handleCloseConfirm();
    }
  };

  const handleOpenImageModal = (imageSrc: string) => {
    setEnlargedImage(imageSrc);
    setImageModalOpen(true);
  };

  const handleCloseImageModal = () => {
    setImageModalOpen(false);
    setEnlargedImage(null);
  };

  const totalPages = Math.ceil(notes.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentNotes = notes.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const goToPage = (page: number) => {
    if (page >= 1 && page >= 1 && page <= totalPages) setCurrentPage(page);
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
                      onClick={() => handleOpenImageModal(note.full_image!)}
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                        cursor: "pointer",
                      }}
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
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      onClick={() => handleOpenConfirm(note.id)}
                    >
                      Done
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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

      <Dialog
        open={open}
        onClose={handleCloseConfirm}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <DialogTitle id="confirm-dialog-title">Confirm Action</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-dialog-description">
            Are you sure you want to mark this note as done? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirm} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDone} color="primary" autoFocus>
            Done
          </Button>
        </DialogActions>
      </Dialog>
      
      <Dialog
        open={imageModalOpen}
        onClose={handleCloseImageModal}
        maxWidth="md"
        fullWidth
      >
        <DialogContent style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {enlargedImage && (
            <img
              src={enlargedImage}
              alt="Enlarged Note"
              style={{
                maxWidth: '100%',
                maxHeight: '80vh',
                objectFit: 'contain'
              }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseImageModal} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Notes;