import { useState, useEffect } from "react";
import Modal from "./Modal";
import { getFruits } from "../api/Fruits";

function ListGroup() {
  const [items, setItems] = useState<string[]>([]);
  const [description, setDescription] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showModal, setShowModal] = useState(false);
  
  const handleShowModal = (index: number) => {
    setSelectedIndex(index);
    setShowModal(true);
  };

  useEffect(() => {
    getFruits()
        .then((data) => {
            setItems(data.fruits);
            setDescription(data.desc)})
        .catch((err) => {
            console.error("Error fetching fruits:", err);
        setItems([]), setDescription([]);
      });
  }, []);

  return (
    <>
      {items.length === 0 && <p>Loading fruits...</p>}

      <div className="container mt-4">
        <div
          className="d-grid gap-4"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            display: "grid",
          }}
        >
          {items.map((item, index) => (
            <div key={index} className="card">
              <div
                className="card-img-top d-flex align-items-center justify-content-center"
                style={{
                  height: "150px",
                  backgroundColor: "#f8f9fa",
                }}
              >
                <span>Image</span>
              </div>
              <div className="card-body text-dark">
                <h5 className="card-title">{item}</h5>
                <p className="card-text">{description[index] || "No description"}</p>
                <button
                  className="btn btn-primary"
                  onClick={() => handleShowModal(index)}
                >
                  Show Modal
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <Modal item={items[selectedIndex]} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}

export default ListGroup;
