import './App.css';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Map from './pages/Map';
import Itineraries from './pages/Itineraries';

const API_URL = 'https://json-server-backend-trek.adaptable.app';

function App() {
  const [geoData, setGeoData] = useState(null);

  async function getGeoData() {
    try {
      const response = await fetch(`${API_URL}/itinerary`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const jsonData = await response.json();

      // Transform data into GeoJSON
      const features = jsonData.map(item => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [item.longitude, item.latitude],
        },
        properties: {
          id: item.id,
          name: item.name,
          address: item.address,
        },
      }));

      // Create a GeoJSON FeatureCollection from the features
      const featureCollection = {
        type: 'FeatureCollection',
        features: features,
      };

      // Set the created GeoJSON to state
      setGeoData(featureCollection);
    } catch (error) {
      console.error('There was a problem fetching the data:', error);
    }
  }

  useEffect(() => {
    getGeoData();
  }, []);

  return (
    <>
      <div className="nav-bar">
        <Navbar />
      </div>
      <div className="app-container">
        <div className="left-panel">
          <Itineraries geoData={geoData} />
        </div>
        <div className="right-panel">
          <Map geoData={geoData} />
        </div>
      </div>
    </>
  );
}

export default App;
