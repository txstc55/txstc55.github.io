<template>
  <div
    class="w-full h-screen flex items-center justify-center select-none relative overflow-hidden capitalize"
    :style="{
      'font-family': 'Asap',
      background: 'linear-gradient(to bottom, #FFFDB5, #FFFFFF)',
    }"
    ref="introductionContainer"
  >
    <div
      class="text-6xl text-left relative shadow-sm px-10 py-20 rounded-lg hover:shadow-lg ease-in-out duration-500 hover:scale-105"
      @click="scrollToAbout"
    >
      Let me introduce myself
      <div class="inline-block relative">
        <span class=""
          >&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</span
        >
        <span class="absolute inset-0 text-red-500 inline-block blinking-text">
          {{ professionalText.slice(0, professionalTextProgress) }}
        </span>
      </div>
    </div>
  </div>
  <div
    :class="containerClass"
    :style="{
      'font-family': 'Asap',
    }"
    ref="detailedIntroductionContainer"
  >
    <div
      id="sphereInfo"
      class="duration-300 ease-in-out"
      :class="{
        'w-84 absolute left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2 border-2 border-black rounded-lg bg-white select-none shadow-xl':
          showInfo,
        'w-84 absolute left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2 border-2 border-black rounded-lg bg-white select-none shadow-xl opacity-0 -z-10':
          !showInfo,
      }"
    >
      <div class="w-full mt-1 text-lg text-center capitalize">
        What is this thing
      </div>
      <div class="w-full mt-2 text-md text-left mx-2">
        This is my timeline. I believe in reincarnation, so my timeline is in a
        loop.
      </div>
      <div class="w-full mt-1 text-md text-left mx-2">
        There are 1200 segments on this loop, each representing one month, and
        maybe I'm lucky enough to live through all of them.
      </div>
      <div class="w-full mt-1 text-md text-left mx-2">
        There are three color segments,
        <span :style="{ color: '#fe5e3f' }">─</span> means it's currently being
        focused, <span :style="{ color: '#028391' }">─</span> means the past,
        and <span :style="{ color: '#ccf7ff' }">─</span> means the future.
      </div>
      <div class="w-full mt-1 text-md text-left mx-2">
        This loop is generated through my research.
      </div>
      <div class="w-full mt-4 flex justify-center mb-2">
        <button
          class="px-2 py-1 border border-black text-sm rounded-md scale-95 hover:scale-100 ease-in-out duration-300 hover:shadow-lg"
          @click="showInfo = false"
        >
          OK
        </button>
      </div>
    </div>
    <div
      class="absolute top-1 text-black text-center left-1/2 transform -translate-x-1/2"
    >
      <button
        class="select-none text-md border-2 rounded-full scale-90 hover:scale-100 ease-in-out duration-300 font-semibold w-7 h-7 text-center text-black/60 border-black/60 hover:text-black hover:border-black"
        @click="scrollBack"
      >
        ↑
      </button>
    </div>
    <!-- <div class="absolute bottom-1 text-black text-center left-1 transform">
      <button
        class="select-none text-md border-2 rounded-full scale-90 hover:scale-100 ease-in-out duration-300 font-semibold w-7 h-7 text-center text-black/60 border-black/60"
        @click="showInfo = true"
      >
        i
      </button>
    </div> -->
    <canvas
      ref="sphereSceneCanvas"
      :class="canvasClass"
      @click="showInfo = true"
    ></canvas>
    <div :class="divClass" @mouseleave="unsetTime()">
      <div id="introduction" class="mt-2 p-2 text-2xl select-none">
        Hi, I am Xuan Tang(唐煊).
      </div>
      <div
        id="sub-intro"
        class="mt-2 p-2 text-2xl hover:shadow-lg duration-300 ease-in-out rounded-lg select-none"
        @mouseover="setUpTime(timePeriods.phd)"
      >
        I am currently a Ph.D. student at UCSD working with Professor
        <a
          href="https://cseweb.ucsd.edu/~tzli/"
          target="_blank"
          class="underline"
          >Tzumao Li</a
        >. My research focuses on creating tools that facilitate writing
        efficient simulation code.
      </div>
      <div
        id="sub-intro"
        class="mt-2 p-2 text-2xl hover:shadow-lg duration-300 ease-in-out rounded-lg select-none"
        @mouseover="setUpTime(timePeriods.farm)"
      >
        Before my Ph.D. started, I went home and became a farm boy for some
        time.
      </div>
      <div
        id="sub-intro"
        class="mt-2 p-2 text-2xl hover:shadow-lg duration-300 ease-in-out rounded-lg select-none"
        @mouseover="setUpTime(timePeriods.master)"
      >
        I obtained my master's degree in Computer Science from NYU.
      </div>
      <div
        id="sub-intro"
        class="mt-2 p-2 text-2xl hover:shadow-lg duration-300 ease-in-out rounded-lg select-none"
        @mouseover="setUpTime(timePeriods.bachelor)"
      >
        And before that, my bachelor's degree in Data Science from the
        University of Rochester.
      </div>
      <div id="paper-intro" class="mt-16 p-2 text-xl select-none">
        I also have some papers, surprise surprise.
      </div>
      <div
        class="paper mt-2 p-2 flex justify-between items-start hover:shadow-lg rounded-lg duration-300 ease-in-out"
        v-for="paper in papers"
        @mouseover="setUpTime(timePeriods[paper.title])"
      >
        <div class="paper-details">
          <div class="paper-title text-2xl">{{ paper.title }}</div>
          <a
            class="text-md text-gray-700 mr-2 underline"
            v-for="author in paper.authors"
            :href="authorLinks[author]"
            target="_blank"
            >{{ author }}</a
          >
          <div class="paper-venue text-md">{{ paper.proceedings }}</div>
          <a
            class="paper-paper text-md underline pr-2"
            :href="paper.paper"
            target="_blank"
            >Paper</a
          >
          <a
            class="paper-paper text-md underline"
            :href="paper.code"
            target="_blank"
            >Code</a
          >
        </div>
        <img :src="paper.image" class="paper-image ml-4" :alt="paper.title" />
      </div>
      <div id="rewards-intro" class="mt-16 p-2 text-xl select-none">
        I guess I might as well just throw in some rewards?
      </div>
      <div
        class="reward mt-2 p-2 flex justify-between items-start hover:shadow-lg rounded-lg duration-300 ease-in-out"
        v-for="reward in rewards"
        @mouseover="setUpTime(timePeriods[reward.title])"
      >
        <div class="reward-details">
          <div class="reward-title text-2xl">{{ reward.title }}</div>
          <div class="reward-desc text-md">{{ reward.description }}</div>
        </div>
      </div>
    </div>
    <div
      class="absolute bottom-1 text-black text-center left-1/2 transform -translate-x-1/2"
    >
      <button
        class="select-none text-md border-2 rounded-full scale-90 hover:scale-100 ease-in-out duration-300 font-semibold w-7 h-7 text-center text-black/60 border-black/60 hover:text-black hover:border-black"
        @click="scrollNext"
      >
        ↓
      </button>
    </div>
  </div>
</template>

<script>
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
let scene = null;
let controls = null;
let renderer = null;
let camera = null;
import { Text } from "troika-three-text";
import curve_points from "@/assets/points.json";
// let's just define the curve here
const points = curve_points.xyz.map(
  (point) => new THREE.Vector3(point[0], point[1], point[2]),
);
var curve = new THREE.CatmullRomCurve3(points);
// curve.curveType = "chordal";
curve.closed = true;

// all the line segments
var allSegments = null;

const canvas = document.createElement("canvas");
const gl =
  canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

// Query the maximum number of vertex and fragment uniform vectors
const maxVertexUniforms = gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS);
const maxFragmentUniforms = gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS);
console.log("Max vertex uniforms:", maxVertexUniforms);
console.log("Max fragment uniforms:", maxFragmentUniforms);

export default {
  name: "About",
  data() {
    return {
      professionalText: "professionally",
      professionalTextProgress: 0,
      professionalTextSelection: [
        "professionally",
        "creatively",
        "efficiently",
      ],
      professionalTextSelectionIndex: -1,
      intervalId: null, // Add this to store the interval ID
      sphereScene: null,
      sphereSceneCanvas: null,
      segmentCount: 1200,
      containerClass: "",
      canvasClass: "",
      divClass: "",
      curve_progress: 0.0,
      curve_speed: 0.00005,
      gap_between_chars: 0.0008334,

      time_focus_segment: 0, // which segment to focus on
      showInfo: false,
      timePeriods: {
        life: {
          begin: {
            year: 1995,
            month: 7,
          },
          latest: {
            year: new Date().getFullYear(),
            month: new Date().getMonth(),
          },
          focus: {
            year: new Date().getFullYear(),
            month: new Date().getMonth(),
          },
        },
        phd: {
          begin: {
            year: 2022,
            month: 9,
          },
          latest: {
            year: new Date().getFullYear(),
            month: new Date().getMonth(),
          },
          focus: {
            year: new Date().getFullYear(),
            month: new Date().getMonth(),
          },
        },
        farm: {
          begin: {
            year: 2021,
            month: 6,
          },
          latest: {
            year: 2022,
            month: 8,
          },
          focus: {
            year: 2022,
            month: 1,
          },
        },
        master: {
          begin: {
            year: 2018,
            month: 9,
          },
          latest: {
            year: 2020,
            month: 5,
          },
          focus: {
            year: 2019,
            month: 7,
          },
        },
        bachelor: {
          begin: {
            year: 2014,
            month: 9,
          },
          latest: {
            year: 2018,
            month: 5,
          },
          focus: {
            year: 2016,
            month: 7,
          },
        },
        "A Cross-Platform Benchmark for Interval Computation Libraries": {
          begin: {
            year: 2020,
            month: 9,
          },
          latest: {
            year: 2022,
            month: 3,
          },
          focus: {
            year: 2021,
            month: 6,
          },
        },
        "Sparsity-Specific Code Optimization using Expression Trees": {
          begin: {
            year: 2020,
            month: 10,
          },
          latest: {
            year: 2022,
            month: 4,
          },
          focus: {
            year: 2021,
            month: 7,
          },
        },
        "EGGS: Sparsity-Specific Code Generation": {
          begin: {
            year: 2018,
            month: 12,
          },
          latest: {
            year: 2020,
            month: 4,
          },
          focus: {
            year: 2019,
            month: 6,
          },
        },
        "SGP 2020 Best Paper Honorable Mention": {
          begin: {
            year: 2020,
            month: 7,
          },
          latest: {
            year: 2020,
            month: 7,
          },
          focus: {
            year: 2020,
            month: 7,
          },
        },
        "7/9 Kitkat Rewards": {
          begin: {
            year: 2018,
            month: 9,
          },
          latest: {
            year: 2018,
            month: 12,
          },
          focus: {
            year: 2018,
            month: 10,
          },
        },
        "Dean's Scholarship": {
          begin: {
            year: 2014,
            month: 9,
          },
          latest: {
            year: 2018,
            month: 5,
          },
          focus: {
            year: 2016,
            month: 7,
          },
        },
      },
      authorLinks: {
        "Xuan Tang": "https://txstc55.github.io",
        "Zachary Ferguson": "https://zfergus.github.io",
        "Teseo Schneider": "https://web.uvic.ca/~teseo/",
        "Denis Zorin": "https://cims.nyu.edu/gcl/denis.html",
        "Daniele Panozzo": "https://cims.nyu.edu/gcl/daniele.html",
        "Philipp Herholz": "https://phherholz.github.io/",
        "Olga Sorkine-Hornung": "https://igl.ethz.ch/people/sorkine/",
        "Shoaib Kamil": "https://research.adobe.com/person/shoaib-kamil/",
        "Aurojit Panda": "https://cs.nyu.edu/~apanda/",
        "Jinyang Li": "https://www.news.cs.nyu.edu/~jinyang/",
      },
      papers: [
        {
          title:
            "A Cross-Platform Benchmark for Interval Computation Libraries",
          proceedings: "PPAM, 2022",
          paper: "https://cims.nyu.edu/gcl/papers/2022-Intervals.pdf",
          code: "https://geometryprocessing.github.io/intervals/#/",
          authors: [
            "Xuan Tang",
            "Zachary Ferguson",
            "Teseo Schneider",
            "Denis Zorin",
            "Daniele Panozzo",
          ],
          image: "interval.png",
        },
        {
          title: "Sparsity-Specific Code Optimization using Expression Trees",
          proceedings: "Transation on Graphics, 2022",
          paper: "https://cims.nyu.edu/gcl/papers/2022-GPUSymbolic.pdf",
          code: "https://github.com/PhHerholz/SymbolicLib",
          authors: [
            "Philipp Herholz",
            "Xuan Tang",
            "Teseo Schneider",
            "Shoaib Kamil",
            "Daniele Panozzo",
            "Olga Sorkine-Hornung",
          ],
          image: "symbolic.png",
        },
        {
          title: "EGGS: Sparsity-Specific Code Generation",
          proceedings: "Computer Graphics Forum (SGP), 2020",
          paper: "https://cims.nyu.edu/gcl/papers/2020-EGGS.pdf",
          code: "https://github.com/txstc55/EGGS",
          authors: [
            "Xuan Tang",
            "Teseo Schneider",
            "Shoaib Kamil",
            "Aurojit Panda",
            "Jinyang Li",
            "Daniele Panozzo",
          ],
          image: "eggs.png",
        },
      ],
      rewards: [
        {
          title: "SGP 2020 Best Paper Honorable Mention",
          description:
            "EGGS: Sparsity Specific Code Generator won best paper honorable mention.",
        },
        {
          title: "7/9 Kitkat Rewards",
          description:
            "In a class taught by Professor Denis Shasha at NYU where students participates in weekly competition, my team was the first place in 7 out of 9 games and was rewarded with kitkat each time. We are still the record holder I believe.",
        },
        {
          title: "Dean's Scholarship",
          description:
            "Dean's Scholarship at University of Rochester. You maintain a good GPA, as simple as that.",
        },
      ],
    };
  },
  created() {},
  methods: {
    getViewportHeight() {
      return window.visualViewport
        ? window.visualViewport.height
        : window.innerHeight;
    },
    // scroll back to last page
    scrollBack() {
      document.documentElement.scrollTop =
        this.$refs.introductionContainer.offsetTop;
    },
    // scroll to next page
    scrollNext() {
      document.documentElement.scrollTop =
        this.$refs.detailedIntroductionContainer.offsetTop +
        getViewportHeight();
    },
    scrollToAbout() {
      document.documentElement.scrollTop =
        this.$refs.detailedIntroductionContainer.offsetTop;
    },

    // the type write effect for adding the text
    setProfessionalText() {
      if (this.intervalId) clearInterval(this.intervalId); // Clear existing interval
      // increment the selection
      this.professionalTextSelectionIndex =
        (this.professionalTextSelectionIndex + 1) %
        this.professionalTextSelection.length;
      this.professionalText =
        this.professionalTextSelection[this.professionalTextSelectionIndex];
      // wait for half a second before starting the interval
      setTimeout(() => {
        this.intervalId = setInterval(() => {
          if (this.professionalTextProgress < this.professionalText.length) {
            this.professionalTextProgress++;
          } else {
            clearInterval(this.intervalId);
            this.unsetProfessionalText();
          }
        }, 100);
      }, 500);
    },
    // the type writer effect for deleting text
    unsetProfessionalText() {
      if (this.intervalId) clearInterval(this.intervalId); // Clear existing interval
      setTimeout(() => {
        this.intervalId = setInterval(() => {
          if (this.professionalTextProgress > 0) {
            this.professionalTextProgress--;
          } else {
            clearInterval(this.intervalId);
            this.setProfessionalText();
          }
        }, 50);
      }, 1000);
    },

    // compute the number of months between two dates
    monthsBetween(startYear, startMonth, endYear, endMonth) {
      // Calculate total months for the start date
      const startTotalMonths = startYear * 12 + startMonth;
      // Calculate total months for the end date
      const endTotalMonths = endYear * 12 + endMonth;
      // Calculate the difference in months
      const differenceInMonths = endTotalMonths - startTotalMonths;
      return differenceInMonths;
    },

    // set up the beginning of the timeline
    // and the end of timeline
    // as well as where to focus the camera
    setUpColor(
      startYear,
      startMonth,
      endYear,
      endMonth,
      focusYear,
      focusMonth,
    ) {
      const beginSegment = this.monthsBetween(1995, 7, startYear, startMonth);
      const endSegment = this.monthsBetween(1995, 7, endYear, endMonth);
      this.time_focus_segment = this.monthsBetween(
        1995,
        7,
        focusYear,
        focusMonth,
      );
      let color = new THREE.Color(0x000000);
      let latestLifeSegment = this.monthsBetween(
        1995,
        7,
        this.timePeriods.life.latest.year,
        this.timePeriods.life.latest.month,
      );
      if (allSegments) {
        for (let i = 0; i < this.segmentCount; i++) {
          if (i >= beginSegment && i <= endSegment) {
            allSegments.setColorAt(i, color.set(0xfe5e3f));
          } else if (i <= latestLifeSegment) {
            allSegments.setColorAt(i, color.set(0x028391));
          } else {
            allSegments.setColorAt(i, color.set(0xccf7ff));
          }
        }
      }
      allSegments.instanceColor.needsUpdate = true;
    },

    setUpTime(timeline) {
      this.setUpColor(
        timeline.begin.year,
        timeline.begin.month,
        timeline.latest.year,
        timeline.latest.month,
        timeline.focus.year,
        timeline.focus.month,
      );
    },

    unsetTime() {
      this.setUpTime(this.timePeriods.life);
    },

    initThree() {
      scene = new THREE.Scene();
      const aspectRatio =
        this.sphereSceneCanvas.clientWidth /
        this.sphereSceneCanvas.clientHeight;
      camera = new THREE.PerspectiveCamera(55, aspectRatio, 1.0, 1000);
      camera.position.z = 3.0;

      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        canvas: this.sphereSceneCanvas,
      });
      renderer.context = renderer.domElement.getContext("webgl2");
      renderer.setClearColor("#ffffff", 1);

      renderer.setSize(
        this.sphereSceneCanvas.clientWidth,
        this.sphereSceneCanvas.clientHeight,
        false,
      );
      // controls = new OrbitControls(camera, renderer.domElement);
      // controls.enablePan = false;
      // controls.enableZoom = true;
      // controls.enableRotate = false;
      // controls.minDistance = 2.1;
      // controls.maxDistance = 5;
      // controls.enableZoom = false;

      // add meshes
      // Create the square geometry
      const geometry = new THREE.PlaneGeometry(0.03, 0.01);

      // Create a basic material
      const material = new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 1,
        side: THREE.DoubleSide,
      });

      // Create an InstancedMesh with the geometry, material, and count
      allSegments = new THREE.InstancedMesh(
        geometry,
        material,
        this.segmentCount,
      );
      for (let i = 0; i < this.segmentCount; i++) {
        allSegments.setColorAt(i, new THREE.Color(0xffffff));
      }

      // Create a matrix to set the position of each instance
      const dummy = new THREE.Object3D();
      for (let i = 0; i < this.segmentCount; i++) {
        dummy.position.set(
          (Math.random() - 0.5) * 10, // Random X position
          (Math.random() - 0.5) * 10, // Random Y position
          (Math.random() - 0.5) * 10, // Random Z position
        );
        dummy.updateMatrix();
        allSegments.setMatrixAt(i, dummy.matrix);
      }

      // Add the instanced mesh to the scene
      scene.add(allSegments);
    },
    onResize() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      if (width >= height) {
        this.containerClass = "w-full h-screen flex relative";
        this.canvasClass = "bg-white h-screen flex-1 w-1/2 h-screen ";
        this.divClass =
          "h-screen bg-white flex-1 w-1/2 h-screen px-5 pt-10 overflow-y-scroll pb-4";
      } else {
        this.containerClass = "w-full h-screen flex flex-col relative";
        this.canvasClass = "bg-white h-1/2 flex-1 w-screen";
        this.divClass = "h-1/2 bg-white flex-1 w-screen overflow-y-scroll pb-4";
      }

      if (camera) {
        this.$nextTick(() => {
          camera.aspect =
            this.sphereSceneCanvas.clientWidth /
            this.sphereSceneCanvas.clientHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(
            this.sphereSceneCanvas.clientWidth,
            this.sphereSceneCanvas.clientHeight,
            false,
          );
        });
      }
    },

    // compute the middle date between the given date and the current date
    getMiddleDate(year, month) {
      const givenDate = new Date(year, month - 1); // Month is 0-indexed in JavaScript Date
      const currentDate = new Date();

      // Calculate the total months from the given date to the current date
      const givenTotalMonths = year * 12 + (month - 1);
      const currentTotalMonths =
        currentDate.getFullYear() * 12 + currentDate.getMonth();

      // Find the midpoint in total months
      const middleTotalMonths = Math.floor(
        (givenTotalMonths + currentTotalMonths) / 2,
      );

      // Convert the middle total months back to year and month
      const middleYear = Math.floor(middleTotalMonths / 12);
      const middleMonth = (middleTotalMonths % 12) + 1; // Month is 1-indexed for output

      return { year: middleYear, month: middleMonth };
    },

    animate() {
      let me = this;

      setTimeout(function () {
        requestAnimationFrame(me.animate);
        // if (controls) {
        //   controls.update();
        // }
        me.curve_progress += me.curve_speed;
        me.curve_progress = me.curve_progress % 1.0;
        const color = new THREE.Color();
        const cameraPosNoramlized = camera.position.clone().normalize();
        const rotationMatrix = new THREE.Matrix4();
        for (let i = 0; i < me.segmentCount; i++) {
          const P2 = curve.getPoint(
            (me.curve_progress - me.gap_between_chars * i) % 1.0,
          );
          // Make the text face the next point on the curve
          const P1 = curve.getPoint(
            (me.curve_progress - 0.00015 - me.gap_between_chars * i) % 1.0,
          );
          const P3 = curve.getPoint(
            (me.curve_progress + 0.00015 - me.gap_between_chars * i) % 1.0,
          );
          const normal = P2.clone().normalize();
          const xAxis = new THREE.Vector3().subVectors(P1, P2).normalize();
          // // Calculate the vector from P2 to P3
          // const vecP2P3 = new THREE.Vector3().subVectors(P3, P2);
          // Calculate the z-axis (normal vector)
          const zAxis = normal.clone();
          // Calculate the y-axis as the cross product of zAxis and xAxis
          const yAxis = new THREE.Vector3()
            .crossVectors(zAxis, xAxis)
            .normalize();
          // Recalculate the x-axis to ensure orthogonality
          xAxis.crossVectors(yAxis, zAxis).normalize();
          // Create a matrix from the basis vectors
          // const rotationMatrix = new THREE.Matrix4();
          rotationMatrix.makeBasis(xAxis, yAxis, zAxis);
          // // Calculate vectors from P1 to P2 and from P1 to P3
          // const vector12 = new THREE.Vector3().subVectors(P2, P1);
          // const vector13 = new THREE.Vector3().subVectors(P3, P1);
          // // Calculate the cross product of these vectors
          // // smooth the area
          // const crossProduct123 = new THREE.Vector3().crossVectors(
          //   vector12,
          //   vector13,
          // );
          // var area = -(60000 * crossProduct123.length()) + 1.0;
          // area = Math.sqrt(Math.max(area, 0.16));
          const scaling = Math.sqrt((P2.dot(cameraPosNoramlized) + 1.0) / 2.0);
          rotationMatrix.setPosition(P2);
          rotationMatrix.scale(new THREE.Vector3(scaling, scaling, scaling));
          allSegments.setMatrixAt(i, rotationMatrix);

          if (i == me.time_focus_segment) {
            // make sure that the camera's distance is constant
            const cameraDistance = camera.position.length();
            const cameraPosition = camera.position.clone().normalize();
            const p2Normalized = P2.clone().normalize();
            const lerpedPosition = cameraPosition
              .lerp(p2Normalized, 0.005)
              .normalize();
            camera.position.set(
              lerpedPosition.x * cameraDistance,
              lerpedPosition.y * cameraDistance,
              lerpedPosition.z * cameraDistance,
            );
            camera.up.lerp(yAxis.multiplyScalar(-1), 0.0075);
            camera.lookAt(new THREE.Vector3());
          }
        }
        allSegments.instanceMatrix.needsUpdate = true;
      }, 1000 / 60);
      if (renderer) {
        renderer.render(scene, camera);
      }
    },
  },
  mounted() {
    // set the date to middle
    const date = new Date();
    const life_middle = this.getMiddleDate(1995, 7);
    const phd_middle = this.getMiddleDate(2022, 9);
    this.timePeriods.life.focus.year = life_middle.year;
    this.timePeriods.life.focus.month = life_middle.month;
    this.timePeriods.phd.focus.year = phd_middle.year;
    this.timePeriods.phd.focus.month = phd_middle.month;

    // start showing the texts
    this.setProfessionalText();

    // set the canvas
    this.sphereSceneCanvas = this.$refs.sphereSceneCanvas;

    // set the style
    this.onResize(); // this will set the style

    // now we start the rendering stuffs
    let me = this;
    this.$nextTick(() => {
      this.initThree();
      this.animate();
      this.setUpTime(this.timePeriods.life);
    });

    window.addEventListener("resize", this.onResize);
  },
  beforeDestroy() {
    // Clear interval when the component is destroyed to prevent memory leaks
    if (this.intervalId) clearInterval(this.intervalId);
    window.removeEventListener("resize", this.onResize);
  },
};
</script>

<style scoped>
.blinking-text::after {
  content: "";
  display: inline-block;
  width: 5px;
  height: 1em;
  background-color: currentColor;
  animation: blink 1s step-end infinite;
  margin-left: 2px; /* Adjust this for spacing */
  vertical-align: bottom; /* Adjust to align with the text */
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}

.paper {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.paper-details {
  flex: 1;
}

.paper-image {
  max-width: 150px; /* Adjust the width as needed */
  height: auto;
}
</style>
