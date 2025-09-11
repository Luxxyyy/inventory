import { useEffect, useState } from "react";
import http from "../api/http";

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

const Logs = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    http.get("/logs")
      .then((res) => setLogs(res.data))
      .catch(() => setError("Failed to load logs."));
  }, []);

  return (
    <div className="container mt-4">
      <h2>Activity Logs</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead>
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
            {logs.map((log) => (
              <tr key={log.id}>
                <td>{log.User?.username}</td>
                <td>{log.User?.role}</td>
                <td>{log.action}</td>
                <td>{log.model}</td>
                <td>{log.description}</td>
                <td>{new Date(log.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Logs;
