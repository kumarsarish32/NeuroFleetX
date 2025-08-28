import React, { useState, useEffect, useRef } from 'react';
import { Wrapper } from '@googlemaps/react-wrapper';

const render = (status) => {
  return <div className="panel"><h2>{status}</h2></div>;
};

function MapComponent({ vehicleLocation, center, zoom }) {
  const ref = useRef(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState({});

  useEffect(() => {
    if (ref.current && !map) {
      const newMap = new window.google.maps.Map(ref.current, {
        center,
        zoom,
        styles: [
          { elementType: 'geometry', stylers: [{ color: '#0b1220' }] },
          { elementType: 'labels.text.stroke', stylers: [{ color: '#0b1220' }] },
          { elementType: 'labels.text.fill', stylers: [{ color: '#9ca3af' }] },
          { featureType: 'poi', stylers: [{ visibility: 'off' }] },
          { featureType: 'transit', stylers: [{ visibility: 'off' }] },
          { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1f2937' }] },
          { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#9ca3af' }] },
        ],
        disableDefaultUI: true,
        zoomControl: true,
      });
      setMap(newMap);
    }
  }, [ref, map, center, zoom]);

  useEffect(() => {
    if (map && vehicleLocation) {
      const { id, latitude, longitude } = vehicleLocation;
      let marker = markers[id];

      if (!marker) {
        marker = new window.google.maps.Marker({
          position: { lat: latitude, lng: longitude },
          map: map,
          title: `Vehicle ${id}`,
          icon: {
            path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            scale: 5,
            fillColor: '#22d3ee',
            fillOpacity: 1,
            strokeWeight: 1,
            strokeColor: '#06b6d4',
          },
        });
        setMarkers(prevMarkers => ({ ...prevMarkers, [id]: marker }));
      } else {
        marker.setPosition({ lat: latitude, lng: longitude });
      }
    }
  }, [map, vehicleLocation, markers]);

  return <div ref={ref} style={{ width: '100%', height: 420, borderRadius: 14 }} />;
}

function VehicleMap() {
  const [vehicleLocation, setVehicleLocation] = useState(null);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3001');

    ws.onopen = () => {
      console.log('Connected to WebSocket server');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'vehicle_update') {
        setVehicleLocation({
          id: data.id,
          latitude: data.latitude,
          longitude: data.longitude,
          speed: data.speed
        });
      }
    };

    ws.onclose = () => {
      console.log('Disconnected from WebSocket server');
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      ws.close();
    };
  }, []);

  const center = vehicleLocation ?
    { lat: vehicleLocation.latitude, lng: vehicleLocation.longitude } :
    { lat: 28.6139, lng: 77.2090 };
  const zoom = 12;

  return (
    <div className="panel">
      <h2>Live Vehicle Map</h2>
      <Wrapper apiKey={"AIzaSyCZ8IUseEHZsIhMqTgunyl5Qg10tFq6ToY"} render={render}>
        <MapComponent vehicleLocation={vehicleLocation} center={center} zoom={zoom} />
      </Wrapper>
    </div>
  );
}

export default VehicleMap;