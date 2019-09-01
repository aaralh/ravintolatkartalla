<template>
  <div class="popup">
      <div class="popup__label">{{ title }}</div>
      <div class="popup__label">Osoite: {{ restaurant.address }}</div>
      <div class="popup__label">Lounasaika: {{ lunchTime }}</div>
      <div class="popup__menu">
          <div class="popup__menu__item" v-for="item in lunchMenu.SetMenus" :key="item.Name">
              <div class="popup__menu__item__title">{{ item.Name }}</div>
              <div class="popup__menu__item__ingredients">
                  <div class="popup__menu__item__ingredients__item" v-for="ingredient in item.Components" :key="ingredient">{{ ingredient }}</div>
              </div>
              <div class="popup__menu__item__price">{{ item.Price }}</div>
          </div>
      </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Restaurant } from '../Restaurant';

@Component<Popup>({
    watch: {
        loadMenu: function(newVal, oldVal) {
            if (!oldVal && newVal) {
               if (this.restaurant!.lunchUrl) {
                    this.fetchLuchMenu(this.restaurant!.lunchUrl).then(menu => {
                        this.lunchMenu = menu.MenusForDays[0];
                        this.title = menu.RestaurantName;
                        this.lunchTime = menu.MenusForDays[0].LunchTime;
                    });
                }
            }
        }
    }
})
export default class Popup extends Vue {

    //@ts-ignore
    @Prop() restaurant: Restaurant;
    @Prop() loadMenu: boolean = false;
    private lunchMenu: {[key: string]: any} = {};
    private lunchTime = "";
    private title = this.restaurant!.title;

    private fetchLuchMenu(url: string): Promise<any> {
        return fetch("https://ravintolat-kartalla.herokuapp.com",
            {
                method: "POST",
                body: JSON.stringify({url: url+"&date=2019-8-30"})
            })
            .then(function(response) {
                return response.json();
            })
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.popup__menu {
    display: grid;
    grid-template-columns: 1fr;
    grid-column-gap: 10px;
    grid-row-gap: 15px;
    margin-top: 5px;

    &__item {
        display: grid;
        grid-template-columns: 33% 33% 33%;
        grid-column-gap: 5px;
        word-break: break-word;
    }
}
</style>
