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
  const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 });
  const [mapZoom, setMapZoom] = useState(1);

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
  }, [map, markers, restaurants]);

  useEffect(() => {
    if (map && restaurants.length) {
      const selectedMarkers = restaurants
        .filter(
          (restaurant) =>
            restaurant.node.restaurantFields.latitude &&
            restaurant.node.restaurantFields.longitude
        )
        .map((restaurant) => ({
          id: restaurant.node.id,
          lat: parseFloat(restaurant.node.restaurantFields.latitude),
          lng: parseFloat(restaurant.node.restaurantFields.longitude),
          title: restaurant.node.title,
          description: restaurant.node.restaurantFields.restaurantAddress,
          image: restaurant.node.restaurantFields?.restaurantLogo.mediaItemUrl,
          altText: restaurant.node.featuredImage?.node?.altText,
          uri: restaurant.node.uri,
          favourite: restaurant.node.restaurantFields.favoriteRestaurant,
          customImage:
            restaurant.node.restaurantFields.customIconForMap?.mediaItemUrl,
        }));
      setMarkers(selectedMarkers);
    }
  }, [restaurants, map]);

  const resetMap = () => {
    handleMarkersChange([]);
    setSelectedMarker(null);
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

  const onMarkerClick = (marker) => {
    if (map) {
      setMapCenter(map.getCenter().toJSON());
      setMapZoom(map.getZoom());
    }
    setSelectedMarker(marker);
  };

  const onCloseInfoWindow = () => {
    setSelectedMarker(null);
    if (map) {
      map.setCenter(mapCenter);
      map.setZoom(mapZoom);
    }
  };

  const buttonStyles = {
    color: "black",
    fontWeight: 600,
    fontSize: "16px",
    cursor: "pointer",
    width: "100%",
    padding: "4px",
  };

  const buttonContainerStyles:any = {
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

  const dynamicStyles = `
    .gm-style-iw-d {
      overflow: hidden !important;
      height: max-content !important;
      max-height: max-content !important;
    }
    .gm-style .gm-style-iw-c {
      padding: 0px; 
      padding-top: 0px !important;
    }
    .gm-style-iw {
      padding-inline-end: 0px;
      padding-bottom: 0px;
      padding-top: 0px;
      max-width: 648px;
      max-height: 400px !important;
      min-width: 0px;
      min-height: 260px !important;
    }
    .gm-ui-hover-effect {
      opacity: 1 !important;
      position: absolute !important;
      right: 0px !important;
    }
  `;

  return (
    <div className="mt-4">
      <LoadScript googleMapsApiKey={process?.env?.NEXT_PUBLIC_GOOGLE_API_URL}>
        <div style={{ position: "relative" }}>
          <style>{dynamicStyles}</style>
          <GoogleMap
            mapContainerStyle={mapStyles}
            zoom={mapZoom}
            center={mapCenter}
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
                icon={
                  marker.favourite
                    ? {
                        url: marker.customImage,
                        scaledSize: new window.google.maps.Size(50, 50),
                      }
                    : undefined
                }
                position={{ lat: marker.lat, lng: marker.lng }}
                onClick={() => onMarkerClick(marker)}
              />
            ))}
            {selectedMarker && (
              <InfoWindow
                position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
                onCloseClick={onCloseInfoWindow}
              >
                {selectedMarker.image && (
                  <div className="flex flex-col items-center ">
                    <div className="h-32">
                      <Image
                        className="object-cover"
                        src={selectedMarker.image}
                        alt={selectedMarker?.altText}
                        width={200}
                        height={200}
                      />
                    </div>
                    <div className="w-64 px-5 pt-2 pb-3">
                      <p
                        className="text-lg mb-[10px]"
                        style={{
                          fontFamily: "Pinyon Script",
                          fontSize: "24px",
                        }}
                      >
                        {selectedMarker.title}
                      </p>
                      <p className="mb-[12px]">{selectedMarker.description}</p>
                      <Link
                        href={selectedMarker?.uri}
                        className="bg-[#da3743] rounded-sm"
                        target="_blank"
                      >
                        <button className="bg-[#da3743] px-3 py-1 text-white rounded-sm">
                          View Menu
                        </button>
                      </Link>
                    </div>
                  </div>
                )}
              </InfoWindow>
            )}
          </GoogleMap>
          <div style={{ ...buttonContainerStyles, bottom: 80 }}>
            <button onClick={searchMap} style={buttonStyles}>
              Apply Filters
            </button>
          </div>
          <div style={{ ...buttonContainerStyles, bottom: 30 }}>
            <button style={buttonStyles} onClick={resetMap}>
              Reset Filters
            </button>
          </div>
        </div>
      </LoadScript>
    </div>
  );
};

export default Map;
