const locations = [];
const app = document.getElementById('root');

const logo = document.createElement('img');
logo.src = 'images/logo-final.png';

const container = document.createElement('div');
container.setAttribute('class', 'container');
container.setAttribute('id', 'container');

const map_container = document.createElement('div');
map_container.setAttribute('id', 'mapContainer');

app.appendChild(logo);
app.appendChild(container);
container.appendChild(map_container);

// Creating a request variable to be used for API access
let request = new XMLHttpRequest();

request.open('GET', 'https://api.mobilize.us/v1/events', true);

request.onload = function() {
  if (request.status >= 200 && request.status < 400) {
      //Where the json data is accessed
    let data = JSON.parse(this.response)['data'];
    data = data.sort(function(a,b) {
      return b.timeslots[0].start_date - a.timeslots[0].start_date
    });
    for (i = 0; i < data.length; i++) {
      const card = document.createElement('div');
      card.setAttribute('class', 'card');
      container.appendChild(card);

      let url = data[i].browser_url;
      card.setAttribute('href', url);

      const inner_card_container = document.createElement('div');
      inner_card_container.setAttribute('class', 'innerContainer');

      const h1 = document.createElement('h1');
      h1.textContent = data[i].title;

      const h2 = document.createElement('h2');
      h2.textContent = data[i].sponsor.name;

      const p = document.createElement('p');
      if (data[i].description.length < 300) {
        p.textContent = data[i].description
      } else {
        // if the desc is too long we make it shorter
        p.textContent = `${data[i].description.substring(0, 300)}...`
      };


      locations[i] = {};
      if (data[i].location) {
        locations[i].lat = data[i].location.location.latitude;
        locations[i].lng = data[i].location.location.longitude;
        locations[i].title = data[i].title;
      };

      let start_date_utc = data[i]['timeslots'][0]['start_date'];
      let start_date = new Date(0);
      start_date.setUTCSeconds(start_date_utc);
      // start_date.toLocaleDateString()

      let time_table = document.createElement('table');
      time_table.setAttribute('id', 'timeTable');

      let time_tr = document.createElement('tr');
      time_tr.setAttribute('id', 'tableRow');

      let time_td = document.createElement('td');
      let start = document.createTextNode(`${start_date}`);

      time_table.appendChild(time_tr);
      time_tr.appendChild(time_td);
      time_td.appendChild(start);

      card.appendChild(h1);
      card.appendChild(inner_card_container);
      inner_card_container.appendChild(h2);
      inner_card_container.appendChild(p);
      inner_card_container.appendChild(time_table);
    }
  } else {
    window.location.href = 'error_page.html'
  }

  const cards = document.querySelectorAll('.card')
  cards.forEach(function(e) {
    e.addEventListener('click', function() {
      window.location = e.getAttribute('href')
    })
  })
}
request.send()

let map, infoWindow;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 40.712776, lng: -74.005974},
    zoom: 6,
    mapTypeControl: true,
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
      position: google.maps.ControlPosition.TOP_CENTER
    }
  });

  infoWindow = new google.maps.InfoWindow;

  // Check for geolocation
  if (navigator.getlocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      let pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      infoWindow.setPosition(pos);
      infoWindow.setContent('You are here.');
      infoWindow.open(map);
      map.setCenter(pos);
    }, function () {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // If geolocation not supported
    handleLocationError(false, infoWindow, map.getCenter());
  };

  let home_marker = new google.maps.Marker({
    position: map.getCenter(),
    map: map,
    title: 'You are here.'
  })

  let marker;

  for (let i = 0; i < locations.length; i++) {
    if (locations[i]) {
      console.log(locations[i])
      marker = new google.maps.Marker({
        position: new google.maps.LatLng(
          locations[i].latitude,
          locations[i].longitude),
        map: map,
        title: locations[i].title
      })
    }
  }
}

function handleLocationError(browserSupportsGeoLocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserSupportsGeoLocation ?
    'Error: Geolocation failed.' :
    'Error: Browser does not support geolocation');
  infoWindow.open(map);
};
