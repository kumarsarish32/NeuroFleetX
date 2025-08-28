import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

function VehicleList({ refreshTrigger, onEdit }) {
  const { currentUser, role } = useContext(AuthContext);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        if (!currentUser) return;
        const token = await currentUser.getIdToken();
        const response = await axios.get('http://localhost:3001/api/vehicles', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setVehicles(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch vehicles. Please check the backend server and ensure you are authorized.');
        setLoading(false);
        console.error(err);
      }
    };
    fetchVehicles();
  }, [refreshTrigger, currentUser]);

  if (loading) return <div className="panel">Loading vehicles...</div>;
  if (error) return <div className="panel">Error: {error}</div>;

  return (
    <div className="panel">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <h2>Vehicle List</h2>
        <span className="badge">Total: {vehicles.length}</span>
      </div>
      <ul className="list" style={{ marginTop: 12 }}>
        {vehicles.map(vehicle => (
          <li key={vehicle.id}>
            <div>
              <strong>{vehicle.make} {vehicle.model}</strong> - {vehicle.licensePlate} <span className="badge">{vehicle.status}</span>
            </div>
            <div className="row">
              {role === 'admin' && (
                <button className="button outline" onClick={() => onEdit(vehicle)}>Edit</button>
              )}
              {role === 'admin' && (
                <button className="button danger" onClick={() => {
                  if (window.confirm(`Are you sure you want to delete ${vehicle.make} ${vehicle.model}?`)) {
                    const deleteVehicle = async (id) => {
                      try {
                        const token = await currentUser.getIdToken();
                        await axios.delete(`http://localhost:3001/api/vehicles/${id}`, {
                          headers: { Authorization: `Bearer ${token}` }
                        });
                        setVehicles(vehicles.filter(v => v.id !== id));
                      } catch (error) {
                        console.error('Error deleting vehicle:', error);
                        setError('Failed to delete vehicle. Check permissions.');
                      }
                    };
                    deleteVehicle(vehicle.id);
                  }
                }}>Delete</button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default VehicleList;