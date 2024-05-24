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
  const [updatedMarkers, setUpdatedMarkers] = useState([]);
  const [isZoom, setIsZoom] = useState(false);
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
        restaurants.map(
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
                      description:restaurant.node.restaurantFields.restaurantAddress,
                      image: restaurant.node.restaurantFields?.restaurantLogo.mediaItemUrl,
                      altText: restaurant.node.featuredImage?.node?.altText,
                      uri: restaurant.node.uri
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
        bounds.contains(new window.google.maps.LatLng(marker.lat, marker.lng))
      );
      setIsZoom(true);
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

  console.log('The markers look like ',markers);
  

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
                <>
                  <Image
                    src={selectedMarker.image}
                    alt={selectedMarker?.altText}
                    width={288}
                    height={50}
                    className="h-28"
                  />
                  <div className="w-72 pl-5  pt-2 pb-3">
                    <p className="text-lg mb-[10px]" style={{ fontFamily: "Pinyon Script", fontSize:'30px' }}>
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
                        View More
                      </button>
                    </Link>
                  </div>
                </>
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
