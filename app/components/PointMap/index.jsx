import React, { useCallback, useEffect, useState } from 'react';
import { AdvancedMarker, APIProvider, Map, useMap } from '@vis.gl/react-google-maps';

function PointMap({ points }) {
  const [selected, setSelected] = useState(null);
  const [formattedPoints, setFormattedPoints] = useState([]);

  useEffect(() => {
    const formattedPoints = points.map((point) => {
      return point?.coordinates
        ? {
            position: {
              lat: point.coordinates.lat,
              lng: point.coordinates.lng
            },
            label: point.name
          }
        : {};
    });
    setFormattedPoints(formattedPoints);
  }, [points]);

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API}>
      <Map
        defaultCenter={formattedPoints[0]?.position ?? { lat: 52.260664, lng: 19.208138 }}
        defaultZoom={points[0]?.coordinates ? 12 : 6}
        minZoom={6}
        mapId="95e7fc67b0573f3b"
        mapTypeControl={false}
        streetViewControl={false}
        fullscreenControl={false}
      >
        {formattedPoints.map((point, index) => {
          return point?.position ? (
            <AdvancedMarker
              key={index}
              position={point.position}
              onClick={() => {
                setSelected(points[index]);
              }}
              style={{
                position: 'relative',
                transform: 'translate(50%, 50%)'
              }}
            >
              <div
                style={{
                  background: 'rgba(137, 191, 21, 1)',
                  border: '3px solid white',
                  borderRadius: '50%',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '40px',
                  height: '40px'
                }}
              >
                {index === 0 ? 'S' : index === formattedPoints.length - 1 ? 'F' : index}
              </div>
            </AdvancedMarker>
          ) : null;
        })}
        {selected && (
          <div
            style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              zIndex: 100,
              padding: '10px',
              background: 'white',
              borderRadius: '5px',
              boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              width: '200px',
              maxHeight: '200px',
              overflowY: 'auto'
            }}
          >
            <h4>{selected.name}</h4>
            <p>{selected.wikiIntro ?? selected.summary ?? 'Brak informacji o tym obiekcie'}</p>
          </div>
        )}
      </Map>
    </APIProvider>
  );
}

export default PointMap;
