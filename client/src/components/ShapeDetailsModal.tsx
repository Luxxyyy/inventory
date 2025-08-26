import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

export interface ShapeDetails {
  title: string;
  description: string;
  status: string;
  color: string;
  size: string;
}

interface Props {
  show: boolean;
  onClose: () => void;
  onSave: (data: ShapeDetails) => void;
  initialData: ShapeDetails;
}

// ---- Component ----
const ShapeDetailsModal: React.FC<Props> = ({
  show,
  onClose,
  onSave,
  initialData,
}) => {
  const [formData, setFormData] = useState<ShapeDetails>({
    title: "",
    description: "",
    status: "",
    color: "",
    size: "",
  });

  // Load initialData when modal opens
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        status: initialData.status || "",
        color: initialData.color || "",
        size: initialData.size || "",
      });
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Shape Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter title"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter description"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Control
              type="text"
              name="status"
              value={formData.status}
              onChange={handleChange}
              placeholder="Enter status"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Color</Form.Label>
            <Form.Control
              type="text"
              name="color"
              value={formData.color}
              onChange={handleChange}
              placeholder="Enter color (e.g. red, #ff0000)"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Size</Form.Label>
            <Form.Control
              type="text"
              name="size"
              value={formData.size}
              onChange={handleChange}
              placeholder="Enter size"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ShapeDetailsModal;
