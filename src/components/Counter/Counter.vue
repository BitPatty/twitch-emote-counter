<template>
  <div id="counter" v-bind:style="counterStyles">0</div>
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
      counterStyles: {
        textAlign: "left"
      },
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
    } else if (sessionStorage.has("channel")) {
      this.channel = sessionStorage.getItem("channel");
    } else {
      window.location = `${window.location.protocol}//${window.location.host}`;
      return;
    }

    if (params.has("text-align")) {
      this.counterStyles.textAlign = params.get("text-align");
    } else {
      this.counterStyles.textAlign = "center";
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

<style scoped>
#counter {
  font-size: 30vh;
  text-align: right;
}
</style>
 
