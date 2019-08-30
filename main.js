var restaurants_on_map;
(function (restaurants_on_map) {
    var map;
    var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var labelIndex = 0;
    function init(position) {
        map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: position.coords.latitude, lng: position.coords.longitude },
            zoom: 11
        });
        getRestaurants().then(function (restaurants) {
            restaurants.forEach(function (restaurant) {
                addMarker(restaurant, map);
            });
        });
    }
    function addMarker(restaurant, map) {
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(+restaurant.location.lat, +restaurant.location.lng),
            label: labels[labelIndex++ % labels.length],
            map: map
        });
        var infowindow = new google.maps.InfoWindow({
            content: '<p>' + restaurant.title + '</p>'
        });
        google.maps.event.addListener(marker, 'click', function () {
            infowindow.open(map, marker);
        });
    }
    function getRestaurants() {
        return fetch('data2.json')
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