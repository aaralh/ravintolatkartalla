namespace restaurants_on_map {
    let map;
    let labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let labelIndex = 0;
    
    function init(position: Position): void {
        map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: position.coords.latitude, lng: position.coords.longitude},
            zoom: 11
        });
        getRestaurants().then(restaurants => {
            restaurants.forEach(restaurant => {
                addMarker(restaurant, map)
            })
        });
    }

    function addMarker(restaurant, map) {
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(+restaurant.location.lat, +restaurant.location.lng)
            label: labels[labelIndex++ % labels.length],
            map: map
        });
        var infowindow = new google.maps.InfoWindow({
            content: '<p>' + restaurant.title + '</p>'
        });

        google.maps.event.addListener(marker, 'click', function() {
            infowindow.open(map, marker);
        });
    }

    function  getRestaurants(): Promise<{[key: string]: any}> {
        return fetch('/data2.json')
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

    