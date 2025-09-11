import { useEffect, useState } from "react";
import http from "../api/http";
import "../design/logs.css";

type LogEntry = {
  id: number;
  action: "create" | "update" | "delete";
  model: string;
  description: string;
  created_at: string;
  User: {
    username: string;
    role: string;
  };
};

const ITEMS_PER_PAGE = 15;

const Logs = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    http
      .get("/logs")
      .then((res) => setLogs(res.data))
      .catch(() => setError("Failed to load logs."));
  }, []);

  // Calculate pagination data
  const totalPages = Math.ceil(logs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentLogs = logs.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="container-fluid mt-4">
      <h2>Activity Logs</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="logs-header">
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Action</th>
              <th>Model</th>
              <th>Description</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {currentLogs.map((log) => (
              <tr key={log.id}>
                <td>{log.User?.username}</td>
                <td>{log.User?.role}</td>
                <td
                  className={`text-capitalize fw-bold ${
                    log.action === "delete"
                      ? "text-danger"
                      : log.action === "update"
                      ? "text-primary"
                      : log.action === "create"
                      ? "text-success"
                      : ""
                  }`}
                >
                  {log.action}
                </td>
                <td>{log.model}</td>
                <td>{log.description}</td>
                <td>{new Date(log.created_at).toLocaleString()}</td>
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

export default Logs;
