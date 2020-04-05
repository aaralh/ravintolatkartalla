<template>
  <div class="map">
    <LMap
      ref="map"
      style="height: 100%; width: 100%"
      :zoom="zoom"
      :center="center"
      :options="options"
      :bounds="bounds"
      :minZoom="3"
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
      <LMarker ref="userLocation" v-if="accessUserLocation" :lat-lng="userLocation" ></LMarker>
    </LMap>
  </div>
</template>

<script lang="ts">
//@ts-ignore
import { Icon, DivIcon, Point } from "leaflet";
import { Component, Prop, Vue } from 'vue-property-decorator';
import {LMap, LTileLayer, LMarker, LPopup} from 'vue2-leaflet'
import { Restaurant, RestaurantObject } from '../Restaurant';
import RestaurantMarker from './RestaurantMarker.vue';
//@ts-ignore
import { latLng } from "leaflet";
//@ts-ignore
import Vue2LeafletMarkerCluster from 'vue2-leaflet-markercluster';
import { mapGetters } from 'vuex';

// Declare leaflet L.
declare const L: any;

@Component<Map>({
  components: {
    LMap,
    LTileLayer,
    LMarker,
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
    zoomProp: function(zoom) {
      this.zoom = zoom;
    },
    activeRestaurant(newVal: RestaurantObject): void {
      if (newVal) {
        let position = {
          coords: {
            latitude: (+newVal.location.lat - 0.006)+"",
            longitude: newVal.location.lng,
          }
        }
        this.setPosition(position, 0, .7);
      }
	  }
  },
  computed: {
    ...mapGetters(["activeRestaurant"]),
  }
})
export default class Map extends Vue {
  private url = 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png';
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
  private attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
  private accessUserLocation = false;
  private userLocation: any = null

  //@ts-ignore
  @Prop() restaurants: Restaurant[];
  @Prop() boundsProp: any;
  //@ts-ignore
  @Prop() zoomProp: number;


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
        iconRetinaUrl: require('../assets/carrot_with_shadow.png'),
        iconUrl: require('../assets/carrot_with_shadow.png'),
        shadowUrl: '',
    });
  }

  mounted(): void {
    this.$nextTick(() => {
      (this.$refs.cluster as any).mapObject.options.iconCreateFunction = this.test;
    })
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.setPosition);
    }
    (this.$refs.map as any).mapObject.attributionControl.addAttribution(this.attribution);
    (this.$refs.map as any).mapObject.locate({
        watch:true,
        enableHighAccuracy:true
      }).on("locationfound", (e: any) => {
        this.userLocation = this.convertLatLng(e.latitude, e.longitude)
        if (!this.accessUserLocation) {
          this.accessUserLocation = true;
          this.$nextTick(() => {
            let userMarker = (this.$refs.userLocation as any).mapObject;
            let myIconReplc = L.Icon.extend({
              options: {
                  iconUrl: require("../assets/location.png"),
                  iconSize: [20,20],
                  //shadowUrl: "../resources/img/map/icons/shadow.png",
                  shadowAnchor: [8, 20],
                  shadowSize: [25, 18],
                  //iconSize: [20, 25],
                  iconAnchor: [8, 30] // horizontal puis vertical
              }
            });
            userMarker.setIcon(new myIconReplc);
            (userMarker._icon as HTMLElement).classList.add("user_location");
          })
        }
      })
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

  private setPosition(position: Position|{coords: {latitude: string, longitude: string}}, delay = 500, duration = 1): void {
    this.zoom = 14;
    setTimeout(() => {
      (this.$refs.map as any).mapObject.setView([position.coords.latitude, position.coords.longitude], (this.$refs.map as any).mapObject.getZoom(), {
        "animate": true,
        "pan": {
          "duration": duration
        }
      });
    }, delay);
  }

  private convertLatLng(lat: number, lng: number): any {
    return latLng(lat, lng);
  }

  public zoomIn(): void {
    this.zoom++;
  }

  public zoomOut(): void {
    this.zoom--;
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
    background-image: url("../assets/cluster_with_shadow.png");
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

  .user_location {
    height: 27px !important;
    width: 27px !important;
  }

</style>
