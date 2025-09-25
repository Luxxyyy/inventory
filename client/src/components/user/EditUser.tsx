import React, { useEffect, useState } from "react";
import http from "../../api/http";
import { User as UserType } from "../../services/authService";
import Modal from "../../components/Modal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  Box,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  Stack,
  Pagination,
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const EditUsers: React.FC = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userToDelete, setUserToDelete] = useState<UserType | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [userToEdit, setUserToEdit] = useState<UserType | null>(null);

  // Pagination state
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await http.get<UserType[]>("/users");
      // Sort users descending by id (optional)
      const sortedUsers = response.data.sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
      setUsers(sortedUsers);
    } catch {
      setError("Failed to fetch users");
      toast.error("⚠️ Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Paginate users
  const paginatedUsers = users.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    toast
      .promise(http.delete(`/users/${userToDelete.id}`), {
        pending: "Deleting user...",
        success: `✅ Deleted user "${userToDelete.username}"`,
        error: "❌ Failed to delete user",
      })
      .then(() => {
        setUserToDelete(null);
        fetchUsers();
      });
  };

  const handleUpdateUser = async (updatedUser: Partial<UserType> & { password?: string }) => {
    if (!userToEdit) return;

    try {
      await http.put(`/users/${userToEdit.id}`, updatedUser);
      toast.success("✅ User updated successfully");
      setUserToEdit(null);
      fetchUsers();
    } catch (err: any) {
      toast.error("❌ Failed to update user");
    }
  };

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Box m={3}>
        <Typography color="error" variant="h6">
          {error}
        </Typography>
      </Box>
    );

  return (
    <Box m={3}>
      <Paper elevation={3}>
        <TableContainer sx={{ maxHeight: 400 }}>
          <Table stickyHeader aria-label="users table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', backgroundColor: '#17a2b8', color: 'white' }}>Profile</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', backgroundColor: '#17a2b8', color: 'white' }}>Username</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', backgroundColor: '#17a2b8', color: 'white' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', backgroundColor: '#17a2b8', color: 'white' }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', backgroundColor: '#17a2b8', color: 'white' }} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedUsers.map((u) => (
                <TableRow key={u.id} hover>
                  <TableCell >
                    {u.image ? (
                      <Box
                        component="img"
                        src={u.image}
                        alt={`${u.username}-thumb`}
                        sx={{
                          width: 50,
                          height: 50,
                          objectFit: "cover",
                          borderRadius: 1,
                          cursor: u.full_image || u.image ? "pointer" : "default",
                        }}
                        onClick={() => {
                          if (u.full_image || u.image) {
                            setSelectedImage(u.full_image || u.image || null);
                          }
                        }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          width: 50,
                          height: 50,
                          bgcolor: "grey.300",
                          borderRadius: 1,
                        }}
                      />
                    )}
                  </TableCell>
                  <TableCell>{u.username}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell sx={{ textTransform: "capitalize" }}>{u.role}</TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => setUserToEdit(u)}
                      >
                        <EditIcon sx={{ fontSize: '1rem' }} />
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        color="error"
                        onClick={() => setUserToDelete(u)}
                      >
                        <DeleteIcon sx={{ fontSize: '1rem' }} />
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Pagination */}
      <Pagination
        count={Math.ceil(users.length / rowsPerPage)}
        page={page}
        onChange={handlePageChange}
        color="primary"
        sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}
      />

      {/* Delete Confirmation Modal */}
      {userToDelete && (
        <Modal onClose={() => setUserToDelete(null)} title="Confirm Delete">
          <Typography mb={2}>
            Are you sure you want to delete <strong>{userToDelete.username}</strong>?
          </Typography>
          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button variant="outlined" onClick={() => setUserToDelete(null)}>
              Cancel
            </Button>
            <Button variant="contained" color="error" onClick={confirmDelete}>
              Confirm Delete
            </Button>
          </Box>
        </Modal>
      )}

      {/* Profile Image Modal */}
      {selectedImage && (
        <Modal onClose={() => setSelectedImage(null)} title="Profile Image">
          <Box textAlign="center">
            <Box
              component="img"
              src={selectedImage}
              alt="full"
              sx={{ maxWidth: "100%", maxHeight: "60vh", borderRadius: 2 }}
            />
            <Box mt={3}>
              <Button
                variant="outlined"
                component="a"
                href={selectedImage || ""}
                download="profile-image.png"
                target="_blank"
                rel="noreferrer"
              >
                Open in new tab
              </Button>
            </Box>
          </Box>
        </Modal>
      )}

      {/* Edit User Modal */}
      {userToEdit && (
        <Modal onClose={() => setUserToEdit(null)} title={`Edit User: ${userToEdit.username}`} width="800px">
          <Box
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const updatedUser: Partial<UserType> & { password?: string } = {
                username: formData.get("username") as string,
                email: formData.get("email") as string,
                role: formData.get("role") as string,
              };
              const password = formData.get("password") as string;
              if (password.trim() !== "") {
                updatedUser.password = password;
              }
              handleUpdateUser(updatedUser);
            }}
            noValidate
            autoComplete="off"
            sx={{ mt: 1 }}
          >
            <TextField
              fullWidth
              label="Username"
              name="username"
              defaultValue={userToEdit.username}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              defaultValue={userToEdit.email}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="Password (leave blank to keep unchanged)"
              name="password"
              type="password"
              margin="normal"
            />

            <FormControl fullWidth margin="normal">
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                name="role"
                defaultValue={userToEdit.role}
                label="Role"
              >
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="engr">Engineer</MenuItem>
              </Select>
            </FormControl>

            <Box display="flex" justifyContent="flex-end" mt={3} gap={2}>
              <Button variant="outlined" onClick={() => setUserToEdit(null)}>
                Cancel
              </Button>
              <Button variant="contained" type="submit">
                Save Changes
              </Button>
            </Box>
          </Box>
        </Modal>
      )}
    </Box>
  );
};

export default EditUsers;
