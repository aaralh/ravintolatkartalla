<template>
  <div class="popup">
      <div class="popup__label">{{ title }}</div>
      <div class="popup__label">Osoite: {{ restaurant.address }}</div>
      <div v-if="hasTime" class="popup__label">Lounasaika: {{ lunchTime }}</div>
      <div v-else class="popup__label">Lounasaika: Ei lounasaikaa saatavilla</div>
      <div v-if="hasMenu" class="popup__menu">
          <div class="popup__menu__item" v-for="item in lunchMenu" :key="item.Name">
              <div class="popup__menu__item__title">{{ item.Name }}</div>
              <div class="popup__menu__item__ingredients">
                  <div class="popup__menu__item__ingredients__item" v-for="ingredient in item.Components" :key="ingredient">{{ ingredient }}</div>
              </div>
              <div class="popup__menu__item__price">{{ item.Price }}</div>
          </div>
      </div>
      <div v-else>
          <div class="popup__label">Ei ruokalistaa saatavilla</div>
      </div>
      <div v-if="isLoading" class="popup__loading">
          <i class="fa fa-spinner fa-spin"></i>
      </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Restaurant } from '../Restaurant';

interface FoodMenu {
    Price: string,
    Components: string[],
    Name: string,
}

@Component<Popup>({
    watch: {
        loadMenu: function(newVal, oldVal) {
            if (!oldVal && newVal) {
               if (this.restaurant!.lunchUrl) {
                    this.fetchLuchMenu(this.restaurant!.lunchUrl).then(menu => {
                        this.isLoading = false;
                        switch(this.restaurant.type) {
                            case "fazer":
                                this.parseFazer(menu);
                                break;
                            case "unicafe":
                                this.parseUnicafe(menu);
                                break;
                        }
                    });
                } else {
                    this.hasMenu = false;
                    this.hasTime = false;
                }
            }
        }
    }
})
export default class Popup extends Vue {

    //@ts-ignore
    @Prop() restaurant: Restaurant;
    //@ts-ignore
    @Prop() loadMenu: boolean;
    private lunchMenu: FoodMenu[] = [];
    private lunchTime = "";
    private title = this.restaurant!.title;
    private hasMenu = true;
    private hasTime = true;
    private isLoading = true;

    private fetchLuchMenu(url: string): Promise<any> {
        return fetch("https://ravintolat-kartalla.herokuapp.com",
            {
                method: "POST",
                body: JSON.stringify({url: url})
            })
            .then(function(response) {
                return response.json();
            })
    }

    private getDate(date: string, format: string, delimiter: string): Date {
            let formatLowerCase=format.toLowerCase();
            let formatItems=formatLowerCase.split(delimiter);
            let dateItems=date.split(delimiter);
            let monthIndex=formatItems.indexOf("mm");
            let dayIndex=formatItems.indexOf("dd");
            let yearIndex=formatItems.indexOf("yyyy");
            let month=parseInt(dateItems[monthIndex]);
            month-=1;
            let formatedDate = new Date(parseInt(dateItems[yearIndex]), month, parseInt(dateItems[dayIndex]));
            return formatedDate;
}

    private parseFazer(menu: any): void {
        this.lunchMenu = <FoodMenu[]>menu.MenusForDays[0].SetMenus;
        this.title = menu.RestaurantName;
        this.lunchTime = menu.MenusForDays[0].LunchTime;
        if (this.lunchMenu.length < 1) {
            this.hasMenu = false;
            this.hasTime = false;
        }
    }

    private parseUnicafe(menu: any): void {
        let restaurantMenu = menu.filter((menu: any) => this.title.toLowerCase().includes(menu.menuData.name.toLowerCase()))[0]
        if (!restaurantMenu) {
            this.hasMenu = false;
            this.hasTime = false;
            return;
        }
        let year = new Date().getFullYear();
        let menuData = restaurantMenu.menuData.menus.filter((menuItem: any) => {
            let dateString = menuItem.date.split(" ")[1]+year;
            let menuItemDate = this.getDate(dateString, "dd.mm.yyyy", ".");
            return menuItemDate.getDate() === new Date().getDate();
        })[0].data;
        this.title = restaurantMenu.title;
        let visitingHours = restaurantMenu.visitingHours.filter((hour: any) => hour.name === "Lounas")[0]
        let weekDay = new Date().getDay();
        if (visitingHours && (weekDay !== 0 && weekDay !== 6)) {
            let openHours: {
                opening_hour: string,
                closing_hour: string,
            };
            if (weekDay === 5) {
                openHours = visitingHours.group.filter((item: any) => item.weekDay[0] === "Fri")[0];
            } else {
                openHours = visitingHours.group.filter((item: any) => item.weekDay[0] === "Mon")[0];
            }
            this.lunchTime = openHours.opening_hour + " - " + openHours.closing_hour;
        } else {
            this.lunchTime = "";
            this.hasMenu = false;
            this.hasTime = false;
        }
        let lunchMenu: FoodMenu[] = []
        menuData.forEach((item: any) => {
            let food: FoodMenu = {
                Price: "",
                Components: [""],
                Name: "",
            };
            food.Components = [item.ingredients];
            food.Price = "Opiskelija: " + item.price.value.student;
            food.Name = item.name;
            lunchMenu.push(food);
        })
        this.lunchMenu = lunchMenu;
        if (this.lunchMenu.length < 1) {
            this.hasMenu = false;
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.popup {
    &__menu {
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
