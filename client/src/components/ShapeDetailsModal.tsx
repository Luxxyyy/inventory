import React, { useState, useEffect } from "react";

interface Props {
  show: boolean;
  onClose: () => void;
  onSave: (data: { title: string; description: string; status: string; color: string; }) => void;
  initialData: { title: string; description: string; status: string; color: string; };
}

const ShapeDetailsModal: React.FC<Props> = ({ show, onClose, onSave, initialData }) => {
  const [form, setForm] = useState(initialData);

  useEffect(() => { if (show) setForm(initialData); }, [show, initialData]);

  if (!show) return null;

  return (
    <div className="modal show d-block" tabIndex={-1} style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h5 className="modal-title">Shape Details</h5>
            <button className="btn-close" onClick={onClose} />
          </div>
          <div className="modal-body">
            {["title", "description", "status", "color"].map((field) => (
              <div key={field} className="mb-2">
                <label className="form-label">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                <input
                  className="form-control"
                  value={(form as any)[field] || ""}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                />
              </div>
            ))}
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={() => onSave(form)}>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShapeDetailsModal;
