<template>
  <div id="app">
    <Home></Home>
    <Welcome></Welcome>
    <About/>
  </div>
</template>

<script>
import Home from './views/Home.vue'
import Welcome from './views/Welcome.vue'
import About from './views/About.vue'
export default {
  components: {
    Home,
    Welcome,
    About
  }
}
</script>

<style>
@font-face {
  font-family: "Asap";
  src: url("@/assets/asap.ttf") format("truetype");
}

@font-face {
    font-family: "Monoton";
    src: url("@/assets/Monoton-Regular.ttf") format("truetype");
}

html {
  overscroll-behavior: none;
  scroll-behavior: smooth;
}

body {
  overscroll-behavior: none;
}

/* color for welcome page */
.welcome-bg{
    background-color: #FFFDB5;
}
</style>
