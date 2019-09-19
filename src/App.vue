<template>
  <div id="app">
    <div class="app__header">
      <div class="app__header__image">
        <img src="./assets/header.png"/>
      </div>
    </div>
    <div class="app__info"
      @click="informationClickHanler">
      <div class="app__info__container" :class="{'extended' : showInformation}">
        <transition name="fade">
          <div v-if="showInformation" class="app__info__container__content">
            <p>Opiskelijaravintolat sivulta löydät kaikki ravintolat koko Suomesta joihin Kela myöntää ateriatukea. 
              Ravintolan merkkiä klikkaamalla näet kyseisen ravintolat lounaslistan sekä aukioloajat. 
              Rajapintojen puutteiden vuoksi joidenkin ravintoloiden ruokalistoja tai lounasaikoja ei välttämättä ole saatavilla.
            </p>
            <br>
            <p class="app__info__container__content__disclaimer">
              Ravintoloiden sijainti kartalla on suuntaa antava ja se pohjautuu ravintoloiden Kelalle antamaan osoitteistoon.
            </p>
          </div>
        </transition>
        <i class="fa fa-info app__info__container__icon"></i>
      </div>
    </div>
    <SearchBar class="app__search_bar" v-model="keywords"></SearchBar>
    <Map ref="map" :boundsProp="bounds" :restaurants="restaurantArray"></Map>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Map from './components/Map.vue';
import { Restaurant } from './Restaurant';
import SearchBar from './components/SearchBar.vue';
import RestaurantMarker from './components/RestaurantMarker.vue';

declare const L: any;

@Component<App>({
  components: {
    Map,
    SearchBar,
  },
  watch: {
    keywords: function(newVal): void {
      this.restaurantArray = this.restaurantList.filter(restaurant => {
        if (!restaurant.title || !restaurant.address) {
          return false;
        }
        if (restaurant.title.toLowerCase().includes(newVal.toLowerCase())) {
          return true;
        } else if (restaurant.address.toLowerCase().includes(newVal.toLowerCase())) {
          return true;
        } else {
          return false;
        }
      })
      this.$nextTick(() => {
        let markerClusterGroup = L.markerClusterGroup();
        for (let marker of ((this.$refs.map as Map).markers as RestaurantMarker[])) {
          markerClusterGroup.addLayer(marker.marker);
        }
        console.log(markerClusterGroup)
        let bounds = markerClusterGroup.getBounds();
        console.log(bounds);
        this.bounds = bounds;
      })
      /* this.$nextTick(() => {
        setTimeout(() => {
          console.log(this.$refs.marker)
          let markers = MarkerClusterGroup();
          for (let marker of (this.$refs.marker as RestaurantMarker[])) {
            console.log(marker)
            //markers.push(marker.marker);
          }
          console.log(markers)
        }, 0)
        
      })
      let markers = MarkerClusterGroup();
      for(let i = 0; i < m.length; i++){
          markers.addLayer(m[i]);
      } */
    }
  }
})
export default class App extends Vue {
  private restaurantList: Restaurant[] = [];
  private restaurantArray: Restaurant[] = [];
  private timeout = 0;
  private showInformation = false;
  private content = 0;
  private keywords = "";
  private bounds = null;

  private getRestaurants(): Promise<Restaurant[]> {
    return fetch('https://akalhainen.me/ruokalistat/restaurants.json')
      .then(function(response) {
        return response.json();
      })
  }

  private informationClickHanler(e: Event): void {
    this.content = this.content + 1;
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
            this.restaurantArray.push(newRestaurant)
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

html {
  overflow: hidden;
}

.app {

  &__header {
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 99999;
    background-color: #ffffff;
    padding: 0 5px;
    height: 70px;
    width: 226px;

    &__image {
      height: 66px;
    }
  }

  &__info {
    position: absolute;
    bottom: 66px;
    right: 10px;
    border: 1px solid lightgray;
    background-color: whitesmoke;
    color: #333333;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-end;
    z-index: 99999;
    cursor: pointer;
    overflow: hidden;

    &__container {
      position: relative;
      padding-bottom: 30px;
      height: 30px;
      width: 30px;
      max-height: 30px;
      max-width: 30px;
      transition: all .3s;
      &__icon {
        position: absolute;
        bottom: 6px;
        right: 11px;
      }

      &__content {
        padding: 5px 10px;
      }

      &.extended {
        transition: all .3s;
        width: calc(100vw - 20px);
        height: 240px;
        max-width: 650px;
        max-height: 100%;
        @media screen and ( min-width: 650px ) {
          max-height: 200px;
        }
      }
    }
  }

  &__search_bar {
    position: absolute;
    bottom: 25px;
    right: 0px;
    width: calc(100vw - 20px);
    height: 32px;
    margin: 0 10px;
    z-index: 99999;
  }
}

body {
  margin: 0;
  overflow: hidden;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .3s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
.fa {
  color: #a5c996;
}
</style>
