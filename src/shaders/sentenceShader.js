class sentenceShader {
  constructor() {
    this.vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    this.fragmentShader = `
      uniform float time;
      uniform sampler2D coverImage;
      uniform sampler2D cutoutImage;
      uniform sampler2D sentenceTexture0;
      uniform sampler2D sentenceTexture1;
      uniform sampler2D sentenceTexture2;
      uniform sampler2D sentenceTexture3;
      uniform sampler2D sentenceTexture4;
      uniform sampler2D sentenceTexture5;
      uniform sampler2D sentenceTexture6;
      uniform sampler2D sentenceTexture7;
      uniform sampler2D sentenceTexture8;
      uniform sampler2D sentenceTexture9;
      uniform sampler2D sentenceTexture10;
      uniform sampler2D sentenceTexture11;
      uniform float[12] sentenceWidths;
      uniform float[12] sentenceHeights;
      uniform float scaleUp;
      uniform float width;
      uniform float height;


      float rand(vec2 co){
          return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
      }

      varying vec2 vUv;
      void main(){
        float numSentences = 400.0;
        // compute the border size
        float sideScale = floor(scaleUp / 2.0);
        float ydiv = floor(vUv.y * numSentences);
        int choice = int(mod(ydiv, 12.0));

        // if we are in the center, we need to recompute uv
        float uCenter = (vUv.x - (1.0 / scaleUp) * sideScale) * scaleUp;
        float vCenter = (vUv.y - (1.0 / scaleUp) * sideScale) * scaleUp;
        if (texture2D(cutoutImage, vec2(uCenter, vCenter)).a > 0.0){
          gl_FragColor = vec4(255.0 / 255.0, 255.0 / 255.0, 255.0 / 255.0, 1.0);
          // gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
        }else{
          // direction of the text
          float direction = rand(vec2(ydiv * sentenceWidths[choice] / 9723.0, float(choice) * sentenceWidths[choice] / 9723.0));
          float speed = rand(vec2(float(choice) * sentenceWidths[choice] / 9717.0, ydiv)) + 1.0;
          if (direction > 0.5){
            direction = 1.0;
          }else{
            direction = -1.0;
          }
          float yPercent = vUv.y * numSentences - ydiv ;
          float sentenceWidthRelative = sentenceWidths[choice] / (sentenceHeights[choice] * numSentences);
          float xMod = mod(vUv.x + direction * speed * time / 200.0, sentenceWidthRelative);
          float xPercent = xMod / sentenceWidthRelative;



          if (choice == 0){
            gl_FragColor = texture2D(sentenceTexture0, vec2(xPercent, yPercent));
          } else if (choice == 1){
            gl_FragColor = texture2D(sentenceTexture1, vec2(xPercent, yPercent));
          } else if (choice == 2){
            gl_FragColor = texture2D(sentenceTexture2, vec2(xPercent, yPercent));
          } else if (choice == 3){
            gl_FragColor = texture2D(sentenceTexture3, vec2(xPercent, yPercent));
          } else if (choice == 4){
            gl_FragColor = texture2D(sentenceTexture4, vec2(xPercent, yPercent));
          } else if (choice == 5){
            gl_FragColor = texture2D(sentenceTexture5, vec2(xPercent, yPercent));
          } else if (choice == 6){
            gl_FragColor = texture2D(sentenceTexture6, vec2(xPercent, yPercent));
          } else if (choice == 7){
            gl_FragColor = texture2D(sentenceTexture7, vec2(xPercent, yPercent));
          } else if (choice == 8){
            gl_FragColor = texture2D(sentenceTexture8, vec2(xPercent, yPercent));
          } else if (choice == 9){
            gl_FragColor = texture2D(sentenceTexture9, vec2(xPercent, yPercent));
          } else if (choice == 10){
            gl_FragColor = texture2D(sentenceTexture10, vec2(xPercent, yPercent));
          } else if (choice == 11){
            gl_FragColor = texture2D(sentenceTexture11, vec2(xPercent, yPercent));
          }

          if (xPercent * sentenceWidths[choice] < 25.0 || (1.0 - xPercent) * sentenceWidths[choice] < 25.0){
            gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
          }
          if (yPercent * sentenceHeights[choice] < 25.0 || (1.0 - yPercent) * sentenceHeights[choice] < 25.0){
            gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
          }
          return;
        }
      }
      `;
  }
}

export default sentenceShader;
