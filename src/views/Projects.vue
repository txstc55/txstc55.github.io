<template>
  <div class="w-full h-screen mt-20 px-2">
    <div class="flex h-screen">
      <div
        class="flex-1 flex flex-col items-center h-full scroll-smooth overflow-hidden no-scrollbar"
        ref="projectCards"
        :style="{ 'font-family': 'Asap' }"
      >
        <div
          class="h-1/2 bg-transparent flex-shrink-0 transform w-full"
        ></div>
        <div
          v-for="(item, index) in projects"
          class="h-120 my-0 flex-shrink-0 custom-max-w-card w-180 text-black border-2 bg-white ease-in-out duration-300 p-5 rounded-lg transform -translate-y-1/2"
          :class="{
            'shadow-sm opacity-10 border-black scale-75': index != focusedIndex,
            'shadow-2xl opacity-100 border-black': index === focusedIndex,
          }"
          :ref="'projectCard' + index"
        >
          <div class="w-full h-full content-center justify-center" v-if="index===0">
            <div class="text-4xl">I like to write side projects</div>
            <div class="text-xl mt-3">Take a look, click on the timeline to view the project.</div>
            <div class="text-xl">When viewing the project detail, clicking on the image will take you to the site.</div>
          </div>
          <div class="w-full h-full p-2" :class="projectCardInnerStyle" v-else>
            <a :href=item.url class="w-48 h-48 m-auto" target="_blank">
              <img :src="'projectImages/' + item.image" class="object-contain" ></img>
            </a>
            <div class="w-full overflow-auto" :class="{'ml-6': projectCardWide, 'mx-2 mt-2 h-56': !projectCardWide}">
              <div class="text-3xl" :class="{'justify-end flex-col flex h-36': projectCardWide, 'mt-2': !projectCardWide}"><div>{{ item.title }}</div></div>
              <div class="text-md mt-4">{{ item.description }}</div>
            </div>
          </div>
        </div>
        <div
          class="h-120 my-20 bg-transparent flex-shrink-0 custom-max-w-card w-180"
        ></div>
        <div
          class="h-120 my-20 bg-transparent flex-shrink-0 custom-max-w-card w-180"
        ></div>
      </div>
      <!-- Right Sidebar -->
      <div
        class="bg-transparent w-56 custom-max-w border-2 rounded-lg border-black overflow-y-auto my-48 shadow-2xl sm:mr-4 md:mr-8 lg:mr-12 py-3 no-scrollbar"
        ref="menuBar"
      >
        <div class="flex flex-col items-center py-4 relative px-2">
          <!-- Vertical line placed behind the circles -->
          <div
            class="absolute left-6 transform -translate-x-1/2 w-0.5 bg-gray-300 h-full"
          ></div>
          <div
            class="absolute left-6 transform -translate-x-1/2 w-1 bg-white h-7"
          ></div>
          <div
            class="absolute left-6 -bottom-5 transform -translate-x-1/2 w-1 bg-white h-16"
          ></div>
          <!-- Repeat this block for each item in the timeline -->
          <div
            v-for="(item, index) in projects"
            class="flex items-center w-full py-3 my-1 group pr-4 ease-in-out duration-300 border-l-2 border-t-2 border-b-2 select-none z-10 rounded-s-md relative"
            :class="{
              'border-transparent': item.title != focused,
              'border-black  backdrop-blur-sm shadow-xl':
                item.title === focused,
            }"
            @click="
              focused = item.title;
              focusedIndex = index;
              scrollToCard(index);
            "
          >
            <div class="absolute h-1/2 bottom-0 bg-white w-full z-1 rounded-md" v-if="index===(projects.length-1)"></div>
            <div
              class="rounded-full flex-shrink-0 border-2 ease-in-out duration-300 z-2"
              :style="{
                'border-color': colors[index % colors.length],
              }"
              :class="{
                'group-hover:bg-blackPearl': index % 5 === 0,
                'group-hover:bg-sale': index % 5 === 1,
                'group-hover:bg-turquoise': index % 5 === 2,
                'group-hover:bg-alizarin': index % 5 === 3,
                'group-hover:bg-treePoppy': index % 5 === 4,
                'w-3 h-3 bg-white ml-2': item.title != focused,
                'w-5 h-5 ml-1': item.title === focused,
                'bg-blackPearl': index % 5 === 0 && item.title === focused,
                'bg-sale': index % 5 === 1 && item.title === focused,
                'bg-turquoise': index % 5 === 2 && item.title === focused,
                'bg-alizarin': index % 5 === 3 && item.title === focused,
                'bg-treePoppy': index % 5 === 4 && item.title === focused,
              }"
            ></div>
            <div
              class="ml-3 group-hover:ml-4 text-lg font-semibold ease-in-out duration-300 z-2"
              :class="{
                'text-black': item.title === focused,
                'text-gray-400 group-hover:text-gray-700':
                  item.title != focused,
              }"
              :style="{ 'font-family': 'Asap' }"
            >
              {{ item.title }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import projects from "@/assets/projects.json"
export default {
  data() {
    return {
      colors: ["#011627", "#B2DDF7", "#2EC4B6", "#E71D36", "#FF9F1C"],
      colorNames: ["blackPearl", "sale", "turquoise", "alizarin", "treePoppy"],
      focused: "Intro",
      focusedIndex: 0,
      projects: projects.projects,
      projectCardInnerStyle: "",
      projectCardWide: true, // for ratio
    };
  },
  computed: {},
  methods: {
    disableScroll() {
      document.body.style.overflow = "hidden"; // Disables scrolling on the page
      if (this.$refs["menuBar"]){
        this.$refs["menuBar"].style.overflowY = "hidden"; // disables scrolling on the timeline
      }
    },
    enableScroll() {
      document.body.style.overflow = ""; // Re-enables scrolling on the page
      if (this.$refs["menuBar"]){
        this.$refs["menuBar"].style.overflowY = ""; // Re-enables scrolling on the timeline
      }
    },
    scrollToCard(index) {
      this.disableScroll();
      // Access the ref of the desired card
      const card = this.$refs["projectCard" + index];
      // Check if the card exists
      if (card && card[0]) {
        // Scroll the card into view smoothly and center it vertically
        card[0].scrollIntoView({
          behavior: "smooth", // Defines the transition animation.
          block: "center", // Vertical alignment
        });
        setTimeout(() => {
          // Wait for the duration of the scroll effect
          this.enableScroll(); // Re-enable scrolling after the scroll
        }, 1000); // Adjust this duration as needed
      } else {
        console.log("Card not found");
      }
    },
    onResize() {
      // we first check the ratio of the project card
      const card = this.$refs["projectCard" + this.focusedIndex];
      if (card && card[0]) {
        const cardWidth = card[0].offsetWidth;
        const cardHeight = card[0].offsetHeight;
        const ratio = cardWidth / cardHeight;
        if (ratio > 1){
          this.projectCardInnerStyle = "h-full w-full flex flex-row content-center align-center";
          this.projectCardWide = true;
        } else {
          this.projectCardWide = false;
          this.projectCardInnerStyle = "h-full w-full";
        }
      }
    },
  },

  mounted() {
    window.addEventListener("resize", this.onResize);
    this.onResize();
    // this.$nextTick(() => {
    //   const card = this.$refs["projectCard0"];
    //   if (card && card[0]) {
    //     card[0].offsetTop = 7985
    //   }
    // });

  },
  beforeCreate() {},
  created() {},
};
</script>

<style scoped>
.custom-max-w {
  max-width: 30%;
}

.custom-max-w-card {
  max-width: 95%;
}

/* Hide scrollbar for Chrome, Safari and Opera */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.no-scrollbar {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
