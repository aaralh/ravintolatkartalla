<template>
    <div class="bottom_popup">
        <div class="bottom_popup__close" @click="handleClose()">
            <i class="fa fa-times" aria-hidden="true"></i>
        </div>
        <div class="bottom_popup__content">
            <Carousel v-if="restaurants.length" class="full_height" @page-change="handlePageChange" :perPage="1">
                <Slide class="full_height" v-for="restaurant in restaurants" :key="restaurant.address">
                    <RestaurantInfo class="restaurant_info2" :restaurant="restaurant" :loadMenu="true" :forceMenuLoad="true"></RestaurantInfo>
                </Slide>
            </Carousel>
            <div v-else class="no_favourites_info">
                <div class="no_favourites_info__content">
                    <div class="title">Hups, sinulla ei vielä ole suosikkiravintoloita.</div>
                    <div class="text">Lisää haluamasi ravintolat suosikiksi painamalla ravintolakortilta löytyvää <i class="fa fa-star-o"></i> -symbolia,
                    niin voit selata ruokalistat tässä paneelissa nopeasti.</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Restaurant, RestaurantObject } from '../Restaurant';
import RestaurantInfo from './RestaurantInfo.vue';
//@ts-ignore
import { Carousel, Slide } from 'vue-carousel';

@Component<BottomPopup>({
    components: {
        RestaurantInfo,
        Carousel,
        Slide,
    },
    watch: {
        selectedRestaurants(): void {
            this.updateRestaurants();
        }
    }
})
export default class BottomPopup extends Vue {

    //@ts-ignore
    @Prop() selectedRestaurants: RestaurantObject[];
    private restaurants: Restaurant[] = [];

    public mounted(): void {
        this.updateRestaurants();
    }

    public updateRestaurants(): void {
        this.restaurants = this.selectedRestaurants.map(restaurant => new Restaurant(
            restaurant.title,
            restaurant.address,
            restaurant.location,
            restaurant.website,
            restaurant.type,
            restaurant.lunchUrl
        ));
        if (this.restaurants.length) {
            this.$store.commit("activeRestaurant", this.restaurants[0].toObject());
        }
    }

    public handlePageChange(pageNumber: number): void {
        if (this.restaurants.length > pageNumber) {
            this.$store.commit("activeRestaurant", this.restaurants[pageNumber].toObject());
        }
    }

    public handleClose(): void {
        this.$store.commit("showBottomPopup", false);
        setTimeout(() => {
            this.restaurants = [];
            this.$store.commit("selectedRestaurants", []);
            this.$store.commit("activeRestaurant", null);
        }, 500)
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

    .full_height {
        height: 100%;
        max-width: 100vw;
    }

    .restaurant_info2 {
        max-width: 94vw;
    }
    

    .bottom_popup {
        width: 100vw;
        height: 60vh;
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 99999;
        background: rgba(255, 255, 255, 0.8);
        border-top: 1px solid lightgray;
        border-radius: 15px 15px 0px 0px;

        &__close {
            height: 32px;
            width: 32px;
            z-index: 999999;
            position: absolute;
            top: 6px;
            right: 7px;
            font-size: 21px;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
        }

        &__content {
            padding: 10px;
            height: 100%;

            .no_favourites_info {
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;

                &__content {
                    width: 50%;
                    min-width: 332px;
                    font-size: 18px;

                    & > .title {
                        color: #2f2f2f;
                        margin-bottom: 7px;
                        font-weight: bolder;
                    }

                    & > .text {
                        color: #4a4a4a;
                    }
                }
            }
        }
    }

</style>
