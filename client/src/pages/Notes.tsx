import { useEffect, useState, useCallback } from "react";
import http from "../api/http";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// MUI Components
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  Typography,
  Pagination,
  Stack,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Chip,
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

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="container my-4" style={{ maxWidth: "95%" }}>
      <ToastContainer />
      <h2 className="mb-3">Notes Management</h2>

      {error && <Alert severity="error">{error}</Alert>}
      {loading && <Alert severity="info">Loading notes...</Alert>}

      <TableContainer component={Paper} sx={{ maxHeight: 750 }}>
        <Table stickyHeader size="small" aria-label="notes table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#17a2b8', color: 'white' }}>User</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#17a2b8', color: 'white' }}>Title</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#17a2b8', color: 'white' }}>Message</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#17a2b8', color: 'white' }}>Image</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#17a2b8', color: 'white' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#17a2b8', color: 'white' }}>Created At</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#17a2b8', color: 'white' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentNotes.map((note) => (
              <TableRow key={note.id} hover>
                <TableCell>{note.User?.username}</TableCell>
                <TableCell>{note.title}</TableCell>
                <TableCell>{note.message}</TableCell>
                <TableCell>
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
                        borderRadius: 4,
                      }}
                    />
                  )}
                </TableCell>
                <TableCell>
                  <Chip
                    label={note.isDone ? "Done" : "Pending"}
                    color={note.isDone ? "success" : "warning"}
                    size="small"
                  />
                </TableCell>
                <TableCell>{new Date(note.created_at).toLocaleString()}</TableCell>
                <TableCell>
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* MUI Pagination */}
      <Stack direction="row" justifyContent="center" mt={3}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Stack>

      {/* Confirm Done Dialog */}
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

      {/* Image Viewer Dialog */}
      <Dialog
        open={imageModalOpen}
        onClose={handleCloseImageModal}
        maxWidth="md"
        fullWidth
      >
        <DialogContent
          sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
        >
          {enlargedImage && (
            <img
              src={enlargedImage}
              alt="Enlarged Note"
              style={{
                maxWidth: "100%",
                maxHeight: "80vh",
                objectFit: "contain",
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
