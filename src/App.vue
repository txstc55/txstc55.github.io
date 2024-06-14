<template>
  <div id="app">
    <div
      class="fixed w-full z-30 bg-transparent float-end place-content-end flex text-sm"
      :style="{ 'font-family': 'Asap' }"
    >
      <button
        class="select-none font-bold px-2 py-1 border-2 border-black my-2 hover:scale-105 mx-2 rounded-xl backdrop-blur-md bg-white/60 hover:bg-white/80 ease-in-out duration-300 hover:shadow-lg"
        @click="scrollToHome"
      >
        HOME
      </button>
      <button
        class="select-none font-bold px-2 py-1 border-2 border-black my-2 hover:scale-105 mx-2 rounded-xl backdrop-blur-md bg-white/60 hover:bg-white/80 ease-in-out duration-300 hover:shadow-lg"
        @click="scrollToAbout"
      >
        ABOUT
      </button>
      <button
        class="select-none font-bold px-2 py-1 border-2 border-black my-2 hover:scale-105 mx-2 rounded-xl backdrop-blur-md bg-white/60 hover:bg-white/80 ease-in-out duration-300 hover:shadow-lg"
        @click="scrollToProjects"
      >
        PROJECTS
      </button>
      <button
        class="select-none font-bold px-2 py-1 border-2 border-black my-2 hover:scale-105 mx-2 rounded-xl backdrop-blur-md bg-white/60 hover:bg-white/80 ease-in-out duration-300 hover:shadow-lg"
        @click="scrollToContact"
      >
        CONTACT
      </button>
    </div>
    <Home ref="home"></Home>
    <Welcome ref="welcome"></Welcome>
    <About ref="about" @toProjects="scrollToProjects"></About>
    <Projects ref="projects"></Projects>
    <Contact ref="contact"></Contact>
  </div>
</template>

<script>
import Home from "./views/Home.vue";
import Welcome from "./views/Welcome.vue";
import About from "./views/About.vue";
import Projects from "./views/Projects.vue";
import Contact from "./views/Contact.vue";
export default {
  components: {
    Home,
    Welcome,
    About,
    Projects,
    Contact
  },
  methods: {
    scrollToHome() {
      const homeElement = this.$refs.home.$el;
      document.documentElement.scrollTop = homeElement.offsetTop;
    },
    scrollToAbout() {
      const aboutElement = this.$refs.about.$el;
      document.documentElement.scrollTop = aboutElement.offsetTop;
    },
    scrollToProjects() {
      const projectsElement = this.$refs.projects.$el;
      document.documentElement.scrollTop = projectsElement.offsetTop;
    },
    scrollToContact() {
      const contactElement = this.$refs.contact.$el;
      document.documentElement.scrollTop = contactElement.offsetTop;
    },
  },
  mounted() {
    document.documentElement.scrollTop = 0;
  },
};
</script>

<style>
@font-face {
  font-family: "Asap";
  src: url("@/assets/asap.ttf") format("truetype");
}

html {
  overscroll-behavior: none;
  scroll-behavior: smooth;
}

body {
  overscroll-behavior: none;
}

/* color for welcome page */
.welcome-bg {
  background-color: #fffdb5;
}
</style>
