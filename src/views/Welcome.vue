<template>
  <div
    class="w-screen h-screen flex items-center justify-center text-center blank text-8xl text-white select-none relative"
    :style="{ 'font-family': 'Asap' }"
  >
    You Found Me<br />I'm Xuan Tang
    <div
      class="absolute bottom-10 text-white text-center w-full select-none text-sm"
      :style="{ 'font-family': 'Asap' }"
    >
      This site is still under construction
    </div>
  </div>
</template>

<script>
export default {
  name: "Welcome",
  data() {
    return {
      // data
    };
  },
  methods: {
    // methods
  },
  mounted() {
    // mounted
  },
};
</script>

<style scoped>
.blank {
  background-color: black;
}
</style>
