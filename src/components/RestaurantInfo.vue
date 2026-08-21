<template>
	<div class="restaurant_info">
		<div v-if="hasTime" class="restaurant_info__label__lunchtime">Lounasaika: {{ lunchTime }}</div>
		<div v-if="menuUpdatedAt" class="restaurant_info__label__updated">Ruokalista päivitetty: {{ formatDateTime(menuUpdatedAt) }}</div>
		<div v-if="menuDate && !isToday(menuDate)" class="restaurant_info__label__stale">Huom: ruokalista on päivältä {{ formatDate(menuDate) }}</div>
		<div class="restaurant_info__label__title_wrap">
			<div class="restaurant_info__label__title">{{ title }}</div>
			<div class="restaurant_info__label__favourite" @click="handleFavourite()">
				<i v-if="isFavourite" class="fa fa-star"></i>
				<i v-else class="fa fa-star-o"></i>
			</div>
		</div>
		<div class="restaurant_info__label__address">Osoite: {{ restaurant.address }}</div>
		<div v-if="hasMenu" class="restaurant_info__menu">
			<AccordionItem :lunchMenuItem="item" v-for="item in lunchMenu" :key="item.Name"></AccordionItem>
		</div>
		<div v-else-if="!hasMenu && restaurant.website && !restaurant.lunchUrl" class="restaurant_info__link">
			<p>Valitettavasti lounaslistaa ei ole saatavissa. Löydät ravintolan verkkosivun <a rel="noopener" :href="restaurant.website">täältä.</a></p>
		</div>
		<div v-else class="restaurant_info__link">
			<p>Valitettavasti tämän päivän lounaslistaa ei ole saatavissa.</p>
		</div>
		<div v-if="isLoading" class="restaurant_info__loading">
			<i class="fa fa-spinner fa-spin"></i>
		</div>
	</div>
</template>

<script lang="ts">
	import { Component, Prop, Vue } from 'vue-property-decorator';
	import { Restaurant } from '../Restaurant';
	import Incredient from './Incredient.vue';
	import AccordionItem from './AccordionItem.vue';
	import { getFavouriteRestaurants, addFavouriteRestaurant, removeFavouriteRestaurant, fetchLuchMenu, FoodMenu, formatDateTime, formatDate, isToday } from "../utils";



	@Component<RestaurantInfo>({
		components: {
			Incredient,
			AccordionItem,
		},
		watch: {
			loadMenu: function (newVal, oldVal) {
				if (!oldVal && newVal) {
					this.updateMenuData();
				}
			}
		}
	})
	export default class RestaurantInfo extends Vue {

		//@ts-ignore
		@Prop() restaurant: Restaurant;
		//@ts-ignore
		@Prop() loadMenu: boolean;
		//@ts-ignore
		@Prop() forceMenuLoad: boolean;

		private lunchMenu: FoodMenu[] = [];
		private lunchTime = "";
		// Initialised to "" (not undefined) so vue-class-component makes them reactive.
		private menuUpdatedAt = "";
		private menuDate = "";
		private title = "";
		private hasMenu = true;
		private hasTime = true;
		private isLoading = true;
		private isFavourite = false;

		/**
		 * Vue created hook.
		 */
		public created(): void {
			this.title = this.restaurant.title
			let restaurants = getFavouriteRestaurants();
			let filteredRestaurants = restaurants.filter(restaurant => restaurant.address === this.restaurant.address);
			if (filteredRestaurants.length > 0) {
				this.isFavourite = true;
			}
			if (this.forceMenuLoad) {
				this.updateMenuData();
			}
		}

		/**
		 * Fetches and updates the restaurant info.
		 */
		private updateMenuData(): void {
			if (this.restaurant.lunchUrl) {
				fetchLuchMenu(this.restaurant.lunchUrl, this.restaurant).then(menu => {
					this.isLoading = false;
					this.lunchMenu = menu.lunchMenu;
					this.lunchTime = menu.lunchTime;
					this.menuUpdatedAt = menu.updatedAt;
					this.menuDate = menu.menuDate;
					this.hasMenu = menu.hasMenu;
					this.hasTime = menu.hasTime;
					if (menu.title) {
						this.title = menu.title;
					}
				});
			} else {
				this.isLoading = false;
				this.hasMenu = false;
				this.hasTime = false;
			}
		}

		/**
		 * Handles favourite button click.
		 */
		private handleFavourite(): void {
			if (this.isFavourite) {
				removeFavouriteRestaurant(this.restaurant);
			} else {
				addFavouriteRestaurant(this.restaurant);
			}
			this.isFavourite = !this.isFavourite;
		}

		// Imported functions aren't reachable from the template, so expose them as methods.
		private formatDateTime(iso: string): string {
			return formatDateTime(iso);
		}

		private formatDate(isoDate: string): string {
			return formatDate(isoDate);
		}

		private isToday(isoDate: string): boolean {
			return isToday(isoDate);
		}

	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
	.VueCarousel {
		&-wrapper {
			height: 100% !important;
		}

		&-inner {
			height: 100% !important;
		}
	}

	.restaurant_info {
		height: 100%;
		width: 100%;
		font: 12px/1.5 "Helvetica Neue", Arial, Helvetica, sans-serif;

		&__link {
			width: 100%;
			height: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 16px;
		}

		&__label {
			&__title {
				font-size: 18px;
				color: #383838;

				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				max-width: 75%;
			}

			&__title_wrap {
				display: flex;
				max-width: 100vw;
			}

			&__favourite {
				height: 25px;
				width: 25px;
				font-size: 21px;
				margin-left: 5px;
			}

			&__address {
				font-size: 12px;
				color: #7a7a7a;
			}

			&__lunchtime,
			&__updated {
				color: #595959;
				font-size: 10px;
			}

			&__stale {
				color: #b35c00;
				font-size: 10px;
				font-weight: bold;
			}
		}
		&__menu {
			display: grid;
			grid-template-columns: 1fr;
			grid-column-gap: 10px;
			grid-row-gap: 15px;
			margin-top: 5px;
			max-height: 80vh;
			overflow-x: hidden;

			&__item {
				display: grid;
				grid-template-columns: 33% 33% 33%;
				grid-column-gap: 5px;
				word-break: break-word;

				&__title {
					font-size: 14px;
					color: #383838;
				}

				&__labels {
					display: grid;
					grid-template-columns: 33% 33% 33%;
				}
			}
		}

		&__loading {
			display: flex;
			justify-content: center;
			align-items: center;
			padding-top: 5px;
			& > i {
				font-size: 30px;
			}
		}
	}
</style>