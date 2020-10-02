import { Restaurant, RestaurantObject } from './Restaurant';

const FAVOURITE_RESTAURANTS = "favouriteRestaurants";

export interface FoodMenu {
    Price: string,
    Components: string[],
    Name: string,
}

export interface MenuJson {
    lunchMenu: FoodMenu[],
    lunchTime: string,
    hasMenu: boolean,
    hasTime: boolean,
    title: string,
}

export function initMenuJson(): MenuJson {
    return {
        lunchMenu: [],
        lunchTime: "",
        hasMenu: true,
        hasTime: true,
        title: "",
    }
}

/**
 * Checks if storage is available in browser.
 * 
 * @param storageType Name of the storage to check.
 * 
 * @returns Boolean based on if storage was available.
 */
function isStorageAvailable(storageType: "localStorage" | string): boolean {
    let storage;
    try {
        //@ts-ignore
        storage = window[storageType];
        let x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch (e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            (storage && storage.length !== 0);
    }
}

/**
 * Gets favourite restaurants from localStorage.
 * 
 * @returns List of restaurants.
 */
export function getFavouriteRestaurants(): RestaurantObject[] {
    let data: RestaurantObject[] = []
    if (isStorageAvailable("localStorage")) {
        let restaurants = localStorage.getItem(FAVOURITE_RESTAURANTS);
        if (restaurants) {
            data = JSON.parse(restaurants);
        }
    }
    return data;
}


/**
 * Adds given restaurant to localStorage.
 * 
 * @param restaurant Restaurant to add as favourite.
 */
export function addFavouriteRestaurant(restaurant: Restaurant): RestaurantObject[] {
    let data: RestaurantObject[] = [];
    if (isStorageAvailable("localStorage")) {
        let items = getFavouriteRestaurants();
        items.push(restaurant.toObject());
        data = items;
        localStorage.setItem(FAVOURITE_RESTAURANTS, JSON.stringify(items));
    }
    return data;
}

/**
 * Removes given restaurant from teh localStorage.
 * 
 * @param restaurant Restarant to remove from favourites.
 * 
 * @returns Updated array of restaurants.
 */
export function removeFavouriteRestaurant(restaurant: Restaurant): RestaurantObject[] {
    let data: RestaurantObject[] = [];
    if (isStorageAvailable("localStorage")) {
        let items = getFavouriteRestaurants();
        data = items.filter(item => {
            return item.address !== restaurant.address;
        })
        localStorage.setItem(FAVOURITE_RESTAURANTS, JSON.stringify(data));
    }
    return data;
}

export function fetchLuchMenu(url: string, restaurant: Restaurant): Promise<any> {
    return new Promise((resolve, reject) => {
        fetch("https://aaroalhainen.dev/" + url)
            .then(function (response) {
                response.json().then(menu => {
                    let data = parseRestaurantData(menu, restaurant);
                    data.then(i => console.log)
                    resolve(data);
                })
            },
            (err) => {
                reject(err);
            })
    })
}

/**
 * Parses given menu data with suitable parser and returns parsed menu.
 * 
 * @param menu Menu to be parsed.
 * @param restaurant Restaurant object whom the menu belongs.
 * 
 * @return MenuJson promise.
 */
function parseRestaurantData(menu: {}, restaurant: Restaurant): Promise<MenuJson> {
    return new Promise((resolve, reject) => {
        switch(restaurant.type) {
            case "fazer":
                resolve(parseFazer(menu));
                break;
            case "unicafe":
                resolve(parseUnicafe(menu, restaurant));
                break;
            case "sodexo":
                resolve(parseSodexo(menu));
                break;
            case "juvenes":
                parseJuvenes(menu, restaurant).then(data => {resolve(data)});
                break;
            case "mehtimakiravintolat":
                resolve(parseMehtimaki(menu))
                break;
            case "semma":
                resolve(parseFazer(menu));
                break;
            case "hel":
                resolve(parseHel(menu));
                break;
            case "unica":
                resolve(parseUnica(menu));
            default:
                resolve(initMenuJson());
        }
    })
}

/**
 * Formats the given date to the correct format.
 * 
 * @param date Date in string format.
 * @param format Format for the date string.
 * @param delimiter Delimiter for the date string.
 * 
 * @return Formated date.
 */
function getDate(date: string, format: string, delimiter: string): Date {
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

/**
 * Parser for Fazer menu data.
 * 
 * @param menu Restaurants menu json.
 * 
 * @return Restaurants menu json formated to MenuJson format.
 */
function parseFazer(menu: any): MenuJson {
    let menuJson: MenuJson = initMenuJson();
    if (!menu.MenusForDays) {
        menuJson.hasMenu = false;
        menuJson.hasTime = false;
    }
    let menuData = menu.MenusForDays.filter((menuItem: any) => {
        return new Date(menuItem.Date).getDate() === new Date().getDate();
    })[0];
    if (menuData) {
        menuJson.lunchMenu = <FoodMenu[]>menuData.SetMenus;
        if (menuData.LunchTime) {
            menuJson.lunchTime = menuData.LunchTime;
        } else {
            menuJson.hasTime = false;
        }
    } else {
        menuJson.hasMenu = false;
        menuJson.hasTime = false;
    }
    if (menuJson.lunchMenu.length < 1) {
        menuJson.hasMenu = false;
    }

    menuJson.title = menu.RestaurantName;
    return menuJson;
}

/**
 * Parser for Unicafe menu data.
 * 
 * @param menu Restaurants menu json.
 * @param restaurant Restaurants object
 * 
 * @return Restaurants menu json formated to MenuJson format.
 */
function parseUnicafe(menu: any, restaurant: Restaurant): MenuJson {
    let menuJson: MenuJson = initMenuJson();
    let restaurantMenu;

    restaurantMenu = menu.filter((menu: any) => {
        if (!menu.menuData) return false;
        return restaurant.title.toLowerCase() === menu.title.toLowerCase()
    })[0];

    if (!restaurantMenu) {
        menuJson.hasMenu = false;
        menuJson.hasTime = false;
        return menuJson;
    }
    let year = new Date().getFullYear();
    let menuData = restaurantMenu.menuData.menus.filter((menuItem: any) => {
        let dateString = menuItem.date.split(" ")[1] + year;
        let menuItemDate = getDate(dateString, "dd.mm.yyyy", ".");
        return menuItemDate.getDate() === new Date().getDate();
    })[0].data;

    menuJson.title = restaurantMenu.title;
    let visitingHours = restaurantMenu.menuData.visitingHours.lounas.items
    let weekDay = new Date().getDay();
    if (visitingHours) {
        try {
            let openHours: {
                opening_hour: string,
                closing_hour: string,
            };
            menuJson.lunchTime = visitingHours[0].label + " " + visitingHours[0].hours + ", " + visitingHours[1].label + " " + visitingHours[1].hours;
        } catch {
            console.info("Failed to parse lunch time.")
        }
    } else {
        menuJson.lunchTime = "";
        menuJson.hasTime = false;
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
    menuJson.lunchMenu = lunchMenu;
    if (menuJson.lunchMenu.length < 1) {
        menuJson.hasMenu = false;
    }
    return menuJson;
}

/**
 * Parser for Sodexo menu data.
 * 
 * @param menu Restaurants menu json.
 * 
 * @return Restaurants menu json formated to MenuJson format.
 */
function parseSodexo(menu: any): MenuJson {
    let menuJson: MenuJson = initMenuJson();
    if (!menu.menus) {
        menuJson.hasMenu = false;
        menuJson.hasTime = false;
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

        menuJson.lunchMenu = <FoodMenu[]>lunchMenu;
        menuJson.title = menu.meta.ref_title;
        menuJson.lunchTime = "";
        menuJson.hasTime = false;
    }
    if (menuJson.lunchMenu.length < 1) {
        menuJson.hasMenu = false;
        menuJson.hasTime = false;
    }
    return menuJson;
}

/**
 * Parser for Juvenes menu data.
 * 
 * @param menu Restaurants menu json.
 * @param restaurant Restaurants object
 * 
 * @return Promise for restaurants menu json formated to MenuJson format.
 */
function parseJuvenes(menu: any, restaurant: Restaurant): Promise<MenuJson> {
    return new Promise((resolve, reject) => {
        let menuJson: MenuJson = initMenuJson();
        if (!menu.MealOptions) {
            menuJson.hasMenu = false;
            menuJson.hasTime = false;
        }
        fetch(restaurant.website)
            .then(function (response) {
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
                menuJson.lunchMenu = <FoodMenu[]>lunchMenu;
                menuJson.title = menu.KitchenName;
                const start = `${day}Start`;
                const end = `${day}End`;
                menuJson.lunchTime = data.d.OpenInfo[start] + " - " + data.d.OpenInfo[end];
                if (menuJson.lunchMenu.length < 1) {
                    menuJson.hasMenu = false;
                    menuJson.hasTime = false;
                }
                resolve(menuJson);
            })
    })
}

/**
 * Parser for Mehtimaki menu data.
 * 
 * @param menu Restaurants menu json.
 * 
 * @return Restaurants menu json formated to MenuJson format.
 */
function parseMehtimaki(menu: any): MenuJson {
    let menuJson: MenuJson = initMenuJson();
    menuJson.hasTime = false;
    menuJson.lunchMenu = menu;
    return menuJson;
}

/**
 * Parser for Hel menu data.
 * 
 * @param menu Restaurants menu json.
 * 
 * @return Restaurants menu json formated to MenuJson format.
 */
function parseHel(menu: any): MenuJson {
    let menuJson: MenuJson = initMenuJson();
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

    menuJson.lunchMenu = lunchMenu;
    menuJson.hasTime = false;
    if (menuJson.lunchMenu.length < 1) {
        menuJson.hasMenu = false;
    }
    return menuJson;
}

/**
 * Parser for Unica menu data.
 * 
 * @param menuData Restaurants menu json.
 * 
 * @return Restaurants menu json formated to MenuJson format.
 */
function parseUnica(menuData: any): MenuJson {
    let menuJson: MenuJson = initMenuJson();
    let { menu, openingHours } = menuData;
    menuJson.lunchMenu = menu;
    menuJson.lunchTime = openingHours;
    if (menuJson.lunchMenu.length === 0) {
        menuJson.hasMenu = false;
    }

    if (menuJson.lunchTime === "") {
        menuJson.hasTime = false;
    }
    return menuJson;
}