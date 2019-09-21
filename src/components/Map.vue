<template>
  <div class="map">
    <LMap
      style="height: 100%; width: 100%"
      :zoom="zoom"
      :center="center"
      :options="options"
      :bounds="bounds"
      @update:zoom="zoomUpdated"
      @update:center="centerUpdated"
      @update:bounds="boundsUpdated"
    >
      <LTileLayer :url="url"/>
      <Vue2LeafletMarkerCluster ref="cluster">
        <RestaurantMarker ref="restaurant_marker" v-for="restaurant in restaurantList"
          :key="restaurant.title"
          :restaurant="restaurant">
        </RestaurantMarker>
      </Vue2LeafletMarkerCluster>
    </LMap>
  </div>
</template>

<script lang="ts">
//@ts-ignore
import { Icon, DivIcon, Point } from "leaflet";
import { Component, Prop, Vue } from 'vue-property-decorator';
import {LMap, LTileLayer, LMarker, LPopup} from 'vue2-leaflet'
import { Restaurant } from '../Restaurant';
import RestaurantMarker from './RestaurantMarker.vue';
//@ts-ignore
import Vue2LeafletMarkerCluster from 'vue2-leaflet-markercluster';

@Component<Map>({
  components: {
    LMap,
    LTileLayer,
    RestaurantMarker,
    Vue2LeafletMarkerCluster,
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
  },
  watch: {
    boundsProp: function(bounds) {
      this.bounds = bounds;
    },
  },
})
export default class Map extends Vue {
  private url = "https://api.tiles.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw";
  private zoom = 14;
  private center = [60.167255, 24.940523];
  private bounds = null;
  //@ts-ignore
  private map: LMap;
  private showParagraph = false;
  private testFilter = false;
  private options = {
    zoomControl: false,
  }

  //@ts-ignore
  @Prop() restaurants: Restaurant[];
  @Prop() boundsProp: any;

  created(): void {
    let vh = window.innerHeight * 0.01;
      // Set calculeted custom vh to the property to be used in css.
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    window.addEventListener('resize', () => {
      let vh = window.innerHeight * 0.01;
      // Set calculeted custom vh to the property to be used in css.
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    });

    delete Icon.Default.prototype._getIconUrl
    Icon.Default.imagePath = '/';
    Icon.Default.mergeOptions({
        iconRetinaUrl: require('../assets/orange_carrot.png'),
        iconUrl: require('../assets/orange_carrot.png'),
        //shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
    });
  }

  mounted(): void {
    this.$nextTick(() => {
      (this.$refs.cluster as any).mapObject.options.iconCreateFunction = this.test;
    })
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.setPosition);
    }
  }

  public get markers(): any {
    return this.$refs.restaurant_marker;
  }

  private test(cluster: any): void {
    let childCount = cluster.getChildCount();

    let html = '<div class="carrot"></div>';

		return new DivIcon({ html, className: 'marker-cluster', iconSize: new Point(50, 50) });
	
  }

  private get restaurantList(): Restaurant[] {
    let temp = this.restaurants.filter(restaurant => restaurant.location);
    return temp;
  }

  private setPosition(position: Position): void {
    this.center = [position.coords.latitude, position.coords.longitude]
    this.zoom = 14;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import "~leaflet/dist/leaflet.css";
@import "~leaflet.markercluster/dist/MarkerCluster.css";
@import "~leaflet.markercluster/dist/MarkerCluster.Default.css";
  .map {
    width: 100vw;
    height: 100vh;
    height: calc(var(--vh, 1vh) * 100);
  }

  .carrot {
    background-image: url("../assets/cluster.png");
    line-height: 32px;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    height: 52px !important;
    width: 52px !important;
  }

  .marker-cluster {
    height: 34px !important;
    width: 34px !important;
    font: 12px !important;
  }

  .leaflet-marker-icon {
    height: 40px !important;
    width: 40px !important;
  }

</style>
