import Vue from 'vue'
import App from './App.vue'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

Vue.use(VueQuillEditor)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
