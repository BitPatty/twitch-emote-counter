<template>
  <main>
    <div id="counter" v-bind:style="counterStyles">0</div>
  </main>
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
        textAlign: "center",
        color: "#000"
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
    channel: newVal => localStorage.setItem("channel", newVal)
  },
  mounted() {
    let params = new url.URLSearchParams(window.location.search);
    if (
      params.has("chan") &&
      params
        .get("chan")
        .trim()
        .match(/^[a-zA-Z0-9]+$/)
    ) {
      this.channel = params.get("chan").trim();
    } else if (
      localStorage.getItem("channel") != null &&
      localStorage.getItem("channel").match(/^[a-zA-Z0-9]+$/)
    ) {
      this.channel = localStorage.getItem("channel");
    } else {
      window.location = `${window.location.protocol}//${window.location.host}`;
      return;
    }

    if (
      params.has("text-align") &&
      ["left", "center", "right"].includes(params.get("text-align"))
    ) {
      this.counterStyles.textAlign = params.get("text-align");
    } else if (
      ["left", "right", "center"].includes(localStorage.getItem("tecAlignment"))
    ) {
      this.counterStyles.textAlign = localStorage.getItem("tecAlignment");
    }

    if (
      params.has("color") &&
      params.get("color").match(/^#([a-fA-F0-9]{6}|[a-fA-F0-9]\1{3})$/)
    ) {
      this.counterStyles.color = params.get("color");
    } else if (
      localStorage.getItem("tecForeColor") != null &&
      localStorage
        .getItem("tecForeColor")
        .match(/^#([a-fA-F0-9]{6}|[a-fA-F0-9]\1{3})$/)
    ) {
      this.counterStyles.color = localStorage.getItem("tecForeColor");
    }

    document.title = `Emote Counter: ${this.channel}`;

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
main,
#counter {
  width: 100%;
  font-size: 25vw;
}
</style>
 
