import Vue from 'vue'
import Home from './components/Home/Home.vue';
import Counter from './components/Counter/Counter.vue';

const routes = {
  '/#/counter': Counter,
  '/': Home
}

new Vue({
  el: '#app',
  data: {
    currentRoute: `/${window.location.hash.split('?')[0]}`
  },
  computed: {
    ViewComponent() {
      return routes[this.currentRoute] || Home
    }
  },
  render(h) {
    return h(this.ViewComponent)
  }
})