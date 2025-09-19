import React, { useState } from "react";
import { Row, Col } from "react-bootstrap";
import CreateLegendItem from "../components/legenditem/CreateLegendItem";
import EditLegendItem from "../components/legenditem/EditLegendItem";
import "../design/legend.css"

const Legend = () => {
  const [updateKey, setUpdateKey] = useState(0);

  const handleUpdate = () => {
    setUpdateKey(prevKey => prevKey + 1);
  };

  return (
    <div className="container-fluid my-4">
      <Row>
        <Col md={6}>
          <div className="mb-4">
            <h2 className="mb-3 fw">Add New Legend Item</h2>
            <CreateLegendItem onSave={handleUpdate} />
          </div>
        </Col>
        <Col md={6}>
          <div className="mb-4">
            <h2 className="mb-3 fw">Edit Legend Items</h2>
            <EditLegendItem key={updateKey} />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Legend;