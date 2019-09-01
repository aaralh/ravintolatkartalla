import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    unicafeMenu: undefined,
  },
  mutations: {
    unicafeMenu(state, data): void {
      state.unicafeMenu = data;
    },
  },
  getters: {
    unicafeMenu(state): any {
      return state.unicafeMenu;
    },
  },
  actions: {

  },
});
