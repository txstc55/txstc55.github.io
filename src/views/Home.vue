<template>
  <div class="w-full h-full scroll-smooth">
    <div class="w-full h-screen blank"></div>
    <div class="w-full h-screen blank"></div>
    <div class="w-full h-screen blank"></div>
    <div class="w-full h-screen blank"></div>
    <div
      ref="threejsContainer"
      id="threejsContainer"
      class="fixed w-full h-full overscroll-none animate ease-in-out top-0 duration-500"
      :class="{
        'opacity-1 scale-100': scrollTopPercent <= 0.75,
        'opacity-0 -top-96 scale-50': scrollTopPercent > 0.75,
        'background-color': 'rgba(240, 179, 188)',
      }"
    ></div>
  </div>
</template>

<script>
import * as THREE from "three";
let scene = null;
// import cover image
import coverImage3 from "@/assets/self.png";
// import center cutout image
import centerCutoutImage from "@/assets/center_cut.png";
import moebiusShader from "@/shaders/moebiusShader.js";
import sentenceShader from "@/shaders/sentenceShader.js";
import curve_points from "@/assets/points.json";
import { Text } from "troika-three-text";

// let's just define the curve here
const points = curve_points.xyz.map(
  (point) => new THREE.Vector3(point[0], point[1], point[2]),
);
var curve = new THREE.CatmullRomCurve3(points);
// curve.curveType = "chordal";
curve.closed = true;

const greetings = [
  "HELLO",     // English
  "HOLA",        // Spanish
  "BONJOUR",     // French
  "HALLO",       // German
  "CIAO",        // Italian
  "OLÁ",         // Portuguese
  "ПРИВЕТ",      // Russian (PRIVET)
  "你好",         // Chinese (Mandarin) (NǏ HǍO)
  "こんにちは",   // Japanese (KONNICHIWA)
  "안녕하세요",   // Korean (ANNYEONGHASEYO)
  "MERHABA",     // Turkish
  "HALLO",       // Dutch
  "ΓΕΙΑ ΣΟΥ",    // Greek (GEIA SOU)
  "CZEŚĆ",       // Polish
  "HEJ",         // Swedish
];
// shuffle and join the greetings
let text_sentence = (greetings.sort(() => Math.random() - 0.5).join("---") + "---").repeat(4);
var curve_texts = [];
for (let i = 0; i < text_sentence.length; i++) {
  const curve_text = new Text();
  curve_text.text = text_sentence[i];
  curve_text.fontSize = 0.20;
  curve_text.color = 0xffffff;
  curve_text.anchorX = "center";
  curve_text.anchorY = "middle";
  // curve_text.strokeWidth = 0.001;
  // curve_text.strokeOpacity = 1.0;
  // curve_text.strokeColor = 0x000000;
  curve_text.fillOpacity = 1.0;
  curve_texts.push(curve_text);
  // diable double side rendering
  // curve_texts[i].material.side = THREE.FrontSide;
}

export default {
  name: "Home",
  data() {
    return {
      threejsContainer: null, // container for the threejs canvas
      camera: null, // camera
      renderer: null, // renderer
      maxHeightOrWidth: 22, // max height or width of the image
      timerRandoms: [], // random values for the shader
      coverImageTexture: null, // texture for cover image
      centerCutoutImageTexture: null, // texture for the cutout image
      moebiusShaderMaterial: null, // material for the moebius shader
      sentenceShaderMaterial: null, // material for the sentence shader
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
      curve_speed: 0.00003, // speed of text movement on the curve
      gap_between_chars: 0.0020, // gap between characters for the curve
      x_percent: 0.0, // position of the mouse on x-axis
      y_percent: 0.0, // position of the mouse on y-axis
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
    generateTextureFromSentence(sentence) {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      const fontSize = 500;
      const fontFamily = "Asap";
      const padding = 100; // Uniform padding for all sides

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
      // context.fillStyle = "white";
      // context.fillRect(0, 0, canvas.width, canvas.height);

      // Set text properties for drawing
      context.fillStyle = this.textColors[this.colorChoice];
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
      this.camera.position.z =
        (1 - document.documentElement.scrollTop / (4 * this.windowHeight)) *
          (this.maxZ - this.minZ) +
        this.minZ;
      this.scrollTopPercent =
        document.documentElement.scrollTop / (4 * this.windowHeight);
      if (this.scrollTopPercent >= 0.75) {
        this.renderer.setClearColor("rgb(240, 179, 188)", 1);
        this.stopAnimation = true;
      } else {
        if (oldScrollTopPercent >= 0.75) {
          this.stopAnimation = false;
          this.renderer.setClearColor(
            this.backgroundColors[this.colorChoice],
            1,
          );
        }
      }
      // console.log(this.scrollTopPercent);
      this.camera.position.y =
        (3.0 * document.documentElement.scrollTop) / (4 * this.windowHeight);
    },
    onMouseMove(event) {
      this.x_percent = event.clientX / window.innerWidth;
      this.y_percent = event.clientY / window.innerHeight;
      // map from -1 to 1
      this.x_percent = this.x_percent * 2 - 1;
      this.y_percent = this.y_percent * 2 - 1;
      const rotation_around_x = this.y_percent * 2.7;
      const rotation_around_y = this.x_percent * 2.7;

      // compute rotation matrix
      const rotation_matrix = new THREE.Matrix4();
      rotation_matrix.makeRotationFromEuler(
        new THREE.Euler(rotation_around_x, rotation_around_y, 0),
      );
      const rotatedPoints = points.map(point => point.clone().applyMatrix4(rotation_matrix));

      // Create a new curve with the rotated points
      curve = new THREE.CatmullRomCurve3(rotatedPoints);
      curve.closed = true;
    },
    initThree() {
      scene = new THREE.Scene();

      const aspectRatio =
        this.threejsContainer.clientWidth / this.threejsContainer.clientHeight;
      this.camera = new THREE.PerspectiveCamera(50, aspectRatio, 0.5, 1000);
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
        me.coverImageTexture.premultiplyAlpha = false;

        const material = new THREE.MeshBasicMaterial({
          map: me.coverImageTexture,
          side: THREE.DoubleSide,
          transparent: true,
          alphaTest: 0.01,
        });

        me.moebiusShaderMaterial = new THREE.ShaderMaterial({
          uniforms: {
            coverImage: { value: me.coverImageTexture },
            width: { value: me.imageWidth },
            height: { value: me.imageHeight },
            timerRandoms: { value: me.timerRandoms },
            u_hueAdjust: { value: me.randomWithinRange(-0.04, 0.04) },
            u_saturationAdjust: { value: me.randomWithinRange(-0.25, 0.75) },
            u_brightnessAdjust: { value: me.randomWithinRange(-0.03, 0.4) },
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

        const sentenceMesh = new THREE.Mesh(
          geometry,
          me.sentenceShaderMaterial,
        );
        sentenceMesh.position.z = -0.0001;
        scene.add(sentenceMesh);
      });

      // add spherical text
      for (let i = 0; i < curve_texts.length; i++) {
        scene.add(curve_texts[i]);
      }
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

        // move curve text
        // Update progress
        me.curve_progress += me.curve_speed;
        if (me.curve_progress > 1) {
          me.curve_progress = 0; // Loop the animation
        }
        // const angle = me.ticks * Math.PI * 2 / 90; // 45 degrees
        // const axis = new THREE.Vector3(0, 1, 0); // Y-axis
        // const rotationMatrix = new THREE.Matrix4().makeRotationAxis(axis, angle);
        // const rotatedPoints = points.map(point => point.clone().applyMatrix4(rotationMatrix));

        // // Create a new curve with the rotated points
        // curve = new THREE.CatmullRomCurve3(rotatedPoints);
        // curve.closed = true;


        for (let i = 0; i < curve_texts.length; i++) {

          // Get the position along the curve
          const P2 = curve.getPoint(
            (me.curve_progress - me.gap_between_chars * i) % 1,
          );
          // Make the text face the next point on the curve
          const P1 = curve.getPoint(
            (me.curve_progress - 0.00015 - me.gap_between_chars * i) % 1,
          );
          const P3 = curve.getPoint(
            (me.curve_progress + 0.00015 - me.gap_between_chars * i) % 1,
          );
          const P4 = curve.getPoint(
            (me.curve_progress - 0.00015 * 2.0 - me.gap_between_chars * i) % 1,
          );
          const P5 = curve.getPoint(
            (me.curve_progress + 0.00015 * 2.0 - me.gap_between_chars * i) % 1,
          );
          const normal = P2.clone().normalize();
          // Calculate the vector from P2 to P1 and normalize it to get the x-axis
          const xAxis = new THREE.Vector3().subVectors(P1, P2).normalize();
          // Calculate the vector from P2 to P3
          const vecP2P3 = new THREE.Vector3().subVectors(P3, P2);
          // Calculate the z-axis (normal vector)
          const zAxis = normal.clone();
          // Calculate the y-axis as the cross product of zAxis and xAxis
          const yAxis = new THREE.Vector3()
            .crossVectors(zAxis, xAxis)
            .normalize();
          // Recalculate the x-axis to ensure orthogonality
          xAxis.crossVectors(yAxis, zAxis).normalize();
          // Create a matrix from the basis vectors
          const matrix = new THREE.Matrix4().makeBasis(xAxis, yAxis, zAxis);
          // Set the rotation of the square based on the matrix
          curve_texts[i].setRotationFromMatrix(matrix);

          // Calculate vectors from P1 to P2 and from P1 to P3
          const vector12 = new THREE.Vector3().subVectors(P2, P1);
          const vector13 = new THREE.Vector3().subVectors(P3, P1);
          const vector24 = new THREE.Vector3().subVectors(P4, P2);
          const vector35 = new THREE.Vector3().subVectors(P5, P3);
          // Calculate the cross product of these vectors
          // smooth the area
          const crossProduct123 = new THREE.Vector3().crossVectors(
            vector12,
            vector13,
          );
          const crossProduct241 = new THREE.Vector3().crossVectors(
            vector24,
            vector12,
          );
          const crossProduct315 = new THREE.Vector3().crossVectors(
            vector35,
            vector13,
          );

          var area =
            -(60000 *
              (crossProduct123.length() +
                crossProduct241.length() +
                crossProduct315.length())) /
              3.0 +
            1.0;
          area = Math.sqrt(Math.max(area, 0.16));
          const scaling = 1 - me.scrollTopPercent;
          let p2Copy = P2.clone();
          p2Copy.x *= Math.min(1.40 * scaling, 1.2);
          p2Copy.y *= Math.min(1.40 * scaling, 1.2);
          p2Copy.y += 1.8 + (1 - scaling) * 0.6; // make sure it always look like its in center
          p2Copy.z *= Math.min(1.40 * scaling, 1.2);
          p2Copy.z += 5.0 - me.scrollTopPercent * 6.2;
          curve_texts[i].position.copy(p2Copy);
          curve_texts[i].scale.set(
            area * scaling * (P2.z * 0.25 + 0.75),
            area * scaling * (P2.z * 0.25 + 0.75),
            area * scaling * (P2.z * 0.25 + 0.75),
          );
          curve_texts[i].sync();
        }
      }, 1000 / 120);
      if (!this.stopAnimation) {
        this.renderer.render(scene, this.camera);
      }
    },
  },
};
</script>

<style scoped>
@font-face {
  font-family: "Asap";
  src: url("@/assets/asap.ttf") format("truetype");
}

.blank {
  background-color: rgb(240, 179, 188);
}
</style>
