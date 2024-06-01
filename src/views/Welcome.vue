<template>
  <div
    class="w-full h-screen flex items-center justify-center text-center text-6xl select-none relative stroke-2 overflow-hidden ease-in-out bg-black leading-relaxed"
    :style="{ 'font-family': 'Asap' }"
  >
    <div
      class="absolute text-center hollow delay-500 duration-500 mx-5"
      :class="{
        'opacity-100 scale-100 -translate-x-4 -translate-y-28':
          scrollTopPercent >= scrollBoundaryTop &&
          scrollTopPercent <= scrollBoundaryBottom,
        'opacity-0 scale-0 translate-x-80 -translate-y-64':
          scrollTopPercent < scrollBoundaryTop ||
          scrollTopPercent > scrollBoundaryBottom,
      }"
      id="hollow4"
    >
      Welcom to My Page<br />I'm Xuan Tang
    </div>
    <div
      class="absolute text-center hollow delay-400 duration-500 mx-5"
      :class="{
        'opacity-100 scale-100 -translate-x-3 -translate-y-29':
          scrollTopPercent >= scrollBoundaryTop &&
          scrollTopPercent <= scrollBoundaryBottom,
        'opacity-0 scale-0 -translate-x-60 translate-y-48':
          scrollTopPercent < scrollBoundaryTop ||
          scrollTopPercent > scrollBoundaryBottom,
      }"
      id="hollow3"
    >
      Welcom to My Page<br />I'm Xuan Tang
    </div>
    <div
      class="absolute text-center hollow delay-300 duration-500 mx-5"
      :class="{
        'opacity-100 scale-100 -translate-x-2 -translate-y-30':
          scrollTopPercent >= scrollBoundaryTop &&
          scrollTopPercent <= scrollBoundaryBottom,
        'opacity-0 scale-0 -translate-x-40 -translate-y-60':
          scrollTopPercent < scrollBoundaryTop ||
          scrollTopPercent > scrollBoundaryBottom,
      }"
      id="hollow2"
    >
      Welcom to My Page<br />I'm Xuan Tang
    </div>
    <div
      class="absolute text-center hollow delay-200 duration-500 mx-5"
      :class="{
        'opacity-100 scale-100 -translate-x-1 -translate-y-31':
          scrollTopPercent >= scrollBoundaryTop &&
          scrollTopPercent <= scrollBoundaryBottom,
        'opacity-0 scale-0 translate-x-36 translate-y-80':
          scrollTopPercent < scrollBoundaryTop ||
          scrollTopPercent > scrollBoundaryBottom,
      }"
      id="hollow1"
    >
      Welcom to My Page<br />I'm Xuan Tang
    </div>
    <div
      class="absolute text-center hollow text-white duration-500 delay-100 mx-5"
      :class="{
        'opacity-100 scale-100 -translate-x-0 -translate-y-32':
          scrollTopPercent >= scrollBoundaryTop &&
          scrollTopPercent <= scrollBoundaryBottom,
        'opacity-0 scale-0 -translate-x-0 -translate-y-0':
          scrollTopPercent < scrollBoundaryTop ||
          scrollTopPercent > scrollBoundaryBottom,
      }"
      id="hollow0"
    >
      Welcom to My Page<br />I'm Xuan Tang
    </div>

    <div
      class="animation-container h-28 w-full duration-2000 -left-28"
      :class="{
        '-bottom-9 fixed':
          scrollTopPercent >= scrollBoundaryTop &&
          scrollTopPercent <= scrollBoundaryBottom,
        '-bottom-24 fixed':
          scrollTopPercent < scrollBoundaryTop ||
          scrollTopPercent > scrollBoundaryBottom,
      }"
      ref="animationContainer0"
      id="animationContainer0"
    ></div>
    <div
      class="animation-container h-28 w-full duration-2000 left-28"
      :class="{
        '-bottom-9 fixed':
          scrollTopPercent >= scrollBoundaryTop &&
          scrollTopPercent <= scrollBoundaryBottom,
        '-bottom-24 fixed':
          scrollTopPercent < scrollBoundaryTop ||
          scrollTopPercent > scrollBoundaryBottom,
      }"
      ref="animationContainer1"
      id="animationContainer1"
    ></div>
    <div
      class="animation-container h-28 w-full duration-2000"
      :class="{
        '-bottom-9 fixed':
          scrollTopPercent >= scrollBoundaryTop &&
          scrollTopPercent <= scrollBoundaryBottom,
        '-bottom-24 fixed':
          scrollTopPercent < scrollBoundaryTop ||
          scrollTopPercent > scrollBoundaryBottom,
      }"
      ref="animationContainer2"
      id="animationContainer2"
    ></div>
    <div
      class="animation-container h-28 w-full duration-2000 left-56"
      :class="{
        '-bottom-9 fixed':
          scrollTopPercent >= scrollBoundaryTop &&
          scrollTopPercent <= scrollBoundaryBottom,
        '-bottom-24 fixed':
          scrollTopPercent < scrollBoundaryTop ||
          scrollTopPercent > scrollBoundaryBottom,
      }"
      ref="animationContainer3"
      id="animationContainer3"
    ></div>
    <div
      class="animation-container h-28 w-full duration-2000 -left-56"
      :class="{
        '-bottom-9 fixed':
          scrollTopPercent >= scrollBoundaryTop &&
          scrollTopPercent <= scrollBoundaryBottom,
        '-bottom-24 fixed':
          scrollTopPercent < scrollBoundaryTop ||
          scrollTopPercent > scrollBoundaryBottom,
      }"
      ref="animationContainer4"
      id="animationContainer4"
    ></div>
    <div
      class="animation-container h-28 w-full duration-2000 left-84"
      :class="{
        '-bottom-9 fixed':
          scrollTopPercent >= scrollBoundaryTop &&
          scrollTopPercent <= scrollBoundaryBottom,
        '-bottom-24 fixed':
          scrollTopPercent < scrollBoundaryTop ||
          scrollTopPercent > scrollBoundaryBottom,
      }"
      ref="animationContainer5"
      id="animationContainer5"
    ></div>
    <div
      class="animation-container h-28 w-full duration-2000 -left-84"
      :class="{
        '-bottom-9 fixed':
          scrollTopPercent >= scrollBoundaryTop &&
          scrollTopPercent <= scrollBoundaryBottom,
        '-bottom-24 fixed':
          scrollTopPercent < scrollBoundaryTop ||
          scrollTopPercent > scrollBoundaryBottom,
      }"
      ref="animationContainer6"
      id="animationContainer6"
    ></div>
  </div>
</template>

<script>
import lottie from "lottie-web";
import clapping from "@/assets/clapping.json";
import { getColors } from "lottie-colorify";
import { colorify } from "lottie-colorify";
console.log(getColors(clapping));

export default {
  name: "Welcome",
  data() {
    return {
      animation: null,
      scrollTopPercent: 0,
      scrollBoundaryTop: 3.25,
      scrollBoundaryBottom: 4.25,
      colorLists: [
        ["#3a2330", "#3AA6B9", "#ffffff", "#FF7D29", "#FF9EAA"],
        ["#3a2330", "#A1DD70", "#ffffff", "#FFA27F", "#FF0000"],
        ["#3a2330", "#D2649A", "#ffffff", "#CAE6B2", "#F6FAB9"],
        ["#3a2330", "#6DC5D1", "#ffffff", "#FDE49E", "#DD761C"],
        ["#3a2330", "#FFF9D0", "#ffffff", "#C73659", "#5AB2FF"],
        ["#3a2330", "#0A6847", "#ffffff", "#FFC470", "#B51B75"],
        ["#3a2330", "#FF76CE", "#ffffff", "#B5C18E", "#FFB1B1"],
      ],
      colorIndices: [
        0, 1, 0, 1, 0, 0, 0, 0, 2, 0, 2, 0, 1, 0, 3, 0, 3, 0, 0, 0, 0, 2, 0, 2,
        0, 3, 0, 4, 0, 4, 0, 0, 0, 0, 2, 0, 2, 0, 4,
      ], // for this specific animation, there are 5 colors and here we indicate the order of the colors
    };
  },
  methods: {
    onScroll() {
      this.scrollTopPercent =
        document.documentElement.scrollTop / window.innerHeight;
      // console.log(document.documentElement.scrollTop / window.innerHeight);
    },
    async loadAnimation() {
      console.log("loading animation");
      let me = this;

      for (let i = 0; i < 7; i++) {
        lottie.loadAnimation({
          container: document.getElementById("animationContainer" + i),
          loop: true,
          autoplay: true,
          animationData: colorify(
            me.generateColorListBasedOnIndex(i),
            clapping,
          ),
        });
      }
    },
    generateColorListBasedOnIndex(ind) {
      let colors = [];
      for (let i = 0; i < this.colorIndices.length; i++) {
        colors.push(this.colorLists[ind][this.colorIndices[i]]);
      }
      return colors;
    },
  },
  async mounted() {
    this.scrollTopPercent =
      document.documentElement.scrollTop / (4 * this.windowHeight);
    await this.loadAnimation();
    window.addEventListener("scroll", this.onScroll);
  },
};
</script>

<style scoped>
#hollow4 {
  text-shadow:
    -1px 1px 0 #4793af,
    -2px 2px 0 #4793af;
}

#hollow3 {
  text-shadow:
    -1px 1px 0 #cdfadb,
    -2px 2px 0 #cdfadb;
}

#hollow2 {
  text-shadow:
    -1px 1px 0 #dd5746,
    -2px 2px 0 #dd5746;
}

#hollow1 {
  text-shadow:
    -1px 1px 0 #ff4b91,
    -2px 2px 0 #ff4b91;
}

#hollow0 {
  -webkit-text-stroke-width: 2px;
  -webkit-text-stroke-color: #0d1282;
}

.hollow {
  text-shadow:
    -1px 1px 0 #000,
    -2px 2px 0 #000;
}
</style>
