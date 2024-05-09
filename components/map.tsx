import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";

const Map = ({ restaurants }) => {
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [updatedMarkers, setUpdatedMarkers] = useState([]);
  const [map, setMap] = useState(null);

  const mapStyles = {
    height: "400px",
    width: "100%",
  };

  const onLoad = (map) => {
    setMap(map);
  };

  useEffect(() => {
    if (map && updatedMarkers.length && restaurants.length) {
      const bounds = new window.google.maps.LatLngBounds();
      updatedMarkers.forEach((marker) => {
        bounds.extend(new window.google.maps.LatLng(marker.lat, marker.lng));
      });
      map.fitBounds(bounds);
    }
  }, [updatedMarkers, selectedMarker]);


useEffect(() => {
    if (map && restaurants.length) {
      const geocoder = new window.google.maps.Geocoder();
      Promise.all(restaurants.map((restaurant) => 
        new Promise((resolve, reject) => {
          geocoder.geocode({ address: restaurant.node.restaurantFields.restaurantAddress }, (results, status) => {
            if (status === "OK" && results[0]) {
              const { lat, lng } = results[0].geometry.location;
              restaurant.node.latitude = lat();
              restaurant.node.longitude = lng();
              resolve({
                lat: lat(),
                lng: lng(),
                title: restaurant.node.title,
                description: restaurant.node.restaurantFields.restaurantAddress,
              });
            } else {
              console.error("Geocode was not successful for the following reason:", status);
              reject(); 
            }
          });
        })
      )).then((updatedMarkers) => {
        setUpdatedMarkers(updatedMarkers);
      }).catch((error) => {
        console.error("Error occurred during geocoding:", error);
      });
    }
  }, [restaurants, map]);


  return (
    <div className="lg:mt-6 ">
      <LoadScript googleMapsApiKey={process?.env?.NEXT_PUBLIC_GOOGLE_API_URL}>
        <GoogleMap
          mapContainerStyle={mapStyles}
          zoom={4}
          center={{ lat: 0, lng: 0 }}
          onLoad={onLoad}
          options={{
            zoomControl: true, 
            mapTypeControl: true, 
            streetViewControl: true, 
            fullscreenControl: true, 
          }}
        >
          {updatedMarkers.map((marker, index) => (
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
      </LoadScript>
    </div>
  );
};

export default Map;
