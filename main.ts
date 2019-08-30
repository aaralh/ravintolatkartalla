namespace restaurants_on_map {
    interface Restaurant {
        title: string,
        address: string,
        location: {
            lat: string,
            lng: string,
        }
        website: string,


    }

    declare const L: any;

    function init(position: Position): void {

        let map = L.map('map').setView([position.coords.latitude, position.coords.longitude], 13);

        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
            maxZoom: 18,
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
                '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            id: 'mapbox.streets'
        }).addTo(map);
        getRestaurants().then(restaurants => {
            restaurants.forEach(restaurant => {
                addMarker(restaurant, map)
            })
        });
    }

    function addMarker(restaurant: Restaurant, map: any) {
        if(!restaurant.location) {
            return;
        }
        let marker = L.marker([+restaurant.location.lat, +restaurant.location.lng]).addTo(map);
        let content = restaurant.website ? '<p>' + restaurant.title + '</p><br><a href="' + restaurant.website + '">Ruokalista</a>' : '<p>' + restaurant.title + '</p>';
        marker.bindPopup(content);
    }

    function getRestaurants(): Promise<Restaurant[]> {
        return fetch('dataAll.json')
        .then(function(response) {
          return response.json();
        })
    }

    (() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(init);
        }
    })()


}

    