<template>
  <main>
    <h1 class="title">Twitch Emote Counter</h1>
    <form class="form" method="get">
      <div class="field">
        <label for="chan" class="label">Channel</label>
        <div class="control">
          <input class="input" v-model="channelName" type="text" name="chan" />
        </div>
      </div>
      <br />
      <label for="text-align" class="label">Text-Alignment</label>
      <div class="field">
        <div class="control">
          <div id="sel_txt-align" class="select">
            <select name="text-align">
              <option value="left">Left</option>
              <option value="center" selected>Center</option>
              <option value="right">Right</option>
            </select>
          </div>
        </div>
      </div>
      <input class="button" type="submit" value="Submit" />
    </form>
  </main>
</template>

<script>
export default {
  name: "Home",
  props: {
    channelName: {
      type: String,
      default: sessionStorage.getItem("channel")
    }
  },
  watch: {
    channelName: newVal => sessionStorage.setItem("channel", newVal)
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