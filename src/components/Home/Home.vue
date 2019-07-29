<template>
  <main>
    <h1>Twitch Emote Counter</h1>
    <form class="form" method="get">
      <input v-model="channelName" type="text" name="chan" />
      <input type="submit" value="Submit" />
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
  height: 100%;
  text-align: center;
  font-family: "Open Sans", Arial, Helvetica, sans-serif;
}

main,
form {
  display: inline-block;
}
</style>

