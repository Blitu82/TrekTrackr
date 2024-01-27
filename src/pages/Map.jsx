import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { useToast, Box, useColorModeValue } from '@chakra-ui/react';

// Code based on https://medium.com/@gisjohnecs/part-1-web-mapping-with-mapbox-gl-react-js-7d11b50d86ec

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_KEY;
const API_URL = 'https://json-server-backend-trek.adaptable.app';

function Map({ geoJson, getGeoJson, getActivity }) {
  // STATE VARIABLES:
  const mapContainer = useRef(null);
  const map = useRef(null);
  // State variables that will store the initial Latitude, Longitude and Zoom level.
  const [lng, setLng] = useState(-9.1426);
  const [lat, setLat] = useState(38.7369);
  const [zoom, setZoom] = useState(11);
  // State variable that will store the locations searched by the user
  const [searched, setSearched] = useState({});
  // State variable that will store the route between locations
  const [route, setRoute] = useState(null);
  // Define variable to use Chakra UI confirmation toast when adding locations (https://chakra-ui.com/docs/components/toast)https://chakra-ui.com/docs/components/toast
  const toast = useToast();

  // ASYNC FUNCTIONS:
  // 1. Define async function to POST new location data to the mock API
  async function postLocation(searched) {
    try {
      const response = await fetch(`${API_URL}/itinerary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searched),
      });

      //Display a Chakra UI confirmation toast.
      toast({
        title: 'Location added',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      if (!response.ok) {
        throw new Error('Failed to add location');
      }
      getGeoJson();
      getActivity();
    } catch (error) {
      console.error('There was a problem adding the location:', error);
    }
  }
  // 2. Define async function to GET the route information from the MapBox API. Based on: https://www.youtube.com/watch?v=XsGWdXnpU8k
  async function getRoute() {
    try {
      if (geoJson.features.length < 2 || !geoJson) {
        console.log('No features found in geoJson');
        setRoute(null);
        return;
      }
      const coordinates = geoJson.features.map(
        feature => feature.geometry.coordinates
      );
      const waypoints = coordinates.map(coord => coord.join(',')).join(';');
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/walking/${waypoints}?alternatives=false&geometries=geojson&language=en&overview=full&steps=true&access_token=${mapboxgl.accessToken}`
      );

      if (!response.ok) {
        throw new Error(`Error fetching route. Status: ${response.status}`);
      }
      const route = await response.json();
      const coords = route.routes[0].geometry.coordinates;
      setRoute({
        type: 'FeatureCollection',
        features: [
          {
            type: 'feature',
            geometry: {
              type: 'LineString',
              coordinates: coords,
            },
          },
        ],
      });
    } catch (error) {
      console.error('There was a problem fetching the route', error);
    }
  }

  // Define constant that will be used to toggle the map style between light / dark mode.
  const secondaryMapStyle = useColorModeValue('light', 'dark');
  let mapStyle = ' ';
  if (secondaryMapStyle === 'light') {
    mapStyle = 'mapbox://styles/mapbox/streets-v12';
  } else {
    mapStyle = 'mapbox://styles/mapbox/dark-v11';
  }

  // USE EFFECT # 1
  // This effect initializes and displays the MapBox map, including adding controls, layers, and handling user interactions.
  useEffect(() => {
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: mapStyle,
      // type: 'poi',
      center: [lng, lat],
      zoom: zoom,
    });

    // Add the Search bar to the map (MapBox Geocoder API)
    map.current.addControl(
      new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
        placeholder: '    Search Bar',
      }).on('result', function (result) {
        let search = result;
        let searchJson = {
          name: search.result.text_en,
          address: search.result.properties.address,
          latitude: search.result.geometry.coordinates[1],
          longitude: search.result.geometry.coordinates[0],
        };
        setSearched(searchJson);
      }),
      'top-left'
    );

    // Add our navigation control (the +/- zoom buttons)
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Map onload event
    map.current.on('load', () => {
      map.current.resize();

      // Add location data to the map
      map.current.addSource('itineraries', {
        type: 'geojson',
        data: geoJson,
      });

      // Add route data to the map
      map.current.addSource('route', {
        type: 'geojson',
        data: route,
      });

      // Add 3D buildings to the map (from: https://docs.mapbox.com/mapbox-gl-js/example/3d-buildings/)
      map.current.addLayer({
        id: 'add-3d-buildings',
        source: 'composite',
        'source-layer': 'building',
        filter: ['==', 'extrude', 'true'],
        type: 'fill-extrusion',
        minzoom: 15,
        paint: {
          'fill-extrusion-color': '#aaa',
          'fill-extrusion-height': [
            'interpolate',
            ['linear'],
            ['zoom'],
            15,
            0,
            15.05,
            ['get', 'height'],
          ],
          'fill-extrusion-base': [
            'interpolate',
            ['linear'],
            ['zoom'],
            15,
            0,
            15.05,
            ['get', 'min_height'],
          ],
          'fill-extrusion-opacity': 0.6,
        },
      });

      // Add route layer to the map.
      map.current.addLayer({
        id: 'route-layer',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': 'blue',
          'line-width': 4,
          'line-opacity': 0.75,
        },
      });

      // Add Location data from the mock API to the map.
      map.current.addLayer({
        id: 'itineraries-layer',
        type: 'circle',
        source: 'itineraries',
        paint: {
          'circle-radius': 8,
          'circle-stroke-width': 2,
          'circle-color': 'red',
          'circle-stroke-color': 'white',
        },
      });

      // Create a popup, but don't add it to the map yet.
      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
      });

      map.current.on('mouseenter', 'itineraries-layer', e => {
        // Change the cursor style as a UI indicator.
        map.current.getCanvas().style.cursor = 'pointer';

        // Copy coordinates array.
        const coordinates = e.features[0].geometry.coordinates.slice();
        const properties = e.features[0].properties;
        const popupHtml = `<strong style="color: black;">Name:</strong><p style="color: black;">${properties.name}</p><br><strong style="color: black;">Address:</strong><p style="color: black;">${properties.address}</p>`;

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        // Populate the popup and set its coordinates
        // based on the feature found.
        popup.setLngLat(coordinates).setHTML(popupHtml).addTo(map.current);
      });

      map.current.on('mouseleave', 'itineraries-layer', () => {
        map.current.getCanvas().style.cursor = '';
        popup.remove();
      });
    });

    // Clean up on unmount
    return () => map.current.remove();
  }, [geoJson, route, mapStyle]);

  // USE EFFECT # 2
  // This effect is triggered every time the user searches for a new location.
  // It posts the new location to the server, updates the state variables (Lat, Lng, Zoom),
  // and resets the map to focus on the new location.
  useEffect(() => {
    if (Object.keys(searched).length > 0) {
      postLocation(searched);
      setLat(searched.latitude);
      setLng(searched.longitude);
      setZoom(15);
    }
  }, [searched]);

  // USE EFFECT # 3
  // This effect is triggered when the location data (geoJson) changes.
  // It calls the getRoute function to fetch and update route information from the MapBox API.
  useEffect(() => {
    if (geoJson && geoJson.features) {
      getRoute();
    }
  }, [geoJson]);

  return (
    <Box
      ref={mapContainer}
      w="100%"
      h="100%"
      style={{ overflow: 'auto' }}
    ></Box>
  );
}

export default Map;
