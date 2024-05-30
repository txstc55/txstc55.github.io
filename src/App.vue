<template>
  <div id="app">
    <Home></Home>
    <Welcome></Welcome>
  </div>
</template>

<script>
import Home from './views/Home.vue'
import Welcome from './views/Welcome.vue'
export default {
  components: {
    Home,
    Welcome
  }
}
</script>

<style>
/* @font-face {
  font-family: "Asap";
  src: url("@/assets/asap.ttf") format("truetype");
} */

html {
  overscroll-behavior: none;
}

body {
  overscroll-behavior: none;
}
</style>
