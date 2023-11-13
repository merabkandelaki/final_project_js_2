const title = document.querySelector("h1");
const button = document.querySelector("button");

const locationDesc = document.querySelector("h2");
const detectLocation = document.querySelector(".detect-location");
const resultCountry = document.createElement("p");
resultCountry.classList.add("result-country");
detectLocation.appendChild(resultCountry);

const resultCity = document.createElement("p");
resultCity.classList.add("result-city");
detectLocation.appendChild(resultCity);

const resultDistrict = document.createElement("p");
resultDistrict.classList.add("result-district");
detectLocation.appendChild(resultDistrict);

const resultStreet = document.createElement("p");
resultStreet.classList.add("result-street");
detectLocation.appendChild(resultStreet);

button.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  } else {
    alert("Your browser does not support Geolocation API");
  }
});

function onSuccess(position) {
  title.style.display = "none";
  button.style.display = "none";
  locationDesc.innerText = "Detecting your location...";
  locationDesc.classList.add("active");
  let apiKey = "0c8d93e359184224a48dbc45e90820e9";
  let { latitude, longitude } = position.coords;
  fetch(
    `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`
  )
    .then((response) => response.json())
    .then((result) => {
      let allDetails = result.results[0].components;
      let { country, city, suburb, road } = allDetails;
      resultCountry.innerText = `Country .......... ${country}`;
      resultCity.innerText = `City .......... ${city}`;
      resultDistrict.innerText = `District .......... ${suburb}`;
      resultStreet.innerText = `Street .......... ${road}`;
      detectLocation.classList.add("active");
      console.table(allDetails);
    })
    .catch(() => {
      locationDesc.innerText = "Something went wrong";
    });

  const map = L.map("map").setView(
    [position.coords.latitude, position.coords.longitude],
    13
  );

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

L.marker([
    position.coords.latitude,
    position.coords.longitude,
  ]).addTo(map);

L.circle(
    [position.coords.latitude, position.coords.longitude],
    {
      color: "red",
      fillColor: "#f03",
      fillOpacity: 0.5,
      radius: 500,
    }
  ).addTo(map);
}

function onError(error) {
  if (error.code == 1) {
    locationDesc.innerText = "Your the request denied";
  } else if (error.code == 2) {
    locationDesc.innerText = "Location not avialable";
  } else {
    locationDesc.innerText = "Something went wrong";
  }
}
