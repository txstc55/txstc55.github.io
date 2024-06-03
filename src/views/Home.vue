<template>
  <div class="w-full h-full overflow-hidden">
    <div class="w-full h-screen welcome-bg"></div>
    <div class="w-full h-screen welcome-bg"></div>
    <div class="w-full h-screen welcome-bg"></div>
    <div class="w-full h-screen welcome-bg"></div>
    <div
      ref="threejsContainer"
      id="threejsContainer"
      class="w-full h-full overscroll-none"
      :class="{
        'fixed translate-y-0 top-0': scrollTopPercent <= this.hidingCoeff,
        '-translate-y-full absolute': scrollTopPercent > this.hidingCoeff,
      }"
    >
      <div
        class="absolute bottom-0 text-white text-center w-full animate-bounce animate duration-500 ease-in-out select-none"
        :class="{
          'opacity-0': scrollTopPercent > 0.1,
          'opacity-100': scrollTopPercent <= 0.1,
        }"
        :style="{ 'font-family': 'Asap' }"
      >
        Scroll for More<br />↓
      </div>
    </div>
  </div>
</template>

<script>
import * as THREE from "three";
let scene = null;
let sentenceMesh = null;
// import cover image
import coverImage3 from "@/assets/self.png";
// import center cutout image
import centerCutoutImage from "@/assets/center_cut.png";
import moebiusShader from "@/shaders/moebiusShader.js";
import sentenceShader from "@/shaders/sentenceShader.js";
import helloShader from "@/shaders/helloShader.js";

export default {
  name: "Home",
  data() {
    return {
      threejsContainer: null, // container for the threejs canvas
      camera: null, // camera
      renderer: null, // renderer
      maxHeightOrWidth: 21, // max height or width of the image
      timerRandoms: [], // random values for the shader
      coverImageTexture: null, // texture for cover image
      centerCutoutImageTexture: null, // texture for the cutout image
      moebiusShaderMaterial: null, // material for the moebius shader
      sentenceShaderMaterial: null, // material for the sentence shader
      helloShaderMaterial: null, // material for the hello shader
      imageWidth: 0, // width of the image
      imageHeight: 0, // height of the image
      hsbChoice: 0,
      ticks: 0,
      sentences: [
        "WHAT IS THIS PLACE",
        "WHO IS THIS",
        "WHAT IS THIS",
        "WHERE AM I",
        "WHAT IS HAPPENING",
        "WHAT IS GOING ON",
        "WHAT'S NEXT",
        "IS ANYONE LISTENING",
        "WHY AM I HERE",
        "WHO CREATED THIS",
        "WHAT'S THE PURPOSE",
        "WHAT'S THE POINT",
      ],
      sentenceTextures: [],
      moebiusShader: new moebiusShader(),
      sentenceShader: new sentenceShader(),
      helloShader: new helloShader(),
      textColors: [
        "#112236",
        "#ffffff",
        "#000000",
        "#15182D",
        "#EFD9CE",
        "#aedaf6",
      ],
      backgroundColors: [
        "#93e1ce",
        "#b51963",
        "#fdcb68",
        "#EFD9CE",
        "#25283D",
        "#023047",
      ],
      colorChoice: 0,
      scaleUp: 31.0, // how much we want the text mesh to scale up
      windowHeight: window.innerHeight,
      maxZ: 20.0,
      minZ: -5,
      scrollTopPercent: 0,
      stopAnimation: false,
      curve_progress: 0, // progress of the curve
      curve_speed: 0.00002, // speed of text movement on the curve
      gap_between_chars: 0.00083, // gap between characters for the curve
      x_percent_target: 0.0, // position of the mouse on x-axis
      y_percent_target: 0.0, // position of the mouse on y-axis
      x_percent_lerped: 0.0,
      y_percent_lerped: 0.0,
      lerpSpeed: 0.05,
      hidingCoeff: 0.75, // hide the canvas if scrollTopPercent is pass this
    };
  },
  async mounted() {
    this.scrollTopPercent =
      document.documentElement.scrollTop / (4 * this.windowHeight);
    this.colorChoice = Math.floor(Math.random() * this.backgroundColors.length);
    document.documentElement.scrollTop = 0.0;
    await this.loadFont();
    for (var i = 0; i < 32; i++) {
      this.timerRandoms.push(Math.random() * 40.0 + 7.0);
    }
    this.threejsContainer = this.$refs.threejsContainer;
    this.initThree();
    this.animate();
    window.addEventListener("resize", this.onResize);
    window.addEventListener("scroll", this.onScroll);
    window.addEventListener("mousemove", this.onMouseMove);
    window.addEventListener("touchmove", this.onTouchMove);

    for (var i = 0; i < 12; i++) {
      // randomly shuffle sentences
      this.sentences.sort(() => 0.5 - Math.random());
      // create a concatenated sentence
      // but only for first 5 sentences
      var joinedSentece = this.sentences.slice(0, 3).join("   ");
      joinedSentece += "   ";
      this.sentenceTextures.push(
        this.generateTextureFromSentence(joinedSentece),
      );
    }
  },
  methods: {
    // random value within a range
    randomWithinRange(min, max) {
      return Math.random() * (max - min) + min;
    },

    // Load the custom font
    loadFont() {
      const font = new FontFace("Asap", "url(asap.ttf)");
      return font.load().then(function (loadedFont) {
        document.fonts.add(loadedFont);
      });
    },

    // generate a texture from a sentence
    generateTextureFromSentence(
      sentence,
      fontSize = 100,
      padding = 30,
      color = null,
      fontFamily = "Asap",
    ) {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      // Set font before measuring text
      context.font = `${fontSize}px ${fontFamily}`;

      // Measure sentence size
      const metrics = context.measureText(sentence);
      const textWidth = metrics.width;
      const textHeight =
        metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

      // Adjust canvas size based on sentence size + padding
      canvas.width = textWidth + padding * 2; // Increase the resolution for better quality
      canvas.height = textHeight + padding * 2; // Increase the resolution for better quality

      // Optional: Fill background if needed
      context.fillStyle = "rgba(0, 0, 0, 0)";
      context.fillRect(0, 0, canvas.width, canvas.height);

      // Set text properties for drawing
      if (color == null) {
        context.fillStyle = this.textColors[this.colorChoice];
      } else {
        context.fillStyle = color;
      }
      context.textBaseline = "middle"; // Align text vertically in the middle
      context.textAlign = "center"; // Align text horizontally in the center
      context.font = `${fontSize}px ${fontFamily}`; // Scale the font size accordingly

      // Draw the text at the center of the canvas
      context.fillText(sentence, canvas.width / 2, canvas.height / 2);

      const texture = new THREE.CanvasTexture(canvas);
      texture.generateMipmaps = true;
      texture.needsUpdate = true;
      return { texture: texture, width: canvas.width, height: canvas.height };
    },

    onResize() {
      this.camera.aspect =
        this.threejsContainer.clientWidth / this.threejsContainer.clientHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(
        this.threejsContainer.clientWidth,
        this.threejsContainer.clientHeight,
      );
      this.windowHeight = window.innerHeight;
      this.onScroll();
    },

    onScroll() {
      let oldScrollTopPercent = this.scrollTopPercent;
      this.camera.position.z = Math.max(
        (1 - document.documentElement.scrollTop / (4 * this.windowHeight)) *
          (this.maxZ - this.minZ) +
          this.minZ,
        1.25,
      );
      this.scrollTopPercent =
        document.documentElement.scrollTop / (4 * this.windowHeight);
      if (this.helloShaderMaterial) {
        this.helloShaderMaterial.uniforms.scrollTopPercent.value =
          this.scrollTopPercent;
      }
      if (this.moebiusShaderMaterial) {
        this.moebiusShaderMaterial.uniforms.scrollTopPercent.value =
          this.scrollTopPercent;
      }
      if (this.scrollTopPercent > 1.0) {
        this.renderer.setClearColor("rgb(240, 179, 188)", 1);
        this.stopAnimation = true;
      } else {
        if (oldScrollTopPercent > 1.0) {
          this.stopAnimation = false;
          this.renderer.setClearColor(
            this.backgroundColors[this.colorChoice],
            1,
          );
        }
      }
      // console.log(this.scrollTopPercent);
      this.camera.position.y =
        (4.0 * document.documentElement.scrollTop) / (4 * this.windowHeight);
      if (sentenceMesh) {
        sentenceMesh.scale.set(
          1.0 - this.scrollTopPercent,
          1.0 - this.scrollTopPercent,
          1.0 - this.scrollTopPercent,
        );
      }
    },

    onMouseMove(event) {
      this.x_percent_target = (event.clientX / window.innerWidth) * 2 - 1;
      this.y_percent_target = -(event.clientY / window.innerHeight) * 2 + 1; // Note the negative as the screen's y-coordinate goes from top to bottom.
    },

    onTouchMove(event) {
      // Prevent the default scrolling on touch move
      event.preventDefault();
      const touch = event.touches[0];

      // Normalize the touch coordinates from -1 to 1
      this.x_percent_target = (touch.clientX / window.innerWidth) * 2 - 1;
      this.y_percent_target = -(touch.clientY / window.innerHeight) * 2 + 1; // Negative because the screen's y-coordinate goes from top to bottom.
    },

    initThree() {
      scene = new THREE.Scene();

      const aspectRatio =
        this.threejsContainer.clientWidth / this.threejsContainer.clientHeight;
      this.camera = new THREE.PerspectiveCamera(55, aspectRatio, 1.0, 1000);
      this.camera.position.z = 20.0;

      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
      this.renderer.context = this.renderer.domElement.getContext("webgl2");
      this.renderer.setSize(
        this.threejsContainer.clientWidth,
        this.threejsContainer.clientHeight,
      );
      this.renderer.setClearColor(this.backgroundColors[this.colorChoice], 1);
      this.threejsContainer.appendChild(this.renderer.domElement);

      const gl = this.renderer.getContext();
      const maxTextures = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);

      const textureLoader = new THREE.TextureLoader();
      let me = this;

      // add shader for the image
      new THREE.ImageLoader().load(coverImage3, (image) => {
        // get the aspect ratio of the image
        var imgAspect = image.width / image.height;

        me.imageWidth = image.width;
        me.imageHeight = image.height;
        let width, height;
        width = image.width;
        height = image.height;

        // change aspect ratio accordingly
        if (imgAspect > 1) {
          // Width is larger
          width = me.maxHeightOrWidth;
          height = me.maxHeightOrWidth / imgAspect;
        } else {
          // Height is larger
          height = me.maxHeightOrWidth;
          width = me.maxHeightOrWidth * imgAspect;
        }
        // Create Plane Geometry with the aspect ratio
        const geometry = new THREE.PlaneGeometry(width, height);

        // Create texture from the loaded image
        me.coverImageTexture = new THREE.Texture();
        me.coverImageTexture.image = image;
        me.coverImageTexture.needsUpdate = true;
        me.coverImageTexture.premultiplyAlpha = true;

        me.moebiusShaderMaterial = new THREE.ShaderMaterial({
          uniforms: {
            coverImage: { value: me.coverImageTexture },
            width: { value: me.imageWidth },
            height: { value: me.imageHeight },
            timerRandoms: { value: me.timerRandoms },
            u_hueAdjust: { value: me.randomWithinRange(-0.05, 0.05) },
            u_saturationAdjust: { value: me.randomWithinRange(-0.25, 0.75) },
            u_brightnessAdjust: { value: me.randomWithinRange(-0.03, 0.4) },
            scrollTopPercent: { value: me.scrollTopPercent },
          },
          vertexShader: me.moebiusShader.vertexShader,
          fragmentShader: me.moebiusShader.fragmentShader,
          transparent: true,
        });

        const imageMesh = new THREE.Mesh(geometry, me.moebiusShaderMaterial);
        scene.add(imageMesh);
      });

      // add shader for sentences
      new THREE.ImageLoader().load(centerCutoutImage, (image) => {
        let width, height;
        width = image.width;
        height = image.height;
        var imgAspect = image.width / image.height;

        // change aspect ratio accordingly
        if (imgAspect > 1) {
          // Width is larger
          width = me.maxHeightOrWidth;
          height = me.maxHeightOrWidth / imgAspect;
        } else {
          // Height is larger
          height = me.maxHeightOrWidth;
          width = me.maxHeightOrWidth * imgAspect;
        }
        const geometry = new THREE.PlaneGeometry(
          width * me.scaleUp,
          height * me.scaleUp,
          1,
          1,
        );
        me.centerCutoutTexture = new THREE.Texture();
        me.centerCutoutTexture.image = image;
        me.centerCutoutTexture.needsUpdate = true;
        const material = new THREE.MeshBasicMaterial({
          map: me.centerCutoutTexture,
          side: THREE.DoubleSide,
          transparent: true,
        });

        var allSentenceWidths = [];
        for (let i = 0; i < me.sentenceTextures.length; i++) {
          allSentenceWidths.push(me.sentenceTextures[i].width);
        }
        var allSentenceHeights = [];
        for (let i = 0; i < me.sentenceTextures.length; i++) {
          allSentenceHeights.push(me.sentenceTextures[i].height);
        }

        me.sentenceShaderMaterial = new THREE.ShaderMaterial({
          uniforms: {
            coverImage: { value: me.coverImageTexture },
            cutoutImage: { value: me.centerCutoutTexture },
            width: { value: image.width },
            height: { value: image.height },
            timerRandoms: { value: 1.0 },
            scaleUp: { value: me.scaleUp },
            sentenceTexture0: { value: me.sentenceTextures[0].texture },
            sentenceTexture1: { value: me.sentenceTextures[1].texture },
            sentenceTexture2: { value: me.sentenceTextures[2].texture },
            sentenceTexture3: { value: me.sentenceTextures[3].texture },
            sentenceTexture4: { value: me.sentenceTextures[4].texture },
            sentenceTexture5: { value: me.sentenceTextures[5].texture },
            sentenceTexture6: { value: me.sentenceTextures[6].texture },
            sentenceTexture7: { value: me.sentenceTextures[7].texture },
            sentenceTexture8: { value: me.sentenceTextures[8].texture },
            sentenceTexture9: { value: me.sentenceTextures[9].texture },
            sentenceTexture10: { value: me.sentenceTextures[10].texture },
            sentenceTexture11: { value: me.sentenceTextures[11].texture },
            sentenceWidths: { value: new Float32Array(allSentenceWidths) },
            sentenceHeights: { value: new Float32Array(allSentenceHeights) },
            time: { value: 0.0 },
          },
          vertexShader: me.sentenceShader.vertexShader,
          fragmentShader: me.sentenceShader.fragmentShader,
          transparent: true,
        });

        sentenceMesh = new THREE.Mesh(geometry, me.sentenceShaderMaterial);
        sentenceMesh.position.z = -0.0004;
        scene.add(sentenceMesh);

        // add another mesh for welcoming people
        const geometry1 = new THREE.PlaneGeometry(
          width * 3.0,
          height * 3.0,
          1,
          1,
        );
        me.helloShaderMaterial = new THREE.ShaderMaterial({
          uniforms: {
            cutoutImage: { value: me.centerCutoutTexture },
            coverImage: { value: me.coverImageTexture },
            width: { value: image.width },
            height: { value: image.height },
            time: { value: 0.0 },
            scrollTopPercent: { value: me.scrollTopPercent },
            mouse_x_percent: { value: me.x_percent_lerped },
            mouse_y_percent: { value: me.y_percent_lerped },
            maxZ: { value: me.maxZ },
            minZ: { value: me.minZ },
            maxY: { value: 4.0 },
            maxHeightOrWidth: { value: me.maxHeightOrWidth },
            scaleUp: { value: 3.0 },
          },
          vertexShader: me.helloShader.vertexShader,
          fragmentShader: me.helloShader.fragmentShader,
          transparent: true,
        });

        const helloMesh = new THREE.Mesh(geometry1, me.helloShaderMaterial);
        helloMesh.position.z = -0.0001;
        scene.add(helloMesh);
      });
    },
    lerp(start, end, amt) {
      return (1 - amt) * start + amt * end;
    },
    animate() {
      let me = this;
      setTimeout(function () {
        requestAnimationFrame(me.animate);

        if (me.ticks == 0) {
          for (var i = 0; i < 32; i++) {
            me.timerRandoms[i] = Math.random() * 40.0 + 7.0;
          }
        }

        me.choice = (me.choice + 1) % 2;
        me.ticks = (me.ticks + 1) % 90;
        me.x_percent_lerped = me.lerp(
          me.x_percent_lerped,
          me.x_percent_target,
          me.lerpSpeed,
        );
        me.y_percent_lerped = me.lerp(
          me.y_percent_lerped,
          me.y_percent_target,
          me.lerpSpeed,
        );

        // change hsb
        me.hsbChoice = (me.hsbChoice + 1) % 73;
        if (me.hsbChoice == 0) {
          me.moebiusShaderMaterial.uniforms.u_hueAdjust.value =
            me.randomWithinRange(-0.06, 0.06);
          me.moebiusShaderMaterial.uniforms.u_saturationAdjust.value =
            me.randomWithinRange(-0.25, 0.75);
          me.moebiusShaderMaterial.uniforms.u_brightnessAdjust.value =
            me.randomWithinRange(-0.03, 0.4);
        }
        // move text background
        if (me.sentenceShaderMaterial) {
          me.sentenceShaderMaterial.uniforms.time.value += 0.01;
        }
        if (me.helloShaderMaterial) {
          me.helloShaderMaterial.uniforms.time.value += 0.02;
          me.helloShaderMaterial.uniforms.mouse_x_percent.value =
            me.x_percent_lerped;
          me.helloShaderMaterial.uniforms.mouse_y_percent.value =
            me.y_percent_lerped;
          // console.log(me.y_percent_lerped);
        }
      }, 1000 / 60);
      if (!this.stopAnimation) {
        this.renderer.render(scene, this.camera);
      }
    },
  },
};
</script>

<style scoped></style>
