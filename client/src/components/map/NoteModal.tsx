import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { FaPaperclip, FaTimes } from "react-icons/fa";
import "../../design/noteModal.css";
import Resizer from "react-image-file-resizer";

interface NoteModalProps {
  show: boolean;
  onClose: () => void;
  onSave: (data: {
    title: string;
    message: string;
    image: string | null;
    fullImage: string | null;
    latitude: number;
    longitude: number;
  }) => void;
  initialCoords: { lat: number; lng: number } | null;
}

const NoteModal: React.FC<NoteModalProps> = ({
  show,
  onClose,
  onSave,
  initialCoords,
}) => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [image, setImage] = useState<string | null>(null); // This will hold the thumbnail
  const [fullImage, setFullImage] = useState<string | null>(null); // This will hold the full-res image

  useEffect(() => {
    if (show) {
      setTitle("");
      setMessage("");
      setImage(null);
      setFullImage(null); // Reset the new state
    }
  }, [show]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Step 1: Read the original image data to display and save for later.
      const reader = new FileReader();
      reader.onloadend = () => {
        setFullImage(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Step 2: Resize the image to 100x100 for the thumbnail.
      Resizer.imageFileResizer(
        file,
        100, // Max width for thumbnail
        100, // Max height for thumbnail
        "JPEG",
        80,
        0,
        (uri) => {
          setImage(uri as string); // Save the thumbnail to state
        },
        "base64"
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!initialCoords) return;

    onSave({
      title,
      message,
      image,
      fullImage, // <-- Pass the full-res image here
      latitude: initialCoords.lat,
      longitude: initialCoords.lng,
    });
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Create a New Note</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Message</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Image (Optional)</Form.Label>
            <div className="d-flex align-items-center">
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
                id="image-upload-input"
              />
              <Button
                variant="outline-secondary"
                onClick={() =>
                  document.getElementById("image-upload-input")?.click()
                }
              >
                <FaPaperclip /> Attach Image
              </Button>
              {image && (
                <div className="ms-3 image-preview-container">
                  {/* Display the thumbnail (100x100) here */}
                  <img src={image} alt="Preview" className="image-preview" />
                  <Button
                    variant="link"
                    className="remove-image-btn"
                    onClick={() => setImage(null)}
                  >
                    <FaTimes />
                  </Button>
                </div>
              )}
            </div>
          </Form.Group>
          {initialCoords && (
            <div className="text-muted small">
              Coordinates: Lat {initialCoords.lat.toFixed(6)}, Lng{" "}
              {initialCoords.lng.toFixed(6)}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Save Note
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default NoteModal;