// import './App.css';
import { useState, useEffect } from 'react';
import { Flex } from '@chakra-ui/react';
import Navbar from './components/Navbar';
import Map from './pages/Map';
import Itineraries from './pages/Itineraries';

const API_URL = 'https://json-server-backend-trek.adaptable.app';

function App() {
  // STATE VARIABLES:
  // Define state variables to store Locations (in GeoJson format) and Activities
  const [geoJson, setGeoJson] = useState(null);
  const [activity, setActivity] = useState(null);

  // ASYNC FUNCTIONS:
  // Define async function to GET location data (GeoJson) from mock API
  async function getGeoJson() {
    try {
      const response = await fetch(`${API_URL}/itinerary`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const jsonData = await response.json();

      // transform data into GeoJSON format
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
      // console.log(featureCollection);
      // Set the created GeoJSON to state
      setGeoJson(featureCollection);
    } catch (error) {
      console.error('There was a problem fetching the data:', error);
    }
  }

  // Define async function to GET activity data from mock API
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

  // Define async function to POST new activity data selected by the user to the mock API
  async function postActivity(locationId, selectedActivity) {
    try {
      const response = await fetch(`${API_URL}/activity`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itineraryId: locationId,
          title: selectedActivity,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to add activity');
      }
      // After updating, get updated activity data from the mock API
      getActivity();
    } catch (error) {
      console.error('There was a problem adding the acitivity:', error);
    }
  }

  // Define async function to DELETE activity data selected by the user from the mock API.
  async function deleteActivity(activityId) {
    try {
      const response = await fetch(`${API_URL}/activity/${activityId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete activity');
      }
      // After deletion, get updated activity data from the mock API.
      getActivity();
      console.log('These are the updated activities: ', activity);
    } catch (error) {
      console.error('There was a problem adding the acitivity:', error);
    }
  }
  // Define temporary function to DELETE (filter) location data from the mock API
  function handleDelete(id) {
    const updatedGeoJson = {
      type: 'FeatureCollection',
      features: geoJson.features.filter(
        location => location.properties.id !== id
      ),
    };
    setGeoJson(updatedGeoJson);
  }

  // USE EFFECT
  // We set this effect, so the mock API (l) will run only once, after the initial render
  useEffect(() => {
    getGeoJson();
    getActivity();
  }, []);

  return (
    <>
      <Navbar />
      <Flex direction="row" height="100vh">
        <Itineraries
          geoJson={geoJson}
          activity={activity}
          onDelete={handleDelete} // delete location. For the time being, this is only filtering the Json file
          postActivity={postActivity}
          deleteActivity={deleteActivity}
        />
        <Map geoJson={geoJson} />
      </Flex>
    </>
  );
}

export default App;
