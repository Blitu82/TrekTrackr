import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Flex, useToast } from '@chakra-ui/react';
import Navbar from './components/Navbar';
import Itineraries from './pages/Itineraries';
import Map from './pages/Map';
import About from './pages/About';
import ErrorPage from './pages/ErrorPage';

const API_URL = 'https://json-server-backend-trek.adaptable.app';

function App() {
  // STATE VARIABLES:
  // Define state variables to store Locations and Activities.
  const [geoJson, setGeoJson] = useState(null);
  const [activity, setActivity] = useState(null);

  // Define variable to use Chakra UI confirmation toast when deleting locations (https://chakra-ui.com/docs/components/toast)
  const toast = useToast();

  // ASYNC FUNCTIONS:
  // 1. Define async function to GET location data from mock API.
  async function getGeoJson() {
    try {
      const response = await fetch(`${API_URL}/itinerary`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const jsonData = await response.json();

      // Transform data into GeoJSON format
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
      // Create a GeoJSON FeatureCollection
      const featureCollection = {
        type: 'FeatureCollection',
        features: features,
      };
      // Set the created GeoJSON to the state variable geoJson
      setGeoJson(featureCollection);
    } catch (error) {
      console.error('There was a problem fetching the location data:', error);
    }
  }

  // 2. Define async function to GET activity data from mock API
  async function getActivity() {
    try {
      const response = await fetch(`${API_URL}/activity`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const activityData = await response.json();
      // Set the activity data to state
      setActivity(activityData);
    } catch (error) {
      console.error('There was a problem fetching the activity data:', error);
    }
  }

  // 3. Define async function to POST new activity data to the mock API
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
        throw new Error('Network response was not ok');
      }
      // After updating, get updated activity data from the mock API
      getActivity();
    } catch (error) {
      console.error('There was a problem adding the activity:', error);
    }
  }

  // 4. Define async function to DELETE activity data from the mock API.
  async function deleteActivity(activityId) {
    try {
      const response = await fetch(`${API_URL}/activity/${activityId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // After deletion, get updated activity data from the mock API.
      getActivity();
    } catch (error) {
      console.error('There was a problem deleting the activity:', error);
    }
  }

  // 5. Define async function to DELETE location data from the mock API.
  // First define a function that returns an array with the ids of all the activities associated with a specific location.
  const getLocationActivities = locationId => {
    const activities = activity.filter(act => act.itineraryId === locationId);
    const activitiesId = [];
    for (const item of activities) {
      activitiesId.push(item.id);
    }
    return activitiesId;
  };

  async function deleteLocation(locationId) {
    try {
      const response = await fetch(`${API_URL}/itinerary/${locationId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Delete all the activities associated with that location.
      for (const id of getLocationActivities(locationId)) {
        deleteActivity(id);
      }

      //Display a Chakra UI confirmation toast (https://chakra-ui.com/docs/components/toast)
      toast({
        title: 'Location deleted',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // After deletion, get updated location data from the mock API.
      getGeoJson();
    } catch (error) {
      console.error('There was a problem deleting the location:', error);
    }
  }

  // USE EFFECT
  // We set this effect, so the mock API will run only once, after the initial render.
  useEffect(() => {
    getGeoJson();
    getActivity();
  }, []);

  return (
    <>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <Flex h="100vh" direction={{ base: 'column-reverse', md: 'row' }}>
              <Itineraries
                geoJson={geoJson}
                activity={activity}
                postActivity={postActivity}
                deleteActivity={deleteActivity}
                deleteLocation={deleteLocation}
              />
              <Map
                geoJson={geoJson}
                getGeoJson={getGeoJson}
                getActivity={getActivity}
              />
            </Flex>
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </>
  );
}

export default App;
