function showMap() {

  
  //------------------------------------------
  // Defines and initiates basic mapbox data
  //------------------------------------------
  // TO MAKE THE MAP APPEAR YOU MUST
  // ADD YOUR ACCESS TOKEN FROM
  // https://account.mapbox.com
  mapboxgl.accessToken =
    "pk.eyJ1Ijoia3lyeWxzaHRhbmhlaSIsImEiOiJjbHR2YnNianQxY2drMmtwZWM5Y3ozdWhwIn0.IONvHK4NmN68fngHfO79Dw";
  const map = new mapboxgl.Map({
    container: "map", // Container ID
    style: "mapbox://styles/mapbox/streets-v11", // Styling URL
    center: [-123.100000, 49.276082], // Starting position
    zoom: 11, // Starting zoom
  });

  // Add user controls to map, zoom bar
  map.addControl(new mapboxgl.NavigationControl());

  //------------------------------------------------
  // Add listener for when the map finishes loading.
  // After loading, we can add map features
  //------------------------------------------------
  map.on("load", () => {
    addEventsPinsCircle(map); // Add event pins
    addUserPinCircle(map); // Add user location pin
  });
}


function addEventsPinsCircle(map) {
  const iconUrls = {
    performance: './icons/theater_comedy_FILL0_wght400_GRAD0_opsz24.png',
    convention: './icons/handshake_FILL0_wght400_GRAD0_opsz24.png',
    art: './icons/palette_FILL0_wght400_GRAD0_opsz24.png',
    sale: './icons/style_FILL0_wght400_GRAD0_opsz24.png',
    music: './icons/music_note_FILL0_wght400_GRAD0_opsz24.png',
    food: './icons/restaurant_FILL0_wght400_GRAD0_opsz24.png',
    fair: './icons/attractions_FILL0_wght400_GRAD0_opsz24.png',
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
            description: `<strong>${doc.data().name}</strong><p>${doc.data().description}</p>
                            <br> <a href="/event.html?id=${doc.id}" target="_blank" 
                            title="Opens in a new window" class="btn btn-primary">Read more</a>`,
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
function addUserPinCircle(map) {
  // Adds user's current location as a source to the map
  navigator.geolocation.getCurrentPosition((position) => {
    const userLocation = [position.coords.longitude, position.coords.latitude];
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
  });
}

showMap(); // Call it!
