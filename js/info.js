async function initMap() {
  const mapOptions = {
    zoom: 10,
    center: { lat: 32.0853, lng: 34.7818 }, 
  };

  const map = new google.maps.Map(document.getElementById("map"), mapOptions);

  try {
    const response = await fetch("http://localhost:4000/branches/", {
      method: "GET",
    });
    const locations = await response.json();
    locations.forEach((location) => {
      new google.maps.Marker({
        position: {
          lat: location.coordinates.lat,
          lng: location.coordinates.lng,
        },
        map: map,
        title: `${location.city}, ${location.street}`,
      });
    });
  } catch (error) {
    console.error("Error loading branch data:", error);
  }
}

window.onload = initMap;
