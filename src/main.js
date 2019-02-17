import Vue from 'vue';
import VueCurrencyFilter from 'vue-currency-filter';

import App from './App.vue';
import router from './router';
import store from './store';

import './elementUi';

Vue.config.productionTip = false;

Vue.use(VueCurrencyFilter, {
  symbol: 'R$',
  thousandsSeparator: '.',
  fractionCount: 2,
  fractionSeparator: ',',
  symbolPosition: 'front',
  symbolSpacing: true,
});

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
