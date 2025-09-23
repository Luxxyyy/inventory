import React, { useState, useEffect, useMemo } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import Select from "react-select";
import { ShapeDetails } from "../../types/mapShape_type";
import http from "../../api/http";

type LegendItem = {
  id: number;
  label: string;
  type: "line" | "dot";
  color: string;
  cssClass: string;
};

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

  const [errors, setErrors] = useState<{
    [key in keyof Partial<ShapeDetails>]?: string;
  }>({});
  const [isSaving, setIsSaving] = useState(false);
  const [legendItems, setLegendItems] = useState<LegendItem[]>([]);
  const [loadingLegend, setLoadingLegend] = useState(true);

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData({ ...initialData });
      setErrors({});
    } else {
      setFormData({
        title: "",
        description: "",
        status: "",
        color: "",
        size: "",
      });
      setErrors({});
    }

    const fetchLegendItems = async () => {
      try {
        const response = await http.get<LegendItem[]>("/legend");
        setLegendItems(response.data);
      } catch (error) {
        console.error("Failed to fetch legend items for modal", error);
      } finally {
        setLoadingLegend(false);
      }
    };

    if (show) {
      fetchLegendItems();
    }
  }, [initialData, show]);

  const titleOptions = useMemo(() => {
    const titles = legendItems
      .filter((item) => item.type === "dot")
      .map((item) => item.label.split(" (")[0]);
    return [...new Set(titles)];
  }, [legendItems]);

  const sizeOptions = useMemo(() => {
    const sizes = legendItems
      .filter((item) => item.type === "line")
      .map((item) => item.label.split(" (")[0]);
    return [...new Set(sizes)];
  }, [legendItems]);

  const getColorByTitleOrSize = (title: string, size: string) => {
    const titleItem = title
      ? legendItems.find((i) => i.label.startsWith(title) && i.type === "dot")
      : null;

    const sizeItem = size
      ? legendItems.find((i) => i.label.startsWith(size) && i.type === "line")
      : null;

    if (titleItem && titleItem.color.toLowerCase() !== "#ffffff") {
      return titleItem.color;
    }

    if (sizeItem) {
      return sizeItem.color;
    }

    return "";
  };

  const updateField = (name: keyof ShapeDetails, value: string) => {
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };

      if (name === "title" || name === "size") {
        const title = newData.title ?? "";
        const size = newData.size ?? "";
        newData.color = getColorByTitleOrSize(title, size) || "";
      }

      return newData;
    });

    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    updateField(e.target.name as keyof ShapeDetails, e.target.value);
  };

  const handleSelectChange = (selected: any, name: keyof ShapeDetails) => {
    updateField(name, selected ? selected.value : "");
  };

  const validate = () => {
    const newErrors: { [key in keyof Partial<ShapeDetails>]?: string } = {};
    if (!formData.title) newErrors.title = "Valve / Equipment is required";
    if (!formData.status) newErrors.status = "Status is required";
    if (!formData.size) newErrors.size = "Pipe size is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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
    <Modal
      show={show}
      onHide={onClose}
      centered
      backdrop="static"
      keyboard={!isSaving}
    >
      <Modal.Header closeButton={!isSaving}>
        <Modal.Title>Shape Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loadingLegend ? (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: "200px" }}
          >
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : (
          <Form>
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

            <Form.Group className="mb-3" controlId="formSize">
              <Form.Label>Pipe Size</Form.Label>
              <Select
                options={toSelectOptions(sizeOptions)}
                value={
                  toSelectOptions(sizeOptions).find(
                    (opt) => opt.value === formData.size
                  ) || null
                }
                onChange={(selected) => handleSelectChange(selected, "size")}
                styles={customSelectStyles}
                placeholder="-- Select Size --"
                isClearable
                isDisabled={isSaving}
                aria-label="Pipe Size"
                className={errors.size ? "is-invalid" : ""}
              />
              {errors.size && (
                <div className="invalid-feedback d-block">{errors.size}</div>
              )}
            </Form.Group>

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
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose} disabled={isSaving}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={
            isSaving || !formData.title || !formData.status || !formData.size
          }
          aria-disabled={
            isSaving || !formData.title || !formData.status || !formData.size
          }
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
