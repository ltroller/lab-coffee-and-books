

document.addEventListener('DOMContentLoaded', () => {

  console.log('Init express maps project');

  // initMap();

}, false);

var map;

var assetPath = '/images/markers/';
var icons = {
  CAFE: assetPath+'cafe.png',
  BOOKSTORE: assetPath+'bookstore.png'
}

function initMap() {
  console.log('Starting map functions');
  const home = {
    lat: 52.511911,
    lng: 13.473192
  }

  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    center: home,
  });

  let geocoderBtn = document.getElementById('pl_geocode');

  if(geocoderBtn) {
    const geocoder = new google.maps.Geocoder();



    geocoderBtn.addEventListener('click', function() {
      geocodeAddress(geocoder, map);
    });
  }


  let placesPage = document.getElementById('places-page');

  if(placesPage) {
    getPlaces();
  }

}


function geocodeAddress(geocoder, resultsMap) {
  let errorMsgElement = document.getElementById('error-msg');
  
  let address = document.getElementById('pl_address').value;

  geocoder.geocode({'address': address}, function(results, status) {

    if (status === 'OK') {
      resultsMap.setCenter(results[0].geometry.location);
      let marker = new google.maps.Marker({
          map: resultsMap,
          position: results[0].geometry.location
      });
      console.log(results[0]);
      document.getElementById('pl_lat').value = results[0].geometry.location.lat();
      document.getElementById('pl_lng').value = results[0].geometry.location.lng();
      let submit = document.getElementById('pl_submit');
      submit.removeAttribute('disabled');
      submit.classList.remove('disabled');
    } else {
      errorMsgElement.innerHTML = 'Error during Geocoding: ' + status;
      errorMsgElement.style.display = 'block';
    }
	});
}

function getPlaces() {
  axios.get("http://localhost:3000/api")
  .then( response => {
    console.log(response.data);
    addPlaceToMap(response.data);
  })
  .catch(error => {
    next(error)
  })
}

markers = [];
function addPlaceToMap(places){
    places.forEach(function(place){
      const center = {
        lat: place.location.coordinates[1],
        lng: place.location.coordinates[0]
      };
      const pin = new google.maps.Marker({
        position: center,
        map: map,
        title: place.name,
        icon: icons[place.place_type]
      });
      markers.push(pin)
    });
}


