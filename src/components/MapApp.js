import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, useMapEvents } from 'react-leaflet';
import { Search, MapPin, Layers, Navigation, Trash, Info } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Leaflet icon workaround
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
});

const MapEvents = ({ onLocationFound }) => {
  useMapEvents({
    click(e) {
      onLocationFound(e.latlng);
    },
  });
  return null;
};

const RecenterAutomatically = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 13);
  }, [lat, lng]);
  return null;
};

const MacOSButton = ({ children, onClick, className = '' }) => (
  <button 
    className={`px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-md text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 ${className}`}
    onClick={onClick}
  >
    {children}
  </button>
);

const MapApp = () => {
  const [center, setCenter] = useState({ lat: 51.505, lng: -0.09 });
  const [markers, setMarkers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [mapLayer, setMapLayer] = useState('streets');
  const [route, setRoute] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);

  const handleAddMarker = useCallback((location) => {
    setMarkers(prevMarkers => [...prevMarkers, { ...location, id: Date.now() }]);
  }, []);

  const handleSearch = useCallback(async () => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}`);
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        setCenter({ lat: parseFloat(lat), lng: parseFloat(lon) });
      }
    } catch (error) {
      console.error('Error searching for location:', error);
    }
  }, [searchQuery]);

  const handleRouting = useCallback(async () => {
    if (markers.length >= 2) {
      const start = markers[markers.length - 2];
      const end = markers[markers.length - 1];
      try {
        const response = await fetch(`https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`);
        const data = await response.json();
        if (data.routes && data.routes.length > 0) {
          setRoute(data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]));
        }
      } catch (error) {
        console.error('Error fetching route:', error);
      }
    }
  }, [markers]);

  const handleClearMarkers = useCallback(() => {
    setMarkers([]);
    setRoute(null);
  }, []);

  const handleMarkerClick = useCallback((marker) => {
    setSelectedMarker(marker);
  }, []);

  const handleClosePopup = useCallback(() => {
    setSelectedMarker(null);
  }, []);

  return (
    <div className="flex flex-col h-full bg-gray-100 rounded-lg overflow-hidden shadow-lg">
      {/* Top toolbar */}
      <div className="flex items-center p-4 bg-white border-b border-gray-200">
        <input 
          className="flex-grow mr-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search location..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <MacOSButton onClick={handleSearch} className="mr-2">
          <Search className="h-4 w-4" />
        </MacOSButton>
        <MacOSButton onClick={() => setMapLayer(layer => layer === 'streets' ? 'satellite' : 'streets')} className="mr-2">
          <Layers className="h-4 w-4" />
        </MacOSButton>
        <MacOSButton onClick={handleRouting} className="mr-2">
          <Navigation className="h-4 w-4" />
        </MacOSButton>
        <MacOSButton onClick={handleClearMarkers}>
          <Trash className="h-4 w-4" />
        </MacOSButton>
      </div>
      
      {/* Map container */}
      <div className="flex-grow relative">
        <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url={mapLayer === 'streets' 
              ? "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              : "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            }
            attribution={mapLayer === 'streets' 
              ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              : 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
            }
          />
          {markers.map((marker) => (
            <Marker key={marker.id} position={marker} eventHandlers={{ click: () => handleMarkerClick(marker) }}>
              <Popup>
                <div>
                  Latitude: {marker.lat.toFixed(6)}<br />
                  Longitude: {marker.lng.toFixed(6)}
                </div>
              </Popup>
            </Marker>
          ))}
          {route && <Polyline positions={route} color="blue" />}
          <MapEvents onLocationFound={handleAddMarker} />
          <RecenterAutomatically lat={center.lat} lng={center.lng} />
        </MapContainer>
      </div>
      
      {/* Info panel */}
      {selectedMarker && (
        <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg">
          <h3 className="font-bold mb-2">Marker Information</h3>
          <p>Latitude: {selectedMarker.lat.toFixed(6)}</p>
          <p>Longitude: {selectedMarker.lng.toFixed(6)}</p>
          <MacOSButton onClick={handleClosePopup} className="mt-2">
            Close
          </MacOSButton>
        </div>
      )}

      {/* Footer */}
      <div className="flex justify-between items-center p-4 bg-white border-t border-gray-200">
        <div className="text-sm text-gray-500">
          {markers.length} marker{markers.length !== 1 ? 's' : ''} placed
        </div>
        <div className="text-sm text-gray-500">
          {mapLayer === 'streets' ? 'Street Map' : 'Satellite Map'}
        </div>
      </div>
    </div>
  );
};

export default MapApp;