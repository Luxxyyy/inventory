import { useState } from 'react';

function Fruit() {
  const [fruitName, setFruitName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async () => {
    if (!fruitName) {
      alert('Fruit name is required!');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/fruits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fruit_name: fruitName,
          description: description,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to insert fruit');
      }

      const data = await response.json();
      alert(`Inserted: ${data.fruit_name}`);
      
      // Clear the form
      setFruitName('');
      setDescription('');
    } catch (error) {
      console.error('Error inserting fruit:', error);
      alert('Something went wrong!');
    }
  };

  return (
    <div>
      <div className="mb-3" id="input-box">
        <label htmlFor="formGroupExampleInput" className="form-label">Fruit Name</label>
        <input
          type="text"
          className="form-control"
          id="formGroupExampleInput"
          placeholder="Enter Fruit"
          value={fruitName}
          onChange={(e) => setFruitName(e.target.value)}
        />
      </div>
      <div className="mb-3" id="input-box">
        <label htmlFor="formGroupExampleInput2" className="form-label">Description</label>
        <input
          type="text"
          className="form-control"
          id="formGroupExampleInput2"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <button type="button" className="btn btn-primary m-1" onClick={handleSubmit}>
        Add
      </button>
    </div>
  );
}

export default Fruit;
