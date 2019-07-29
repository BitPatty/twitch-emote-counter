import Vue from 'vue'
import Home from './components/Home/Home.vue';
import Counter from './components/Counter/Counter.vue';

new Vue({
  el: '#app',
  computed: {
    ViewComponent() {
      return (window.location.search == null || window.location.search === "") ? Home : Counter
    }
  },
  render(h) {
    return h(this.ViewComponent)
  }
})