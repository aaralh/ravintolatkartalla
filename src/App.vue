<template>
  <div id="app">
    <Map :restaurants="restaurantList"></Map>
    <!-- <v-snackbar
      v-model="snackWithButtons"
      :timeout="timeout"
      bottom
      center
      class="snack">
      {{ snackWithBtnText }}
      <v-spacer />
      <v-btn
        dark
        text
        color="#00f500"
        @click.native="refreshApp">
        {{ snackBtnText }}
      </v-btn>
      <v-btn
        icon
        @click="snackWithButtons = false">
      </v-btn>
    </v-snackbar> -->
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
  private refreshing = false;
  private registration = null;
  private updateExists = false;
  private snackBtnText = 'Päivitä';
  private snackWithBtnText = 'Päivityksiä saatavilla';
  private snackWithButtons = false;
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
      'swUpdated', this.showRefreshUI, { once: true }
    );
    navigator.serviceWorker.addEventListener(
      'controllerchange', () => {
        if (this.refreshing) return;
        this.refreshing = true;
        window.location.reload();
      }
    );
  }

  private showRefreshUI (e: any) {
    this.registration = e.detail;
    this.updateExists = true;
  };

  private refreshApp () {
    this.updateExists = false;
    //@ts-ignore
    if (!this.registration || !this.registration.waiting) { return; }
    //@ts-ignore
    this.registration.waiting.postMessage('skipWaiting');
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
