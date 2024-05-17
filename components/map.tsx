import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
const Map = ({ restaurants, handleMarkersChange, isFilterUpdated }) => {
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [updatedMarkers, setUpdatedMarkers] = useState([]);
  const [isZoom, setIsZoom] = useState<boolean>(false);
  const [map, setMap] = useState(null);
  const mapStyles = {
    height: "400px",
    width: "100%",
  };
  const onLoad = (map) => {
    setMap(map);
  };
  useEffect(() => {
    if (map && markers.length && restaurants.length) {
      const bounds = new window.google.maps.LatLngBounds();
      markers.forEach((marker) => {
        bounds.extend(new window.google.maps.LatLng(marker.lat, marker.lng));
      });
      map.fitBounds(bounds);
    }
  }, [markers, selectedMarker]);
  useEffect(() => {
    if (map && restaurants.length) {
      const geocoder = new window.google.maps.Geocoder();
      Promise.all(
        restaurants?.map(
          (restaurant) =>
            new Promise((resolve, reject) => {
              geocoder.geocode(
                { address: restaurant.node.restaurantFields.restaurantAddress },
                (results, status) => {
                  if (status === "OK" && results[0]) {
                    const { lat, lng } = results[0].geometry.location;
                    restaurant.node.latitude = lat();
                    restaurant.node.longitude = lng();
                    resolve({
                      id: restaurant.node.id,
                      lat: lat(),
                      lng: lng(),
                      title: restaurant.node.title,
                      description:
                        restaurant.node.restaurantFields.restaurantAddress,
                    });
                  } else {
                    console.error(
                      "Geocode was not successful for the following reason:",
                      status
                    );
                    reject();
                  }
                }
              );
            })
        )
      )
        .then((markers) => {
          const selectedMarkers = markers.filter((marker) =>
            restaurants.some((restaurant) => restaurant.node.id === marker.id)
          );
          setMarkers(selectedMarkers);
          if (!isZoom || !isFilterUpdated.length) {
            setUpdatedMarkers(selectedMarkers);
          }
        })
        .catch((error) => {
          console.error("Error occurred during geocoding:", error);
        });
    }
  }, [restaurants, map]);
  const resetMap = () => {
    handleMarkersChange([]);
  };
  const searchMap = () => {
    if (map && updatedMarkers.length) {
      const bounds = map.getBounds();
      const visibleMarkers = markers.filter((marker) =>
        bounds.contains(
          new window.google.maps.LatLng(marker.lat, marker.lng)
        )
      )
      setIsZoom(true);
      handleMarkersChange(visibleMarkers);
    }
  };
  return (
    <div className="mt-4">
      <LoadScript googleMapsApiKey={process?.env?.NEXT_PUBLIC_GOOGLE_API_URL}>
        <div style={{ position: "relative" }}>
          <GoogleMap
            mapContainerStyle={mapStyles}
            zoom={1}
            center={{ lat: 0, lng: 0 }}
            onLoad={onLoad}
            options={{
              zoomControl: true,
              mapTypeControl: true,
              streetViewControl: true,
              fullscreenControl: true,
            }}
          >
            {markers.map((marker, index) => (
              <Marker
                key={index}
                position={{ lat: marker.lat, lng: marker.lng }}
                onClick={() => setSelectedMarker(marker)}
              />
            ))}
            {selectedMarker && (
              <InfoWindow
                position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
                onCloseClick={() => setSelectedMarker(null)}
              >
                <div>
                  <h2>{selectedMarker.title}</h2>
                  <p>{selectedMarker.description}</p>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
          <div
            style={{
              position: "absolute",
              bottom: 80,
              left: 12,
              zIndex: 1,
              backgroundColor: "black",
              padding: "4px",
              borderRadius: "2px",
              boxShadow: "0px 0px 5px rgba(0,0,0,0.3)",
              width: '120px'
            }}
          >
            <button
              onClick={searchMap}
              style={{
                color: '#E6E6E6',
                fontWeight: 600,
                fontSize: '16px',
                border: "none",
                cursor: "pointer",
                outline: "none",
                width: "100%",
              }}
            >
              Apply Filters
            </button>
          </div>
          <div
            style={{
              position: "absolute",
              bottom: 30,
              left: 12,
              zIndex: 1,
              backgroundColor: "black",
              padding: "4px",
              boxShadow: "0px 0px 5px rgba(0,0,0,0.3)",
              width: '120px'
            }}
          >
            <button
              style={{
                color: '#E6E6E6',
                fontWeight: 600,
                fontSize: '16px',
                border: "none",
                cursor: "pointer",
                borderWidth: '1px',
                width: "100%",
              }}
              onClick={resetMap}>Reset Filters</button>
          </div>
        </div>
      </LoadScript>
    </div>
  );
};
export default Map;