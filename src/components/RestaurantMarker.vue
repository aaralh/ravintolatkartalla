<template>
	<LMarker ref="marker" :lat-lng="convertLatLng(restaurant.location)" @click="clickHandler">
		<!-- <l-popup>
            <Popup :restaurant="restaurant" :loadMenu="loadMenu"></Popup>
		</l-popup>-->
	</LMarker>
</template>

<script lang="ts">
	import { Component, Prop, Vue } from 'vue-property-decorator';
	import { Restaurant, RestaurantObject } from '../Restaurant';
	import { LMarker, LPopup } from 'vue2-leaflet'
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
		computed: {
			...mapGetters(["activeRestaurant"]),
		}
	})
	export default class RestaurantMarker extends Vue {

		//@ts-ignore
        @Prop() restaurant: Restaurant;
        private declare activeRestaurant: RestaurantObject;
		private loadMenu = false;

		public setActive(status = true): void {
            try {
                if (this.activeRestaurant !== null) {
                    if (this.activeRestaurant.address === this.restaurant.address && status) {
                        (this.$refs.marker as any).mapObject._icon.classList.add("active_marker");
                    } else {
                        (this.$refs.marker as any).mapObject._icon.classList.remove("active_marker");
                    }
                } else {
                    (this.$refs.marker as any).mapObject._icon.classList.remove("active_marker");
                }
            } catch(e) {
				// The only error that may happen is that when the marker on the map is not visible when the class list is modified.
                console.error(e)
            }
        }

		public get marker(): any {
			return (this.$refs.marker as any).mapObject;
        }

		/**
		 * Handle restaurant marker click.
		 */
		private clickHandler(): void {
			this.$emit("markerClicked", this.restaurant.toObject())
		}

		/**
		 * Converts given location to leaflets latLng format.
		 * 
		 * @param location Location which will be converted.
		 * 
		 * @return Leaflets latLng format presentation of the given location.
		 */
		private convertLatLng(location: Restaurant["location"]) {
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
