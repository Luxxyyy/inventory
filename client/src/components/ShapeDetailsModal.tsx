import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { ShapeDetails } from "../types/mapShape_type";
import {
  getColorByTitleOrSize,
  titleOptions,
  sizeOptions,
} from "../utils/legendHelpers";

interface Props {
  show: boolean;
  onClose: () => void;
  onSave: (data: ShapeDetails) => void;
  initialData: ShapeDetails;
}

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

  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData });
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const newData = { ...prev, [name]: value };

      if (name === "title" || name === "size") {
        const autoColor = getColorByTitleOrSize(newData.title, newData.size);
        if (autoColor) newData.color = autoColor;
      }

      return newData;
    });
  };

  const handleSubmit = () => onSave(formData);

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Shape Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {/* Valve/Equipment */}
          <Form.Group className="mb-3">
            <Form.Label>Valve / Equipment</Form.Label>
            <Form.Select
              name="title"
              value={formData.title}
              onChange={handleChange}
            >
              <option value="">-- Select Equipment --</option>
              {titleOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {/* Pipe Size */}
          <Form.Group className="mb-3">
            <Form.Label>Pipe Size</Form.Label>
            <Form.Select
              name="size"
              value={formData.size}
              onChange={handleChange}
            >
              <option value="">-- Select Size --</option>
              {sizeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {/* Description */}
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </Form.Group>

          {/* Status */}
          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="">-- Select Status --</option>
              <option value="Active">Active</option>
              <option value="Non-Active">Non-Active</option>
              <option value="Broken">Broken</option>
            </Form.Select>
          </Form.Group>

          {/* Auto-filled Color */}
          <Form.Group className="mb-3">
            <Form.Label>Color (auto-filled)</Form.Label>
            <Form.Control type="text" name="color" value={formData.color} readOnly />
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
