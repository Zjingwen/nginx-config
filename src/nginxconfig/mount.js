import './scss/style.scss';
import Vue from 'vue';
import './util/prism_bundle';
import { i18n } from './i18n/setup';
import App from './templates/app.vue';

// Run the app
new Vue({
    i18n,
    render: h => h(App),
}).$mount('#app');
