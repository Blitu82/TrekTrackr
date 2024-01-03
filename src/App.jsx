// import './App.css';
import { useState, useEffect } from 'react';
import { Flex } from '@chakra-ui/react';
import Navbar from './components/Navbar';
import Map from './pages/Map';
import Itineraries from './pages/Itineraries';

const API_URL = 'https://json-server-backend-trek.adaptable.app';

function App() {
  const [geoJson, setGeoJson] = useState(null);
  const [activity, setActivity] = useState(null);

  async function getGeoJson() {
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

      console.log(featureCollection);

      // Set the created GeoJSON to state
      setGeoJson(featureCollection);
    } catch (error) {
      console.error('There was a problem fetching the data:', error);
    }
  }

  async function getActivity() {
    try {
      const response = await fetch(`${API_URL}/activity`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const activityData = await response.json();
      // console.log(activityData);

      // Set the activity data to state
      setActivity(activityData);
    } catch (error) {
      console.error('There was a problem fetching the data:', error);
    }
  }

  useEffect(() => {
    getGeoJson();
    getActivity();
  }, []);

  function handleDelete(id) {
    const updatedGeoJson = {
      type: 'FeatureCollection',
      features: geoJson.features.filter(
        location => location.properties.id !== id
      ),
    };
    setGeoJson(updatedGeoJson);
  }

  const handleEdit = id => {
    // To be edited
    console.log(`Edit item with ID: ${id}`);
  };

  return (
    <>
      <Navbar />
      <Flex direction="row" height="100vh">
        <Itineraries
          geoJson={geoJson}
          activity={activity}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
        <Map geoJson={geoJson} />
      </Flex>
    </>
  );
}

export default App;
