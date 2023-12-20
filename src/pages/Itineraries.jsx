function Itineraries({ geoData }) {
  return (
    <div>
      <h1>Itinerary Page</h1>
      {geoData && (
        <div>
          <ul>
            {geoData.features.map(location => (
              <li key={location.properties.id}>
                <strong>{location.properties.name}</strong>
                <p>{location.properties.address}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Itineraries;
