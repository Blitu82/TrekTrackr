import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
// import MapboxDirections from '@mapbox/mapbox-gl-directions';

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
  const [coords, setCoords] = useState([]);

  useEffect(() => {
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom: zoom,
    });

    // Add the Search bar to the map (MapBox Geocoder API)
    map.current.addControl(
      new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
        types: 'poi',
        placeholder: '         Search Location',
      }).on('result', function (result) {
        // setSearched(result.data);
        // console.log(result);
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
      map.current.addSource('itineraries', {
        type: 'geojson',
        data: geoJson,
      });

      // Add route data to the map
      map.current.addSource('route', {
        type: 'geojson',
        data: route,
      });

      // Add 3D buildings (from: https://docs.mapbox.com/mapbox-gl-js/example/3d-buildings/)
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

  //
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
      setLat(searched.latitude);
      setLng(searched.longitude);
      setZoom(15);
      // console.log(searched);
    }
  }, [searched]);

  // Add Navigation to the map (MapBox Directions API)
  // map.current.addControl(
  //   new MapboxDirections({
  //     accessToken: mapboxgl.accessToken,
  //     unit: 'metric',
  //     profile: 'mapbox/walking',
  //   })
  // );

  // WORK IN PROGRESS From: https://www.youtube.com/watch?v=XsGWdXnpU8k
  // console.log(geoJson);
  // const formatedRoute = geoJson.feature.map{
  //   return(location => location.geometry.coordinates[0]);
  // }
  // console.log(formattedRoute);
  const getRoute = async () => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/walking/-9.1393,38.7223;-9.2159,38.6916;-9.2064,38.6979;-9.1397,38.7123;-9.1393,38.7157?alternatives=false&geometries=geojson&language=en&overview=full&steps=true&access_token=${mapboxgl.accessToken}`
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const route = await response.json();
      const coords = route.routes[0].geometry.coordinates;
      setCoords(coords);
      console.log([coords]);
    } catch (error) {
      console.error('There was a problem fetching the route');
    }
  };
  const route = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'feature',
        geometry: {
          type: 'LineString',
          coordinates: [...coords],
        },
      },
    ],
  };

  useEffect(() => {
    getRoute();
  }, []);

  // console.log(search);
  // console.log(searched);

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
