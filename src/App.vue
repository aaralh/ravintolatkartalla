<template>
  <div id="app">
    <Map :restaurants="restaurantList"></Map>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Map from './components/Map.vue';
import { Restaurant } from './Restaurant';

@Component({
  components: {
    Map,
  },
})
export default class App extends Vue {
  private restaurantList: Restaurant[] = [];

  private getRestaurants(): Promise<Restaurant[]> {
    return fetch('restaurants.json')
      .then(function(response) {
        return response.json();
      })
  }

  created(): void {
    this.getRestaurants().then(restaurants => {
            restaurants.forEach(restaurant => {
                let newRestaurant = new Restaurant(
                    restaurant.title,
                    restaurant.address,
                    restaurant.location,
                    restaurant.website,
                    restaurant.type,
                    restaurant.lunchUrl
                )
                this.restaurantList.push(newRestaurant);
            })
        });
  }
}
</script>

<style lang="scss">
#app {
}

body {
  margin: 0;
  overflow: hidden;
}
</style>
