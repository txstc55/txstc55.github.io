class helloShader {
  constructor() {
    this.vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;
    this.fragmentShader = `
      uniform float scrollTopPercent;
      uniform sampler2D cutoutImage;
      uniform sampler2D helloTexture0;
      uniform sampler2D helloTexture1;
      uniform sampler2D helloTexture2;
      uniform sampler2D helloTexture3;
      uniform sampler2D helloTexture4;
      uniform sampler2D helloTexture5;
      uniform sampler2D helloTexture6;
      uniform sampler2D centerHelloTexture0;
      uniform sampler2D centerHelloTexture1;
      uniform sampler2D centerHelloTexture2;
      uniform sampler2D centerHelloTexture3;
      uniform sampler2D centerHelloTexture4;
      uniform sampler2D centerHelloTexture5;
      uniform sampler2D centerHelloTexture6;
      uniform float[14] sentenceWidths;
      uniform float[14] sentenceHeights;
      uniform float width;
      uniform float height;
      uniform float time;

      varying vec2 vUv;
      float rand(vec2 co){
        return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
      }
      void main(){
        float numSentencesSmall = 50.0 * (1.0 - scrollTopPercent + 0.1);
        float numSentencesBig = 1.0;
        if (texture2D(cutoutImage, vUv).a > 0.0){
          // we put the text in there
          float ydiv = floor((vUv.y - 0.5) * numSentencesSmall);
          int choice = int(mod(ydiv, 7.0));
          float yPercent = (vUv.y - 0.5) * numSentencesSmall - ydiv;
          float sentenceWidthRelative = sentenceWidths[choice] / sentenceHeights[choice] / numSentencesSmall;

          float offset = rand(vec2(ydiv * sentenceWidths[choice] / 9723.0, float(choice) * sentenceWidths[choice] / 9723.0));
          float direction = rand(vec2(ydiv * sentenceWidths[choice] / 9723.0, float(choice) * sentenceWidths[choice] / 9723.0));
          float speed = rand(vec2(float(choice) * sentenceWidths[choice] / 9717.0, ydiv)) + 1.0;
          if (direction > 0.5){
            direction = 1.0;
          }else{
            direction = -1.0;
          }
          float xMod = mod(vUv.x - 0.5 + offset + (speed * direction * time / 80.0 * max(1.0 - scrollTopPercent, 0.0)), sentenceWidthRelative);
          float xPercent = xMod / sentenceWidthRelative;
          if (choice == 0){
            gl_FragColor = texture2D(helloTexture0, vec2(xPercent, yPercent));
          } else if (choice == 1){
            gl_FragColor = texture2D(helloTexture1, vec2(xPercent, yPercent));
          } else if (choice == 2){
            gl_FragColor = texture2D(helloTexture2, vec2(xPercent, yPercent));
          } else if (choice == 3){
            gl_FragColor = texture2D(helloTexture3, vec2(xPercent, yPercent));
          } else if (choice == 4){
            gl_FragColor = texture2D(helloTexture4, vec2(xPercent, yPercent));
          } else if (choice == 5){
            gl_FragColor = texture2D(helloTexture5, vec2(xPercent, yPercent));
          } else if (choice == 6){
            gl_FragColor = texture2D(helloTexture6, vec2(xPercent, yPercent));
          }
          if (xPercent * sentenceWidths[choice] < 90.0 || (1.0 - xPercent) * sentenceWidths[choice] < 90.0){
            gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
          }
          // gl_FragColor.xyz = vec3(1.0);
          if (yPercent * sentenceHeights[choice] < 90.0 || (1.0 - yPercent) * sentenceHeights[choice] < 90.0){
            gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
          }

          // // now in the center i want to have a text
          // vec2 center = vec2(0.5, 0.605);
          // // first we compute the expand of the text
          // // let's say i want the text to take 1/20th of the height
          // // we also need to randomize it
          // int largeChoice = int(floor(mod(time, 7.0)));
          // float y_large = 1.0 / numSentencesBig;
          // float x_large = sentenceWidths[largeChoice + 7] / sentenceHeights[largeChoice + 7] / numSentencesBig;
          // float xPercentLarge = (vUv.x - (center.x - x_large / 2.0)) / x_large;
          // float yPercentLarge = (vUv.y - (center.y - y_large / 2.0)) / y_large;

          // if ((vUv.x > center.x - x_large  / 2.0) && (vUv.x < center.x + x_large / 2.0) && (vUv.y > center.y - y_large / 2.0) && (vUv.y < center.y + y_large / 2.0)){
          //   float alpha = 0.0;
          //   if (largeChoice == 0){
          //     alpha = texture2D(centerHelloTexture0, vec2(xPercentLarge, yPercentLarge)).a;
          //   }else if (largeChoice == 1){
          //     alpha = texture2D(centerHelloTexture1, vec2(xPercentLarge, yPercentLarge)).a;
          //   }else if (largeChoice == 2){
          //     alpha = texture2D(centerHelloTexture2, vec2(xPercentLarge, yPercentLarge)).a;
          //   }else if (largeChoice == 3){
          //     alpha = texture2D(centerHelloTexture3, vec2(xPercentLarge, yPercentLarge)).a;
          //   }else if (largeChoice == 4){
          //     alpha = texture2D(centerHelloTexture4, vec2(xPercentLarge, yPercentLarge)).a;
          //   }else if (largeChoice == 5){
          //     alpha = texture2D(centerHelloTexture5, vec2(xPercentLarge, yPercentLarge)).a;
          //   }else if (largeChoice == 6){
          //     alpha = texture2D(centerHelloTexture6, vec2(xPercentLarge, yPercentLarge)).a;
          //   }


          //   // float alpha = texture2D(centerHelloTexture0, vec2(xPercentLarge, yPercentLarge)).a;
          //   gl_FragColor.a = mix(gl_FragColor.a, min(gl_FragColor.a, alpha), sqrt(scrollTopPercent) * 1.1);

          //   if ((xPercentLarge * sentenceWidths[largeChoice + 7] < 10.0 || (1.0 - xPercentLarge) * sentenceWidths[largeChoice + 7] < 10.0 || yPercentLarge * sentenceHeights[largeChoice + 7] < 10.0 || (1.0 - yPercentLarge) * sentenceHeights[largeChoice + 7] < 10.0)){
          //     // do nothing
          //     gl_FragColor = mix(gl_FragColor, vec4(0.0, 0.0, 0.0, 0.0), scrollTopPercent);
          //   }else if (alpha > 0.0){
          //     gl_FragColor = mix(gl_FragColor, vec4(0.0, 0.0, 0.0, alpha), scrollTopPercent * (1.0 / 0.75));
          //   }
          // }else{
          //   gl_FragColor.a = mix(gl_FragColor.a, 0., sqrt(scrollTopPercent) * 1.1);
          // }



        }
      }
    `;
  }
}

export default helloShader;
