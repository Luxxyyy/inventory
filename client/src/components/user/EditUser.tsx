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

  if (loading) return <p>Loading...</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container my-4" style={{ maxWidth: 900 }}>
      <h2 className="mb-4">Registered Users</h2>
      <div className="card shadow-sm">
        <div
          className="table-responsive"
          style={{ maxHeight: 400, overflowY: "auto" }}
        >
          <table className="table table-hover mb-0">
            <thead className="sticky-top user-header">
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td className="text-center">
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
    </div>
  );
};

export default EditUsers;