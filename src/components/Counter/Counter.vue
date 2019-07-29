<template>
  <div id="counter">0</div>
</template>

<script>
import * as url from "url";
import TwitchClient from "./TwitchClient.js";
import { CountUp } from "countup.js";

url.URLSearchParams = URLSearchParams;
export default {
  name: "Counter",
  data() {
    return {
      channel: null,
      client: null,
      emoteCount: 0
    };
  },
  methods: {
    increaseCounter: function(num) {
      let oldCount = this.emoteCount;
      this.emoteCount += num;

      new CountUp("counter", this.emoteCount, {
        startVal: oldCount
      }).start();
    }
  },

  watch: {
    channel: newVal => sessionStorage.setItem("channel", newVal)
  },
  mounted() {
    let params = new url.URLSearchParams(window.location.search);
    if (params.has("chan")) {
      this.channel = params.get("chan");
    } else {
      this.channel = sessionStorage.getItem("channel");
    }

    this.client = new TwitchClient(this.channel);
    this.client.registerEmoteCallback(
      function(num) {
        this.increaseCounter(num);
      }.bind(this)
    );

    this.client.open();
  }
};
</script>
 
