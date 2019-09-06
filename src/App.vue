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
  data() {
    return {

    };
  }
})
export default class App extends Vue {
  private restaurantList: Restaurant[] = [];
  private timeout = 0;

  private getRestaurants(): Promise<Restaurant[]> {
    return fetch('https://akalhainen.me/ruokalistat/restaurants.json')
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

    document.addEventListener(
      'swUpdated', this.updateApp, { once: true }
    );
  }

  private updateApp (e: any) {
      console.log("Deploying update..")
      window.location.reload(true);
  };
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
