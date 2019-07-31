<template>
  <main>
    <h1 class="title">Twitch Emote Counter</h1>
    <form class="form" method="get">
      <div class="field">
        <label for="chan" class="label">Channel</label>
        <div class="control">
          <input class="input" v-model="channel" type="text" name="chan" />
        </div>
      </div>
      <br />
      <div class="field">
        <label class="label">Color</label>
        <div class="control">
          <swatches v-model="color" :trigger-style="swatchStyle" colors="text-advanced" show-border></swatches>
          <input name="color" type="text" :value="color" hidden />
        </div>
      </div>
      <br />
      <label for="text-align" class="label">Text Alignment</label>
      <div class="field">
        <div class="control">
          <div id="sel_txt-align" class="select">
            <select name="text-align" @change="changeAlignment">
              <option value="left" :selected="textAlignment === 'left'">Left</option>
              <option value="center" :selected="textAlignment === 'center'">Center</option>
              <option value="right" :selected="textAlignment === 'right'">Right</option>
            </select>
          </div>
        </div>
      </div>
      <br />
      <input class="button" type="submit" value="Submit" />
    </form>
  </main>
</template>

<script>
import Swatches from "vue-swatches";
import "vue-swatches/dist/vue-swatches.min.css";

export default {
  components: { Swatches },
  name: "Home",
  props: {
    channelName: {
      type: String,
      default: localStorage.getItem("tecChannel")
    },
    foreColor: {
      type: String,
      default:
        localStorage.getItem("tecForeColor") != null
          ? localStorage.getItem("tecForeColor")
          : "#000"
    },
    textAlignment: {
      type: String,
      default:
        localStorage.getItem("tecAlignment") != null &&
        ["left", "center", "right"].includes(
          localStorage.getItem("tecAlignment")
        )
          ? localStorage.getItem("tecAlignment")
          : "center"
    }
  },
  data() {
    return {
      swatchStyle: {
        width: "100%",
        borderRadius: "4px",
        border: "1px solid #dbdbdb",
        boxShadow: "inset 0 1px 2px rgba(10,10,10,.1)"
      },
      alignment: this.textAlignment,
      channel: this.channelName,
      color: this.foreColor
    };
  },
  watch: {
    channel: newVal => localStorage.setItem("tecChannel", newVal.trim()),
    color: newVal => localStorage.setItem("tecForeColor", newVal),
    alignment: newVal => localStorage.setItem("tecAlignment", newVal)
  },
  methods: {
    changeAlignment: function(e) {
      if (["left", "center", "right"].includes(e.target.value))
        this.alignment = e.target.value;
    }
  }
};
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Open+Sans&display=swap");
html,
body {
  width: 100%;
  text-align: center;
  font-family: "Open Sans", Arial, Helvetica, sans-serif;
  padding: 0;
  margin: 0;
  background-color: rgba(0, 0, 0, 0);
}

main {
  display: inline-block;
  min-width: 280px;
}

#sel_txt-align,
#sel_txt-align select {
  width: 100%;
}

::-webkit-scrollbar {
  width: 0px;
  background: transparent; /* make scrollbar transparent */
}
</style>

<style scoped>
main {
  padding: 40px 20px;
}
</style>