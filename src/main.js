import Vue from 'vue'
import ElementUI from 'element-ui'
import App from './App.vue'
import './registerServiceWorker'

import 'element-ui/lib/theme-chalk/index.css'
import './css/reset.css'
import './css/layout.css'
import './css/app.css'

import './components/UI'
import './components/UI/fln-treeview'
import './components/UI/fln-splitter'
import './components/UI/fln-modal'

import flnElementProperties from './components/fln-element-properties.vue'
import flnInspector from './components/fln-inspector.vue'
import flnSection from './components/fln-section.vue'
import flnText from './components/fln-text.vue'

Vue.component('fln-element-properties', flnElementProperties)
Vue.component('fln-inspector', flnInspector)
Vue.component('fln-text', flnText)
Vue.component('fln-section', flnSection)

Vue.use(ElementUI)

Vue.config.ignoredElements = [
  'hbox',
  'vbox',
  'client',
  'spacer'
]

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
