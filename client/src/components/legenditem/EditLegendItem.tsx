import React, { useState, useEffect } from "react";
import { Form, Button, Spinner, Alert } from "react-bootstrap";
import {
  getLegendItems,
  updateLegendItem,
  deleteLegendItem,
} from "../../api/legend_api";
import Modal from "../Modal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../design/balangay.css";

type LegendItem = {
  id: number;
  label: string;
  type: "line" | "dot";
  color: string;
  cssClass: string;
};

const EditLegendItem: React.FC = () => {
  const [legendItems, setLegendItems] = useState<LegendItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedItem, setSelectedItem] = useState<LegendItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<LegendItem | null>(null);
  const [editForm, setEditForm] = useState({
    label: "",
    type: "line",
    color: "#ffffff",
    cssClass: "",
  });
  const [modalError, setModalError] = useState("");

  const fetchLegendItems = async () => {
    try {
      setLoading(true);
      const data = await getLegendItems();
      const items: LegendItem[] = data;
      setLegendItems(items);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch legend items");
      toast.error("Failed to fetch legend items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLegendItems();
  }, []);

  const openEditModal = (item: LegendItem) => {
    setSelectedItem(item);
    setEditForm({
      label: item.label,
      type: item.type,
      color: item.color,
      cssClass: item.cssClass,
    });
    setModalError("");
  };

  const closeModal = () => {
    setSelectedItem(null);
    setModalError("");
  };

  const handleInputChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    const { label, type, color, cssClass } = editForm;

    if (!label || !type) {
      setModalError("Label and Color are required.");
      return;
    }

    try {
      if (selectedItem?.id) {
        await updateLegendItem(selectedItem.id, label, type, color, cssClass);
      }

      toast.success("Legend item updated successfully");
      closeModal();
      fetchLegendItems();
    } catch (err) {
      console.error(err);
      setModalError("Failed to update legend item");
      toast.error("Failed to update legend item");
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete?.id) return;

    try {
      await deleteLegendItem(itemToDelete.id);
      toast.success("Legend item deleted successfully");
      setItemToDelete(null);
      fetchLegendItems();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete legend item");
    }
  };

  return (
    <div className="container mx-auto my-4" style={{ maxWidth: 900 }}>
      {loading ? (
        <div className="d-flex justify-content-center my-5">
          <Spinner animation="border" role="status" />
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <div className="card shadow-sm">
          <div
            className="table-responsive"
            style={{ maxHeight: 400, overflowY: "auto" }}
          >
            <table className="table table-hover mb-0">
              <thead className="sticky-top balangay-header">
                <tr>
                  <th>Label</th>
                  <th>Type</th>
                  <th>Color</th>
                  <th>CSS Class</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {legendItems.map((item) => (
                  <tr key={item.id}>
                    <td>{item.label}</td>
                    <td>{item.type}</td>
                    <td>
                      <div
                        style={{
                          width: "20px",
                          height: "20px",
                          backgroundColor: item.color,
                          border: "1px solid #ccc",
                        }}
                      />
                    </td>
                    <td>{item.cssClass || "-"}</td>
                    <td className="text-center">
                      <button
                        className="btn btn-sm btn-success text-white me-2"
                        onClick={() => openEditModal(item)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger text-white"
                        onClick={() => setItemToDelete(item)}
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
      )}
      {selectedItem && (
        <Modal onClose={closeModal} title="Edit Legend Item">
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Label</Form.Label>
              <Form.Control
                name="label"
                type="text"
                value={editForm.label}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Type</Form.Label>
              <Form.Select
                name="type"
                value={editForm.type}
                onChange={handleInputChange}
              >
                <option value="line">Line</option>
                <option value="dot">Dot</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Color</Form.Label>
              <Form.Control
                name="color"
                type="color"
                value={editForm.color}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>CSS Class</Form.Label>
              <Form.Control
                name="cssClass"
                type="text"
                value={editForm.cssClass}
                onChange={handleInputChange}
              />
            </Form.Group>
            {modalError && <Alert variant="danger">{modalError}</Alert>}
            <div className="d-flex justify-content-end">
              <Button
                variant="primary"
                onClick={closeModal}
                className="me-2 text-white"
              >
                Cancel
              </Button>
              <Button
                variant="success"
                onClick={handleUpdate}
                className="text-white"
              >
                Save
              </Button>
            </div>
          </Form>
        </Modal>
      )}
      {itemToDelete && (
        <Modal onClose={() => setItemToDelete(null)} title="Confirm Delete">
          <p>
            Are you sure you want to delete{" "}
            <strong>{itemToDelete.label}</strong>?
          </p>
          <div className="d-flex justify-content-end">
            <Button
              variant="primary"
              onClick={() => setItemToDelete(null)}
              className="me-2"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              className="text-white"
            >
              Confirm Delete
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default EditLegendItem;