import { useEffect, useState } from "react";
import http from "../api/http";

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
} from "@mui/material";

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

const ITEMS_PER_PAGE = 19;

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

  const totalPages = Math.ceil(logs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentLogs = logs.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="container my-4" style={{ maxWidth: "95%" }}>
      <h2 className="mb-3">Logs Management</h2>

      {error && <Alert severity="error">{error}</Alert>}

      <TableContainer component={Paper} sx={{ maxHeight: 750 }}>
        <Table stickyHeader size="small" aria-label="logs table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#17a2b8', color: 'white' }}>User</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#17a2b8', color: 'white' }}>Role</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#17a2b8', color: 'white' }}>Action</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#17a2b8', color: 'white' }}>Model</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#17a2b8', color: 'white' }}>Description</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#17a2b8', color: 'white' }}>Timestamp</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentLogs.map((log) => (
              <TableRow key={log.id} hover>
                <TableCell>{log.User?.username}</TableCell>
                <TableCell>{log.User?.role}</TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 'bold',
                      textTransform: 'capitalize',
                      color:
                        log.action === "create"
                          ? "success.main"
                          : log.action === "update"
                          ? "primary.main"
                          : log.action === "delete"
                          ? "error.main"
                          : "text.primary",
                    }}
                  >
                    {log.action}
                  </Typography>
                </TableCell>
                <TableCell>{log.model}</TableCell>
                <TableCell>{log.description}</TableCell>
                <TableCell>{new Date(log.created_at).toLocaleString()}</TableCell>
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
    </div>
  );
};

export default Logs;
