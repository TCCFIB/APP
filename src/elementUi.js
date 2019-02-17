import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import lang from '../node_modules/element-ui/lib/locale/lang/pt-br';
import locale from '../node_modules/element-ui/lib/locale';

Vue.use(ElementUI);

locale.use(lang);
