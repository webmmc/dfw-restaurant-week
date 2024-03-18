import React, { useEffect, useState, createContext } from "react";

export type Restaurant = {
  title: string;
  slug: string;
  openTableLink: string;
};

export type setItinerary = React.Dispatch<React.SetStateAction<Restaurant[]>>;

export type ItineraryContextType = {
  itinerary: Restaurant[];
  setItinerary: setItinerary;
};

const ItineraryContext = createContext<ItineraryContextType>({
  itinerary: [],
  setItinerary: () => [],
});

export const ItineraryProvider = ({ children }) => {
  const [itinerary, setItinerary] = useState<Restaurant[]>([]);

  useEffect(() => {
    // Retrieve the itinerary from localStorage if it exists and assign it to the state by default
    const storedItinerary = localStorage.getItem("itinerary");
    if (storedItinerary) {
      setItinerary(JSON.parse(storedItinerary) as Restaurant[]);
    }
  }, []);

  useEffect(() => {
    // Update the itinerary in localStorage whenever it changes
    localStorage.setItem("itinerary", JSON.stringify(itinerary));
  }, [itinerary]);

  return (
    <ItineraryContext.Provider
      value={{
        itinerary,
        setItinerary,
      }}
    >
      {children}
    </ItineraryContext.Provider>
  );
};

export default ItineraryContext;
