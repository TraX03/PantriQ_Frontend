import React, { useEffect } from "react";
import HomeController from "./controller";
import Reactotron from "reactotron-react-native";

export default function HomeContainer() {
  useEffect(() => {
    const fetchMeal = async () => {
      try {
        const response = await fetch(
          "https://www.themealdb.com/api/json/v1/1/random.php",
          {
            method: "GET", // Use "GET" for fetching data; POST/PATCH isn't appropriate for this endpoint
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        // Log to Reactotron
        Reactotron.log("Fetched Meal:", data);
      } catch (error) {
        Reactotron.error("Fetch Error:", error);
      }
    };

    fetchMeal();
  }, []);

  return <HomeController />;
}
