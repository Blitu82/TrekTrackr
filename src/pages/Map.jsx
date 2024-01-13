import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { Box } from '@chakra-ui/react';

// Based on https://medium.com/@gisjohnecs/part-1-web-mapping-with-mapbox-gl-react-js-7d11b50d86ec

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_KEY;

function Map({ geoJson, getGeoJson, getActivity }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-9.1426);
  const [lat, setLat] = useState(38.7369);
  const [zoom, setZoom] = useState(11);
  const [searched, setSearched] = useState({});

  useEffect(() => {
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom: zoom,
    });
    // Add the control to the map
    map.current.addControl(
      new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
      }).on('result', function (result) {
        // setSearched(result.data);
        console.log(result);
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
      // Nifty code to force map to fit inside container when it loads
      map.current.resize();

      // Add location data to the map

      console.log('this is the data should display on the map:', geoJson); // troubleshooting why red points do not show
      map.current.addSource('itineraries', {
        type: 'geojson',
        data: geoJson,
      });

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
        const popupHtml = `<strong>Name:</strong><p>${properties.name}</p><br><strong>Address:</strong>${properties.address}`;

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
  }, [geoJson]);

  useEffect(() => {
    if (Object.keys(searched).length > 0) {
      const API_URL = 'https://json-server-backend-trek.adaptable.app';
      async function postLocation(searched) {
        try {
          const response = await fetch(`${API_URL}/itinerary`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(searched),
          });
          if (!response.ok) {
            throw new Error('Failed to add itinerary');
          }
          getGeoJson();
          getActivity();
        } catch (error) {
          console.error('There was a problem adding the itinerary:', error);
        }
      }
      postLocation(searched);
    }
  }, [searched]);

  // console.log(search);
  // console.log(searched);

  return (
    <Box
      ref={mapContainer}
      w="1500px"
      h="1500px"
      style={{ overflow: 'auto' }}
    ></Box>
  );
}

export default Map;
