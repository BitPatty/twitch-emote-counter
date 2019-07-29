import Vue from 'vue'
import Home from './components/Home/Home.vue';
import Counter from './components/Counter/Counter.vue';

const routes = {
  '/': Home,
  '/counter': Counter
}

new Vue({
  el: '#app',
  data: {
    currentRoute: window.location.pathname
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