<template>
    <LMarker ref="marker" :lat-lng="convertLatLng(restaurant.location)"
        @click="clickHandler">
        <!-- <l-popup>
            <Popup :restaurant="restaurant" :loadMenu="loadMenu"></Popup>
        </l-popup> -->
    </LMarker>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Restaurant, RestaurantObject } from '../Restaurant';
import {LMarker, LPopup} from 'vue2-leaflet'
//@ts-ignore
import { latLng } from "leaflet";
import Popup from './Popup.vue';
import { mapGetters } from 'vuex';

@Component<RestaurantMarker>({
    components: {
        LMarker,
        LPopup,
        Popup,
    },
    watch: {
        activeRestaurant(newVal: RestaurantObject): void {
            /* if (newVal && (this.$refs.marker as any).mapObject._icon) {
                if (newVal.address === this.restaurant.address) {
                    (this.$refs.marker as any).mapObject._icon.classList.add("active_marker");
                } else {
                    (this.$refs.marker as any).mapObject._icon.classList.remove("active_marker");
                }
            } else {
                (this.$refs.marker as any).mapObject._icon.classList.remove("active_marker");
            } */
        }
    },
    computed: {
        ...mapGetters(["activeRestaurant"]),
    }
})
export default class RestaurantMarker extends Vue {

    //@ts-ignore
    @Prop() restaurant: Restaurant;
    private loadMenu = false;

    mounted(): void {
        
    }

    public get marker(): any {
        return (this.$refs.marker as any).mapObject;
    }

    private clickHandler(): void {
        //this.loadMenu = true;
        this.$store.commit("activeRestaurant", this.restaurant.toObject());
        this.$store.commit("selectedRestaurants", [this.restaurant.toObject()]);
        this.$store.commit("showBottomPopup", true);
    }

    private convertLatLng(location: Restaurant["location"]): any {
        return latLng(location.lat, location.lng);
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
    .leaflet-popup-content-wrapper {
        background: rgba(255, 255, 255, 0.8) !important;
    }

    .leaflet-popup-tip {
        background: rgba(255, 255, 255, 0.8) !important;
    }

    .active_marker {
        background: #1e953ea8;
        border-radius: 120px 120px 120px 15px;
    }

</style>
