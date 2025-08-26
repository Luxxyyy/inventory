import React, { useEffect, useState } from "react";
import { getPipeLogs } from "../../api/pipeLogs";

interface PipeHistoryModalProps {
  shapeId: number | null;
  show: boolean;
  onClose: () => void;
}

interface PipeLog {
  id: number;
  size: string;
  remarks: string | null;
  created_at: string;
}

const PipeHistoryModal: React.FC<PipeHistoryModalProps> = ({ shapeId, show, onClose }) => {
  const [logs, setLogs] = useState<PipeLog[]>([]);

  useEffect(() => {
    const fetchLogs = async () => {
      if (shapeId && show) {
        try {
          const data = await getPipeLogs(shapeId);
          setLogs(data);
        } catch (err) {
          console.error("Error fetching pipe logs:", err);
        }
      }
    };
    fetchLogs();
  }, [shapeId, show]);

  if (!show) return null;

  return (
    <div className={`modal fade ${show ? "show d-block" : ""}`} tabIndex={-1}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">

          <div className="modal-header">
            <h5 className="modal-title">Pipe History</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            {logs.length === 0 ? (
              <p>No history available.</p>
            ) : (
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Size</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id}>
                      <td>{new Date(log.created_at).toLocaleString()}</td>
                      <td>{log.size}</td>
                      <td>{log.remarks || ""}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Close</button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PipeHistoryModal;
