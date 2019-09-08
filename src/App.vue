<template>
  <div id="app">
    <div class="app__info"
      :class="{'minimized' : !showInformation}"
      @click.stop="informationClickHanler">
      <i class="fa fa-info app__info__icon"></i>
      <div class="app__info__content">
        <p>Opiskelijaravintolat sivulta löydät kaikki ravintolat koko Suomesta joihin Kela myöntää ateriatukea. 
          Ravintolan merkkiä klikkaamalla näet kyseisen ravintolat lounaslistan sekä aukioloajat. 
          Rajapintojen puutteiden vuoksi kaikkien ravintoloiden ruokalistoja tai lounasaikoja ei välttämättä ole saatavilla.
        </p>
        <br>
        <p class="app__info__content__disclaimer">
          Ravintoloiden sijainti kartalla on suuntaa antava ja se pohjautuu ravintoloiden Kelalle antamaan osoitteistoon.
        </p>
      </div>
    </div>

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
  private showInformation = false;

  private getRestaurants(): Promise<Restaurant[]> {
    return fetch('https://akalhainen.me/ruokalistat/restaurants.json')
      .then(function(response) {
        return response.json();
      })
  }

  private informationClickHanler(e: Event): void {
    this.showInformation = !this.showInformation;
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
      //window.location.reload(true);
  };
}
</script>

<style lang="scss">
.app__info {
    position: absolute;
    top: 10px;
    right: 10px;
    max-height: 100%;
    max-width: calc(100vw - 20px);
    border: 1px solid lightgray;
    background-color: whitesmoke;
    color: #333333;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-end;
    z-index: 99999;
    transition: clip-path .3s;
    clip-path: inset(0 0 0 0);
    

    &.minimized {
        transition: clip-path .3s;
        clip-path: inset(0 0 calc(100% - 30px) calc(100% - 30px));
    }

    &__icon {
        margin: 6px 11px;
    }

    &__content {
        padding: 5px 10px;
    }
}

body {
  margin: 0;
  overflow: hidden;
}
</style>
