<template>
    <div class="bottom_popup" v-if="selectedRestaurants.length">
        <div class="bottom_popup__close" @click="handleClose()">
            <i class="fa fa-times" aria-hidden="true"></i>
        </div>
        <div class="bottom_popup__content">
            <RestaurantInfo v-for="restaurant in selectedRestaurants" :key="restaurant.address" :restaurant="restaurant" :loadMenu="true" :forceMenuLoad="true"></RestaurantInfo>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Restaurant, RestaurantObject } from '../Restaurant';
import RestaurantInfo from './RestaurantInfo.vue';

@Component<BottomPopup>({
    components: {
        RestaurantInfo,
    },
})
export default class BottomPopup extends Vue {

    //@ts-ignore
    @Prop() selectedRestaurants: RestaurantObject[];
    private restaurants: Restaurant[] = [];

    public handleClose(): void {
        this.$store.commit("selectedRestaurants", []);
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

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

            position: absolute;
            top: 6px;
            right: 7px;
            font-size: 21px;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        &__content {
            padding: 10px;
        }
    }

</style>
