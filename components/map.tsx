import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import Image from "next/image";
import Link from "next/link";

const Map = ({ restaurants, handleMarkersChange, isFilterUpdated }) => {
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [markers, setMarkers] = useState([]);
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
  }, [map, markers, restaurants, selectedMarker]);


  useEffect(() => {
    if (map && restaurants.length) {
      const selectedMarkers = restaurants
        .filter((restaurant: any) => 
          restaurant.node.restaurantFields.latitude && restaurant.node.restaurantFields.longitude
        )
        .map((restaurant: any) => ({
          id: restaurant.node.id,
          lat: parseFloat(restaurant.node.restaurantFields.latitude),
          lng: parseFloat(restaurant.node.restaurantFields.longitude),
          title: restaurant.node.title,
          description: restaurant.node.restaurantFields.restaurantAddress,
          image: restaurant.node.restaurantFields?.restaurantLogo.mediaItemUrl,
          altText: restaurant.node.featuredImage?.node?.altText,
          uri: restaurant.node.uri
        }));
      setMarkers(selectedMarkers);
    }
  }, [restaurants, map]);

  const resetMap = () => {
    handleMarkersChange([]);
  };

  const searchMap = () => {
    if (map && markers.length) {
      const bounds = map.getBounds();
      const visibleMarkers = markers.filter((marker) =>
        bounds.contains(new window.google.maps.LatLng(marker.lat, marker.lng))
      );
      handleMarkersChange(visibleMarkers);
    }
  };

  const buttonStyles: React.CSSProperties = {
    color: "black",
    fontWeight: 600,
    fontSize: "16px",
    cursor: "pointer",
    width: "100%",
    padding: "4px",
  };

  const buttonContainerStyles: React.CSSProperties = {
    position: "absolute",
    left: 12,
    zIndex: 1,
    backgroundColor: "white",
    padding: "4px",
    borderRadius: "2px",
    boxShadow: "0px 0px 5px rgba(0,0,0,0.3)",
    width: "120px",
    border: "2px solid #da3743",
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

              { selectedMarker.image && 
                  <div className="flex flex-col items-center ">
                    <div className="h-32" >
                    <Image
                    className="object-cover"
                    src={selectedMarker.image}
                    alt={selectedMarker?.altText}
                    width={200}
                    height={200}
                  />
                    </div>
                  <div className="w-64 px-5 pt-2 pb-3">
                    <p className="text-lg mb-[10px]" style={{ fontFamily: "Pinyon Script", fontSize:'24px' }}>
                      {selectedMarker.title}
                    </p>
                    <p className="mb-[12px]" >{selectedMarker.description}</p>
                    <Link
                      href={selectedMarker?.uri}
                      className="bg-[#da3743] rounded-sm"
                      target="_blank"
                    >
                      <button
                        className="bg-[#da3743] px-3 py-1 text-white rounded-sm"
                      >
                        View Menu
                      </button>
                    </Link>
                  </div>
                </div>
              }
              </InfoWindow>
            )}
          </GoogleMap>
          <div style={{ ...buttonContainerStyles, bottom: 80 }}>
            <button
              onClick={searchMap}
              style={buttonStyles}
            >
              Apply Filters
            </button>
          </div>
          <div style={{ ...buttonContainerStyles, bottom: 30 }}>
            <button
              style={buttonStyles}
              onClick={resetMap}
            >
              Reset Filters
            </button>
          </div>
        </div>
      </LoadScript>
    </div>
  );
};

export default Map;
