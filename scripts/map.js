const truncateText = (text, maxLength) =>
  text.length > maxLength ? text.substring(0, maxLength - 3) + "..." : text;

function showMap() {
  mapboxgl.accessToken =
    "pk.eyJ1Ijoia3lyeWxzaHRhbmhlaSIsImEiOiJjbHR2YnNianQxY2drMmtwZWM5Y3ozdWhwIn0.IONvHK4NmN68fngHfO79Dw";

  // Create the map with a temporary center
  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    center: [-123.1, 49.276082], // This will be updated with the user's location
    zoom: 11,
  });

  map.addControl(new mapboxgl.NavigationControl());

  // Use the browser's navigator object to get the user's current position
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const userLocation = [
        position.coords.longitude,
        position.coords.latitude,
      ];

      // Center the map on the user's current location
      map.jumpTo({ center: userLocation });

      // Add the user's location as a source and layer on the map
      addUserPinCircle(map, userLocation); // Pass the userLocation to the function
    },
    (error) => {
      console.error(error);
    }
  );

  // Add a "Re-center" button to the map
  const recenterBtn = document.createElement("button");
  recenterBtn.innerHTML = '<i class="bi bi-crosshair" style="font-size: 2rem;"></i>'; // Using Bootstrap Icons and making the icon bigger
  recenterBtn.className = "btn btn-primary"; // Bootstrap classes for basic styling
  recenterBtn.style.position = "absolute";
  recenterBtn.style.bottom = "30px";
  recenterBtn.style.right = "30px";
  recenterBtn.style.zIndex = "1";
  recenterBtn.style.borderRadius = "50%"; // Make the button circular
  recenterBtn.style.height = "60px"; // Increase the height for a larger button
  recenterBtn.style.width = "60px"; // Increase the width to match the height for a circle
  recenterBtn.style.display = "flex";
  recenterBtn.style.alignItems = "center";
  recenterBtn.style.justifyContent = "center";
  map.getContainer().appendChild(recenterBtn);

  // Re-center map on button click
  recenterBtn.addEventListener("click", () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const userLocation = [
        position.coords.longitude,
        position.coords.latitude,
      ];
      map.flyTo({ center: userLocation, essential: true });
    });
  });
  map.on("load", () => {
    addEventsPinsCircle(map); // Add event pins
    addUserPinCircle(map); // Add user location pin
  });
}

function addEventsPinsCircle(map) {
  const iconUrls = {
    performance: "https://img.icons8.com/ios/30/theatre-mask.png",
    convention: "https://img.icons8.com/ios/30/conference.png",
    art: "https://img.icons8.com/ios/30/paint-palette.png",
    sale: "https://img.icons8.com/ios/30/discount--v1.png",
    music: "https://img.icons8.com/ios/30/music--v1.png",
    food: "https://img.icons8.com/ios/30/dining-room.png",
    fair: "https://img.icons8.com/ios/30/ferris-wheel--v1.png",
  };

  let loadedIcons = 0;
  const totalIcons = Object.keys(iconUrls).length;

  Object.entries(iconUrls).forEach(([type, url]) => {
    map.loadImage(url, (error, image) => {
      if (error) throw error;
      map.addImage(type, image);
      loadedIcons++;
      if (loadedIcons === totalIcons) {
        // All icons loaded, now add the events
        addEventsToMap(map); // This function adds the GeoJSON source and layers
      }
    });
  });
}

function addEventsToMap(map) {
  db.collection("events")
    .get()
    .then((allEvents) => {
      const features = [];

      allEvents.forEach((doc) => {
        const geoPoint = doc.data().location;
        const coordinates = [geoPoint.longitude, geoPoint.latitude];
        const eventType = doc.data().type;

        features.push({
          type: "Feature",
          properties: {
            description: `<strong>${doc.data().name}</strong><p>${truncateText(
              doc.data().description,
              150
            )}</p>
                            <p>Wait time: <strong>${
                              doc.data().typical_wait_time
                            } mins</strong></p> <a href="/event.html?id=${
              doc.id
            }" 
                            title="Opens in the same window" class="btn btn-primary">Read more</a>`,
            icon: eventType, // Use the event type as the icon identifier
          },
          geometry: {
            type: "Point",
            coordinates: coordinates,
          },
        });
      });

      map.addSource("places", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: features,
        },
      });

      map.addLayer({
        id: "places",
        type: "symbol",
        source: "places",
        layout: {
          "icon-image": ["get", "icon"], // Use the icon property from each feature
          "icon-size": 1,
          "icon-allow-overlap": true,
        },
      });

      // When one of the "places" markers are clicked,
      // create a popup that shows information
      // Everything related to a marker is save in features[] array
      map.on("click", "places", (e) => {
        // Copy coordinates array.
        const coordinates = e.features[0].geometry.coordinates.slice();
        const description = e.features[0].properties.description;

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears over
        // the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setHTML(description)
          .addTo(map);
      });

      // Change the cursor to a pointer when the mouse hovers over the places layer.
      map.on("mouseenter", "places", () => {
        map.getCanvas().style.cursor = "pointer";
      });

      // Defaults cursor when not hovering over the places layer
      map.on("mouseleave", "places", () => {
        map.getCanvas().style.cursor = "";
      });
    });
}

//-----------------------------------------------------
// Add pin for showing where the user is.
// This is a separate function so that we can use a different
// looking pin for the user.
// This version uses a pin that is just a circle.
//------------------------------------------------------
// Adds user's current location as a source to the map
function addUserPinCircle(map, userLocation) {
  console.log(userLocation);
  if (userLocation) {
    map.addSource("userLocation", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: userLocation,
            },
            properties: {
              description: "Your location",
            },
          },
        ],
      },
    });

    // Creates a layer above the map displaying the pins
    // Add a layer showing the places.
    map.addLayer({
      id: "userLocation",
      type: "circle", // what the pins/markers/points look like
      source: "userLocation",
      paint: {
        // customize colour and size
        "circle-color": "blue",
        "circle-radius": 6,
        "circle-stroke-width": 2,
        "circle-stroke-color": "#ffffff",
      },
    });

    // Map On Click function that creates a popup displaying the user's location
    map.on("click", "userLocation", (e) => {
      // Copy coordinates array.
      const coordinates = e.features[0].geometry.coordinates.slice();
      const description = e.features[0].properties.description;

      new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(description)
        .addTo(map);
    });

    // Change the cursor to a pointer when the mouse is over the userLocation layer.
    map.on("mouseenter", "userLocation", () => {
      map.getCanvas().style.cursor = "pointer";
    });

    // Defaults
    // Defaults cursor when not hovering over the userLocation layer
    map.on("mouseleave", "userLocation", () => {
      map.getCanvas().style.cursor = "";
    });
  }
}

showMap(); // Call it!
