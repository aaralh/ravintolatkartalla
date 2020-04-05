import Vue from 'vue';
import Vuex from 'vuex';
import { RestaurantObject } from './Restaurant';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    selectedRestaurants: [],
    activeRestaurant: null,
  },
  mutations: {
    selectedRestaurants(state, data): void {
      state.selectedRestaurants = data;
    },
    activeRestaurant(state, data): void {
      state.activeRestaurant = data;
    },
  },
  getters: {
    selectedRestaurants(state): RestaurantObject[] {
      return state.selectedRestaurants;
    },
    activeRestaurant(state): RestaurantObject|null {
      return state.activeRestaurant;
    },
  },
  actions: {

  },
});
