async function initMap() {
  // An object that contains the basic settings of the map
  const mapOptions = {
    zoom: 10,
    center: { lat: 32.0853, lng: 34.7818 },
  };

  // Creates a map object and attaches it to a <div>
  const map = new google.maps.Map(document.getElementById("map"), mapOptions);

  // Load branch data
  try {
    const response = await fetch("http://localhost:4000/branches/", {
      method: "GET",
    });

    // Add markers to the map
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

async function fetchCurrencyRates() {
  try {
    const response = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
    const data = await response.json();

    const usdToIls = data.rates.ILS; // Get USD to ILS rate
    const eurToIls = (1 + (1 - data.rates.EUR)) * usdToIls; // Convert EUR to ILS

    document.getElementById("usd-rate").innerText = usdToIls.toFixed(2);
    document.getElementById("eur-rate").innerText = eurToIls.toFixed(2);
  } catch (error) {
    console.error("Error fetching currency rates:", error);
    document.getElementById("usd-rate").innerText = "Error";
    document.getElementById("eur-rate").innerText = "Error";
  }
}

function updateCurrencyRates() {
  fetchCurrencyRates();
  setInterval(fetchCurrencyRates, 1000); // Updates every 60 seconds
}

window.onload = function () {
  initMap();
  updateCurrencyRates();
};

