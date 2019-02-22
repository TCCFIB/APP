import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const storage = window.localStorage;

export default new Vuex.Store({
  state: {
    isLoggedIn: storage.getItem('userData'),
    userData: storage.getItem('userData') ? JSON.parse(storage.getItem('userData')) : {},
  },
  mutations: {
    SET_USER_DATA(state, userData) {
      state.userData = userData;
      state.isLoggedIn = Object.keys(userData).length > 0;
    },
  },
  actions: {
    setUserData({ commit }, userData) {
      commit('SET_USER_DATA', userData);
      storage.setItem('userData', JSON.stringify(userData));
    },
    unsetUserData({ commit }) {
      commit('SET_USER_DATA', {});
      storage.removeItem('userData');
    },
  },
});
