import React, { useState, useContext } from 'react';
import { AuthProvider, AuthContext } from './AuthContext';
import VehicleList from './VehicleList';
import VehicleForm from './VehicleForm';
import UpdateForm from './UpdateForm';
import VehicleMap from './VehicleMap';
import AuthComponent from './AuthComponent';
import AdminPanel from './AdminPanel';

function AppContent() {
  const [refreshList, setRefreshList] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const { currentUser, role } = useContext(AuthContext);

  const handleVehicleAdded = () => {
    setRefreshList(prev => !prev);
  };

  const handleEdit = (vehicle) => {
    setEditingVehicle(vehicle);
  };

  const handleUpdateComplete = () => {
    setEditingVehicle(null);
    setRefreshList(prev => !prev);
  };

  return (
    <div className="container">
      <div className="header">
        <h1 className="h1">NeuroFleetX</h1>
        {currentUser && <span className="badge">Signed In</span>}
      </div>

      <div style={{ height: 16 }} />

      <AuthComponent />

      {currentUser ? (
        <div className="grid">
          <div>
            {role === 'admin' && (
              <>
                {editingVehicle ? (
                  <UpdateForm vehicle={editingVehicle} onUpdateComplete={handleUpdateComplete} />
                ) : (
                  <VehicleForm onVehicleAdded={handleVehicleAdded} />
                )}
                <AdminPanel />
              </>
            )}
            <VehicleMap />
          </div>
          <div>
            <VehicleList refreshTrigger={refreshList} onEdit={handleEdit} />
          </div>
        </div>
      ) : (
        <div className="panel"><p>Please log in to view and manage vehicles.</p></div>
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;