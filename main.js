var restaurants_on_map;
(function (restaurants_on_map) {
    var map;
    var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var labelIndex = 0;
    function init(position) {
        var map = L.map('map').setView([position.coords.latitude, position.coords.longitude], 13);
        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
            maxZoom: 18,
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
                '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            id: 'mapbox.streets'
        }).addTo(map);
        getRestaurants().then(function (restaurants) {
            restaurants.forEach(function (restaurant) {
                addMarker(restaurant, map);
            });
        });
    }
    function addMarker(restaurant, map) {
        if (!restaurant.location) {
            return;
        }
        var marker = L.marker([+restaurant.location.lat, +restaurant.location.lng]).addTo(map);
        marker.bindPopup('<p>' + restaurant.title + '</p><br><a href="' + restaurant.website + '">Ruokalista</a>');
    }
    function getRestaurants() {
        return fetch('dataAll.json')
            .then(function (response) {
            return response.json();
        });
    }
    (function () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(init);
        }
    })();
})(restaurants_on_map || (restaurants_on_map = {}));
//# sourceMappingURL=main.js.map