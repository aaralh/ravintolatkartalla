<template>
  <div class="map">
    <LMap
      style="height: 100%; width: 100%"
      :zoom="zoom"
      :center="center"
      @update:zoom="zoomUpdated"
      @update:center="centerUpdated"
      @update:bounds="boundsUpdated"
    >
      <LTileLayer :url="url"/>
      <RestaurantMarker v-for="restaurant in restaurantList"
        :key="restaurant.title"
        :restaurant="restaurant">
      </RestaurantMarker>
    </LMap>
  </div>
</template>

<script lang="ts">
//@ts-ignore
import { Icon } from "leaflet";
import { Component, Prop, Vue } from 'vue-property-decorator';
import {LMap, LTileLayer, LMarker, LPopup} from 'vue2-leaflet'
import { Restaurant } from '../Restaurant';
import RestaurantMarker from './RestaurantMarker.vue';

@Component<Map>({
  components: {
    LMap,
    LTileLayer,
    RestaurantMarker,
  },
  methods: {
    zoomUpdated (zoom) {
      this.zoom = zoom;
    },
    centerUpdated (center) {
      this.center = center;
    },
    boundsUpdated (bounds) {
      this.bounds = bounds;
    },
  }
})
export default class Map extends Vue {
  private url = "https://api.tiles.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw";
  private zoom = 3;
  private center = [0, 0];
  private bounds = null;
  private map: LMap|null = null;
  private showParagraph = false;

  @Prop() restaurants: Restaurant[] = [];

  mounted(): void {
    delete Icon.Default.prototype._getIconUrl
    Icon.Default.imagePath = '/';
    Icon.Default.mergeOptions({
        iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
        iconUrl: require('leaflet/dist/images/marker-icon.png'),
        shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
    });
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.setPosition);
    }
  }


  private get restaurantList(): Restaurant[] {
    let temp = this.restaurants.filter(restaurant => restaurant.location !== null);
    return temp;
  }

  private setPosition(position: Position): void {
    this.center = [position.coords.latitude, position.coords.longitude]
    this.zoom = 14;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "~leaflet/dist/leaflet.css";
  .map {
    width: 100vw;
    height: 100vh;
  }
</style>
