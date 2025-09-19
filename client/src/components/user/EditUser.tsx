import React, { useEffect, useState } from "react";
import http from "../../api/http";
import { User as UserType } from "../../services/authService";
import Modal from "../../components/Modal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../design/user.css";

const EditUsers: React.FC = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userToDelete, setUserToDelete] = useState<UserType | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [userToEdit, setUserToEdit] = useState<UserType | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await http.get<UserType[]>("/users");
      setUsers(response.data);
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

  const handleUpdateUser = async (updatedUser: Partial<UserType>) => {
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

  if (loading) return <p>Loading...</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container-fluid my-4 px-0">
      <div className="card shadow-sm w-100">
        <div
          className="table-responsive"
          style={{ maxHeight: 400, overflowY: "auto" }}
        >
          <table className="table table-hover mb-0 w-100">
            <thead className="sticky-top user-header">
              <tr>
                <th>Profile</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>
                    <img
                      src={u.image || ""}
                      alt={`${u.username}-thumb`}
                      width={50}
                      height={50}
                      style={{
                        objectFit: "cover",
                        cursor: u.full_image || u.image ? "pointer" : "default",
                        borderRadius: 4,
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
                  </td>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td className="text-center">
                    <button
                      className="btn btn-sm btn-primary me-2"
                      onClick={() => setUserToEdit(u)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger text-white"
                      onClick={() => setUserToDelete(u)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {userToDelete && (
        <Modal onClose={() => setUserToDelete(null)} title="Confirm Delete">
          <p>
            Are you sure you want to delete{" "}
            <strong>{userToDelete.username}</strong>?
          </p>
          <div className="d-flex justify-content-end">
            <button
              className="btn btn-primary me-2"
              onClick={() => setUserToDelete(null)}
            >
              Cancel
            </button>
            <button
              className="btn btn-danger text-white"
              onClick={confirmDelete}
            >
              Confirm Delete
            </button>
          </div>
        </Modal>
      )}

      {/* Profile image modal */}
      {selectedImage && (
        <Modal onClose={() => setSelectedImage(null)} title="Profile Image">
          <div style={{ textAlign: "center" }}>
            <img
              src={selectedImage}
              alt="full"
              style={{ maxWidth: "100%", maxHeight: "60vh", borderRadius: 8 }}
            />
            <div className="mt-3">
              <a
                className="btn btn-outline-secondary me-2"
                href={selectedImage}
                download="profile-image.png"
                target="_blank"
                rel="noreferrer"
              >
                Open in new tab
              </a>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit user modal */}
      {userToEdit && (
        <Modal
          onClose={() => setUserToEdit(null)}
          title={`Edit User: ${userToEdit.username}`}
          width="800px"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget as HTMLFormElement);
              const updatedUser = {
                username: formData.get("username") as string,
                email: formData.get("email") as string,
                role: formData.get("role") as string,
                password: formData.get("password") as string || undefined,
              };
              handleUpdateUser(updatedUser);
            }}
          >
            <div className="mb-3">
              <label className="form-label">Username</label>
              <input
                name="username"
                defaultValue={userToEdit.username}
                className="form-control"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                defaultValue={userToEdit.email}
                className="form-control"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Password (leave blank to keep unchanged)</label>
              <input type="password" name="password" className="form-control" />
            </div>

            <div className="mb-3">
              <label className="form-label">Role</label>
              <select
                name="role"
                defaultValue={userToEdit.role}
                className="form-select"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="engr">Engineer</option>
              </select>
            </div>

            <div className="d-flex justify-content-end">
              <button
                type="button"
                className="btn btn-secondary me-2"
                onClick={() => setUserToEdit(null)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default EditUsers;
