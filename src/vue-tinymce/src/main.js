import Vue from 'vue'
import App from './App.vue'
import tinymce from 'vue-tinymce-editor'

Vue.component('tinymce', tinymce)


Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
