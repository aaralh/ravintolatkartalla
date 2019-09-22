<template>
  <div id="app">
    <div class="app__header">
      <div class="app__header__image">
        <img src="./assets/header.png"/>
      </div>
    </div>
    <div v-if="!isMobile" @click="zoomMapIn" class="app__zoom_in">
      <img src="./assets/plus.png" alt="zoom in">
    </div>
    <div v-if="!isMobile" @click="zoomMapOut" class="app__zoom_out">
      <img src="./assets/minus.png" alt="zoom out">
    </div>
    <div class="app__info"
      @click="informationClickHanler">
      <div class="app__info__container" :class="{'extended' : showInformation}">
        <transition name="fade">
          <div v-show="showInformation" class="app__info__container__content">
            <p>Opiskelijaravintolat sivulta löydät kaikki Opiskelijaravintolat koko Suomesta. 
              Ravintolan merkkiä klikkaamalla näet kyseisen ravintolan lounaslistan sekä aukioloajat. 
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
    <Map ref="map" :boundsProp="bounds" :restaurants="restaurantArray" :zoomProp="mapZoom"></Map>
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
        setTimeout(() => {
          let markerClusterGroup = L.markerClusterGroup();
          for (let marker of ((this.$refs.map as Map).markers as RestaurantMarker[])) {
            markerClusterGroup.addLayer(marker.marker);
          }
          let bounds = markerClusterGroup.getBounds();
          this.bounds = bounds;

          if ((this.$refs.map as Map).markers.length === 1 && this.isMobile) {
            this.mapZoom = 16;
          }
        }, 0)
      })
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
  private mapZoom: null | number = null;

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

  private get isMobile(): boolean {
    let check = false;
    //@ts-ignore
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
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

  private zoomMapIn(): void {
    (this.$refs.map as Map).zoomIn();
  }

  private zoomMapOut(): void {
    (this.$refs.map as Map).zoomOut();
  }
}
</script>

<style lang="scss">

html {
  overflow: hidden;
}

.app {

  &__zoom {


    &_in {
      position: absolute;
      border: 1px solid lightgray;
      background-color: whitesmoke;
      color: #333333;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      z-index: 99999;
      cursor: pointer;
      bottom: 107px;
      right: 10px;
      height: 30px;
      width: 30px;

       & > img {
        height: 90%;
        width: 90%;
      }
    }

    &_out {
      position: absolute;
      border: 1px solid lightgray;
      background-color: whitesmoke;
      color: #333333;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      z-index: 99999;
      cursor: pointer;
      bottom: 147px;
      right: 10px;
      height: 30px;
      width: 30px;

      & > img {
        height: 90%;
        width: 90%;
      }
    }
  }

  &__header {
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 99999;
    background-color: #ffffffbf;
    height: 76px;
    width: 218px;

    &__image {
      height: 76px;
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
      overflow: hidden;
      &__icon {
        position: absolute;
        bottom: 6px;
        right: 11px;
      }

      &__content {
        padding: 5px 10px;
        width: calc(100vw - 20px);
        max-width: calc(650px - 20px);
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
  color: #87b877;
}
</style>
