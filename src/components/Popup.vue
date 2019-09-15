<template>
  <div class="popup">
      <div class="popup__label">{{ title }}</div>
      <div class="popup__label">Osoite: {{ restaurant.address }}</div>
      <div v-if="hasTime" class="popup__label">Lounasaika: {{ lunchTime }}</div>
      <div v-else class="popup__label">Lounasaika: Ei lounasaikaa saatavilla</div>
      <div v-if="hasMenu" class="popup__menu">
            <div class="popup__menu__item__labels">
                <div class="">Nimi</div>
                <div class="">Ainekset</div>
                <div class="">Hinta</div>
            </div>
            <div class="popup__menu__item" v-for="item in lunchMenu" :key="item.Name">
                <div class="popup__menu__item__title">{{ item.Name }}</div>
                <div class="popup__menu__item__ingredients">
                    <Incredient :item="item"></Incredient>
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
import Incredient from './Incredient.vue';

interface FoodMenu {
    Price: string,
    Components: string[],
    Name: string,
}

@Component<Popup>({
    components: {
        Incredient,
    },
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
                            case "sodexo":
                                this.parseSodexo(menu);
                                break;
                            case "juvenes":
                                this.parseJuvenes(menu);
                                break;
                            case "mehtimakiravintolat":
                                this.parseMehtimaki(menu)
                                break;
                            case "semma":
                                this.parseFazer(menu);
                                break;
                            case "hel":
                                this.parseHel(menu);
                                break;
                            case "unica":
                                this.parseUnica(menu);
                        }
                    });
                } else {
                    this.isLoading = false;
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
        return fetch("https://akalhainen.me/" + url)
            .then(function(response) {
                return response.json();
            },
            (err) => {
                console.error(err);
            })
    }

    private getDate(date: string, format: string, delimiter: string): Date {
            const formatLowerCase = format.toLowerCase();
            const formatItems = formatLowerCase.split(delimiter);
            const dateItems = date.split(delimiter);
            const monthIndex = formatItems.indexOf("mm");
            const dayIndex = formatItems.indexOf("dd");
            const yearIndex = formatItems.indexOf("yyyy");
            let month = parseInt(dateItems[monthIndex]);
            month -= 1;
            const formatedDate = new Date(parseInt(dateItems[yearIndex]), month, parseInt(dateItems[dayIndex]));
            return formatedDate;
}

    private parseFazer(menu: any): void {
        if (!menu.MenusForDays) {
            this.hasMenu = false;
            this.hasTime = false;
        }
        let menuData = menu.MenusForDays.filter((menuItem: any) => {
            return new Date(menuItem.Date).getDate() === new Date().getDate();
        })[0];
        if (menuData) {
            this.lunchMenu = <FoodMenu[]>menuData.SetMenus;
            if(menuData.LunchTime) {
                this.lunchTime = menuData.LunchTime;
            } else {
                this.hasTime = false;
            }
        } else {
            this.hasMenu = false;
            this.hasTime = false;
        }
        if (this.lunchMenu.length < 1) {
            this.hasMenu = false;
        }
       
        this.title = menu.RestaurantName;
    }

    private parseUnicafe(menu: any): void {
        let restaurantMenu;
        if (this.title.toLowerCase().includes("soc & kom")) {
            restaurantMenu = menu.filter((menu: any) => menu.menuData.name.toLowerCase().includes("soc&kom"))[0];
        } else {
            restaurantMenu = menu.filter((menu: any) => this.title.toLowerCase().includes(menu.menuData.name.toLowerCase()))[0];
        }
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
        let visitingHours = restaurantMenu.menuData.visitingHours.lounas.items
        let weekDay = new Date().getDay();
        if (visitingHours) {
            let openHours: {
                opening_hour: string,
                closing_hour: string,
            };
            this.lunchTime = visitingHours[0].label + " " + visitingHours[0].hours + ", " + visitingHours[1].label + " " + visitingHours[1].hours;
        } else {
            this.lunchTime = "";
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

    private parseSodexo(menu: any): void {
        if (!menu.menus) {
            this.hasMenu = false;
            this.hasTime = false;
        }
        const weekDays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
        let day = weekDays[new Date().getDay()]

        let lunchMenu: FoodMenu[] = []
        if (menu.menus[day]) {
            menu.menus[day].forEach((item: any) => {
                let food: FoodMenu = {
                    Price: "",
                    Components: [""],
                    Name: "",
                };
                food.Components = [item.properties];
                food.Price = item.price;
                food.Name = item.title_fi;
                lunchMenu.push(food);
            })

            this.lunchMenu = <FoodMenu[]>lunchMenu;
            this.title = menu.meta.ref_title;
            this.lunchTime = "";
            this.hasTime = false;
        }
        if (this.lunchMenu.length < 1) {
            this.hasMenu = false;
            this.hasTime = false;
        }
    }

    private parseJuvenes(menu: any): void {
        if (!menu.MealOptions) {
            this.hasMenu = false;
            this.hasTime = false;
        }
        fetch(this.restaurant.website)
            .then(function(response) {
                return response.json();
            },
            (err) => {
                console.error(err);
            }).then(data => {
                const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                const day = weekDays[new Date().getDay()]
                let lunchMenu: FoodMenu[] = []
                menu.MealOptions.forEach((item: any) => {
                    if (item.MealOptionId === -1) {
                        return;
                    }
                    let food: FoodMenu = {
                        Price: "",
                        Components: [""],
                        Name: "",
                    };
                    food.Components = item.MenuItems[0] ? [item.MenuItems[0].Incredients] : [];
                    food.Price = "";
                    food.Name = item.Name_FI;
                    lunchMenu.push(food);
                })

                this.lunchMenu = <FoodMenu[]>lunchMenu;
                this.title = menu.KitchenName;
                const start = `${day}Start`;
                const end = `${day}End`;
                this.lunchTime = data.d.OpenInfo[start] + " - " + data.d.OpenInfo[end];
                if (this.lunchMenu.length < 1) {
                    this.hasMenu = false;
                    this.hasTime = false;
                }
            })
    }

    private parseMehtimaki(menu: any): void {
        this.hasTime = false;
        this.lunchMenu = menu;
    }

    private parseHel(menu: any): void {
        let menuData = menu.Days.filter((menuItem: any) => {
            return new Date(menuItem.Date).getDate() === new Date().getDate();
        })[0];

        let lunchMenu: FoodMenu[] = []
        menuData.Meals.forEach((meal: any) => {
            let food: FoodMenu = {
                Price: "",
                Components: [""],
                Name: "",
            };
            food.Components = meal.Nutritions.map((nutrition: any) => nutrition.Name);
            food.Price = meal.price;
            food.Name = meal.Name;
            lunchMenu.push(food);
        })

        this.lunchMenu = lunchMenu;
        this.hasTime = false;
        if (this.lunchMenu.length < 1) {
            this.hasMenu = false;
        }
    }

    private parseUnica(menuData: any): void {
        let {menu, openingHours} = menuData;
        this.lunchMenu = menu;
        this.lunchTime = openingHours;
        if (this.lunchMenu.length === 0) {
            this.hasMenu = false;
        }
        
        if (this.lunchTime === "") {
            this.hasTime = false;
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.popup {
    height: 100%;
    width: 100%;
    &__menu {
        display: grid;
        grid-template-columns: 1fr;
        grid-column-gap: 10px;
        grid-row-gap: 15px;
        margin-top: 5px;
        max-height: 80vh;
        overflow-y: scroll;
        -webkit-overflow-scrolling: touch;
        overflow-x: hidden;

        &__item {
            display: grid;
            grid-template-columns: 33% 33% 33%;
            grid-column-gap: 5px;
            word-break: break-word;

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
