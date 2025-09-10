import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import Select from "react-select";
import { ShapeDetails } from "../../types/mapShape_type";
import {
  getColorByTitleOrSize,
  titleOptions,
  sizeOptions,
} from "../../utils/legendHelpers";

interface Props {
  show: boolean;
  onClose: () => void;
  onSave: (data: ShapeDetails) => Promise<void> | void;
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

  const [errors, setErrors] = useState<{ [key in keyof Partial<ShapeDetails>]?: string }>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData });
      setErrors({});
    }
  }, [initialData, show]);

  // DRY update function for fields
  const updateField = (name: keyof ShapeDetails, value: string) => {
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };

      // Update color automatically if title or size changed
      if (name === "title" || name === "size") {
        newData.color = getColorByTitleOrSize(newData.title, newData.size) || "";
      }

      return newData;
    });

    // Clear error on change
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  // Handles input and textarea changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    updateField(e.target.name as keyof ShapeDetails, e.target.value);
  };

  // Handles react-select changes
  const handleSelectChange = (selected: any, name: keyof ShapeDetails) => {
    updateField(name, selected ? selected.value : "");
  };

  // Validation function, returns true if valid
  const validate = () => {
    const newErrors: { [key in keyof Partial<ShapeDetails>]?: string } = {};
    if (!formData.title) newErrors.title = "Valve / Equipment is required";
    if (!formData.status) newErrors.status = "Status is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit handler supports async onSave
  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      setIsSaving(true);
      await onSave(formData);
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  // Helper to convert string options to react-select format
  const toSelectOptions = (options: string[]) =>
    options.map((opt) => ({ value: opt, label: opt }));

  const customSelectStyles = {
    menuList: (provided: any) => ({
      ...provided,
      maxHeight: 200,
      overflowY: "auto",
    }),
  };

  return (
    <Modal show={show} onHide={onClose} centered backdrop="static" keyboard={!isSaving}>
      <Modal.Header closeButton={!isSaving}>
        <Modal.Title>Shape Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {/* Valve / Equipment */}
          <Form.Group className="mb-3" controlId="formTitle">
            <Form.Label>Valve / Equipment</Form.Label>
            <Select
              options={toSelectOptions(titleOptions)}
              value={
                formData.title
                  ? { value: formData.title, label: formData.title }
                  : null
              }
              onChange={(selected) => handleSelectChange(selected, "title")}
              styles={customSelectStyles}
              placeholder="-- Select Equipment --"
              isClearable
              isDisabled={isSaving}
              aria-label="Valve or Equipment"
              className={errors.title ? "is-invalid" : ""}
            />
            {errors.title && (
              <div className="invalid-feedback d-block">{errors.title}</div>
            )}
          </Form.Group>

          {/* Pipe Size */}
          <Form.Group className="mb-3" controlId="formSize">
            <Form.Label>Pipe Size</Form.Label>
            <Select
              options={toSelectOptions(sizeOptions)}
              value={
                formData.size
                  ? { value: formData.size, label: formData.size }
                  : null
              }
              onChange={(selected) => handleSelectChange(selected, "size")}
              styles={customSelectStyles}
              placeholder="-- Select Size --"
              isClearable
              isDisabled={isSaving}
              aria-label="Pipe Size"
            />
          </Form.Group>

          {/* Description */}
          <Form.Group className="mb-3" controlId="formDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleChange}
              disabled={isSaving}
              aria-label="Description"
            />
          </Form.Group>

          {/* Status */}
          <Form.Group className="mb-3" controlId="formStatus">
            <Form.Label>Status</Form.Label>
            <Form.Select
              name="status"
              value={formData.status}
              onChange={handleChange}
              disabled={isSaving}
              aria-label="Status"
              isInvalid={!!errors.status}
            >
              <option value="">-- Select Status --</option>
              <option value="Active">Active</option>
              <option value="Non-Active">Non-Active</option>
              <option value="Broken">Broken</option>
            </Form.Select>
            {errors.status && (
              <Form.Control.Feedback type="invalid">
                {errors.status}
              </Form.Control.Feedback>
            )}
          </Form.Group>

          {/* Auto-filled Color */}
          <Form.Group className="mb-3" controlId="formColor">
            <Form.Label>Color (auto-filled)</Form.Label>
            <div className="d-flex align-items-center gap-2">
              <Form.Control
                type="text"
                name="color"
                value={formData.color}
                readOnly
                disabled
                style={{ maxWidth: 120 }}
                aria-label="Color"
              />
              <div
                aria-hidden="true"
                style={{
                  width: 24,
                  height: 24,
                  backgroundColor: formData.color || "transparent",
                  border: "1px solid #ccc",
                  borderRadius: 4,
                }}
                title={formData.color || "No color"}
              />
            </div>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose} disabled={isSaving}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={isSaving || !formData.title || !formData.status}
          aria-disabled={isSaving || !formData.title || !formData.status}
        >
          {isSaving ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />{" "}
              Saving...
            </>
          ) : (
            "Save"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ShapeDetailsModal;
