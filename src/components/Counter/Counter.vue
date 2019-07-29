<template>
  <div id="counter"></div>
</template>

<script>
import * as url from "url";
import TwitchClient from "./TwitchClient.js";
import { CountUp } from "countup.js";

url.URLSearchParams = URLSearchParams;
export default {
  name: "Counter",
  props: {
    channelName: {
      type: String,
      default: sessionStorage.getItem("channel")
    }
  },
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
      this.channel = this.channelName;
    }

    this.client = new TwitchClient(this.channelName);
    this.client.registerEmoteCallback(
      function(num) {
        this.increaseCounter(num);
      }.bind(this)
    );

    this.client.open();
  }
};
</script>
 
