import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

function VehicleForm({ onVehicleAdded }) {
  const { currentUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    licensePlate: '',
    status: 'available'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      alert("Please log in to add a new vehicle.");
      return;
    }

    try {
      const token = await currentUser.getIdToken();
      await axios.post('http://localhost:3001/api/vehicles', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFormData({ make: '', model: '', licensePlate: '', status: 'available' });
      if (onVehicleAdded) onVehicleAdded();
    } catch (error) {
      console.error('There was an error creating the vehicle!', error);
      alert('Failed to add vehicle. Check your permissions.');
    }
  };

  return (
    <div className="panel">
      <h2>Add New Vehicle</h2>
      <form onSubmit={handleSubmit} className="row" style={{ flexDirection: 'column', gap: 12 }}>
        <input
          className="input"
          type="text"
          name="make"
          placeholder="Make"
          value={formData.make}
          onChange={handleChange}
          required
        />
        <input
          className="input"
          type="text"
          name="model"
          placeholder="Model"
          value={formData.model}
          onChange={handleChange}
          required
        />
        <input
          className="input"
          type="text"
          name="licensePlate"
          placeholder="License Plate"
          value={formData.licensePlate}
          onChange={handleChange}
          required
        />
        <select className="select" name="status" value={formData.status} onChange={handleChange}>
          <option value="available">Available</option>
          <option value="on-trip">On Trip</option>
          <option value="maintenance">Maintenance</option>
        </select>
        <div className="row">
          <button className="button" type="submit">Add Vehicle</button>
        </div>
      </form>
    </div>
  );
}

export default VehicleForm;