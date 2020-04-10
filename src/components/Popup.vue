<template>
	<div class="popup">
		<RestaurantInfo :restaurant="restaurant" :loadMenu="loadMenu" :forceMenuLoad="false"></RestaurantInfo>
	</div>
</template>

<script lang="ts">
	import { Component, Prop, Vue } from 'vue-property-decorator';
	import { Restaurant } from '../Restaurant';
	import RestaurantInfo from './RestaurantInfo.vue';

	@Component<Popup>({
		components: {
			RestaurantInfo,
		},
	})
	export default class Popup extends Vue {

		//@ts-ignore
		@Prop() restaurant: Restaurant;
		//@ts-ignore
		@Prop() loadMenu: boolean;
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
	.popup {
		height: 100%;
		width: 100%;
	}

	a.leaflet-popup-close-button {
		color: #a5c996 !important;
	}
</style>
