<template>
    <LMarker ref="marker" :lat-lng="convertLatLng(restaurant.location)"
        @click="clickHandler">
        <l-popup>
            <Popup :restaurant="restaurant" :loadMenu="loadMenu"></Popup>
        </l-popup>
    </LMarker>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Restaurant } from '../Restaurant';
import {LMarker, LPopup} from 'vue2-leaflet'
//@ts-ignore
import { latLng } from "leaflet";
import Popup from './Popup.vue';

@Component({
    components: {
        LMarker,
        LPopup,
        Popup,
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
        this.loadMenu = true;
    }

    private convertLatLng(location: Restaurant["location"]): any {
        return latLng(location.lat, location.lng);
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
