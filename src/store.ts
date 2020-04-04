import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    selectedRestaurants: [],
  },
  mutations: {
    selectedRestaurants(state, data): void {
      state.selectedRestaurants = data;
    },
  },
  getters: {
    selectedRestaurants(state): any {
      return state.selectedRestaurants;
    },
  },
  actions: {

  },
});
