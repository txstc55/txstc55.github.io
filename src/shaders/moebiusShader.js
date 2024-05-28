class moebiusShader {
  constructor() {
    this.vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    this.fragmentShader = `
      varying vec2 vUv;
      uniform sampler2D coverImage;
      uniform float width;
      uniform float height;
      uniform float timerRandoms[32];
      uniform float u_hueAdjust;
      uniform float u_saturationAdjust;
      uniform float u_brightnessAdjust;

      // Converts an RGB color to HSB
      vec3 rgbToHsb(vec3 color) {
          float r = color.r;
          float g = color.g;
          float b = color.b;

          float max = max(r, max(g, b));
          float min = min(r, min(g, b));
          float h, s, v = max;

          float d = max - min;
          s = max == 0.0 ? 0.0 : d / max;

          if (max == min) {
              h = 0.0; // achromatic
          } else {
              if (max == r) {
                  h = (g - b) / d + (g < b ? 6.0 : 0.0);
              } else if (max == g) {
                  h = (b - r) / d + 2.0;
              } else if (max == b) {
                  h = (r - g) / d + 4.0;
              }
              h /= 6.0;
          }
          return vec3(h, s, v);
      }

      // Converts an HSB color to RGB
      vec3 hsbToRgb(vec3 color) {
          float h = color.x;
          float s = color.y;
          float v = color.z;

          int i = int(h * 6.0);
          float f = h * 6.0 - float(i);
          float p = v * (1.0 - s);
          float q = v * (1.0 - f * s);
          float t = v * (1.0 - (1.0 - f) * s);

          vec3 rgb;

          if (i == 0) {
              rgb = vec3(v, t, p);
          } else if (i == 1) {
              rgb = vec3(q, v, p);
          } else if (i == 2) {
              rgb = vec3(p, v, t);
          } else if (i == 3) {
              rgb = vec3(p, q, v);
          } else if (i == 4) {
              rgb = vec3(t, p, v);
          } else {
              rgb = vec3(v, p, q);
          }

          return rgb;
      }

      // random function
      float rand(vec2 co){
          return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
      }


      float randDispl(float xCoord, float yCoord, float resolutionX, float resolutionY, float factor, vec4 randVariables){
          float randNum = rand(vec2(xCoord, yCoord));
          float disp = ((1.0 + randNum) * (sin(yCoord*resolutionY / randVariables.x)) * factor + (1.0 + randNum) * (sin(yCoord*resolutionY / randVariables.y)) * factor  + (1.0 + randNum) * (sin(yCoord*resolutionY / randVariables.z)) * factor  + (1.0 + randNum) * (sin(yCoord*resolutionY / randVariables.w)) * factor) / 4.0;
          return disp;
      }

      float valueAtPoint(sampler2D image, vec2 coord, vec2 texel, vec2 point) {
          vec3 luma = vec3(0.299, 0.587, 0.114);
          // here we have a rand so we have the pencil line effect
          // 2.0*rand(coord)*
          vec4 color = texture2D(image, coord + texel * point);
          return dot(color.xyz, luma) * color.z;
      }
      float getValue(float x, float y) {
          return valueAtPoint(coverImage, vUv, vec2(0.01 / width, 0.01 / height), vec2(x, y));
      }

      float combinedSobelValue() {
          // kernel definition (in glsl matrices are filled in column-major order)
          const mat3 Gx = mat3(-1, -2, -1, 0, 0, 0, 1, 2, 1);// x direction kernel
          const mat3 Gy = mat3(-1, 0, 1, -2, 0, 2, -1, 0, 1);// y direction kernel

          // fetch the 3x3 neighbourhood of a fragment

          // first column
          float xDisp = randDispl(vUv.x, vUv.y, width, height, 5.0, vec4(22.0, 13.0, 37.0, 89.0));
          float yDisp = randDispl(vUv.y, vUv.x, height, width, 5.0, vec4(13.0, 11.0, 37.0, 89.0));

          float tx0y0 = getValue(-1.0, -1.0);
          float tx0y1 = getValue(-1.0, 0.0);
          float tx0y2 = getValue(-1.0, 1.0);

          // second column
          float tx1y0 = getValue(0.0, -1.0);
          float tx1y1 = getValue(0.0, 0.0);
          float tx1y2 = getValue(0.0, 1.0);

          // third column
          float tx2y0 = getValue(1.0, -1.0);
          float tx2y1 = getValue(1.0, 0.0);
          float tx2y2 = getValue(1.0, 1.0);

          // gradient value in x direction
          float valueGx = Gx[0][0] * tx0y0 + Gx[1][0] * tx1y0 + Gx[2][0] * tx2y0 +
          Gx[0][1] * tx0y1 + Gx[1][1] * tx1y1 + Gx[2][1] * tx2y1 +
          Gx[0][2] * tx0y2 + Gx[1][2] * tx1y2 + Gx[2][2] * tx2y2;

          // gradient value in y direction
          float valueGy = Gy[0][0] * tx0y0 + Gy[1][0] * tx1y0 + Gy[2][0] * tx2y0 +
          Gy[0][1] * tx0y1 + Gy[1][1] * tx1y1 + Gy[2][1] * tx2y1 +
          Gy[0][2] * tx0y2 + Gy[1][2] * tx1y2 + Gy[2][2] * tx2y2;

          // magnitude of the total gradient
          float G = (valueGx * valueGx) + (valueGy * valueGy);
          return clamp(G, 0.0, 1.0);
      }
      float luma(vec4 color){
          return 0.2126*color.x + 0.7152*color.y + 0.0722*color.z;
      }
      vec3 czm_saturation(vec3 rgb, float adjustment)
      {
          // Algorithm from Chapter 16 of OpenGL Shading Language
          const vec3 W = vec3(0.2125, 0.7154, 0.0721);
          vec3 intensity = vec3(dot(rgb, W));
          return mix(intensity, rgb, adjustment);
      }

      void main() {
        float sobelValue = combinedSobelValue();
        sobelValue = smoothstep(0.01, 0.03, sobelValue);
        vec4 lineColor = vec4(0.0, 0.0, 0.0, 1.0);
        vec4 coverImageColor = texture2D(coverImage, vUv);


        if (sobelValue > 0. && coverImageColor.w > 0.0 && luma(coverImageColor) < 0.3) {
            gl_FragColor = lineColor;
        }else{
          // // distort a bit
          float xDisps[5] = float[](randDispl(vUv.x, vUv.y, width, height, 0.05 / width, vec4(22.0, 13.0, 37.0, 89.0)), randDispl(vUv.x, vUv.y, width, height, 0.05 / width, vec4(timerRandoms[0], timerRandoms[1], timerRandoms[2], timerRandoms[3])), randDispl(vUv.x, vUv.y, width, height, 0.05 / width, vec4(timerRandoms[4], timerRandoms[5], timerRandoms[6], timerRandoms[7])), randDispl(vUv.x, vUv.y, width, height, 0.05 / width, vec4(timerRandoms[8], timerRandoms[9], timerRandoms[10], timerRandoms[11])), randDispl(vUv.x, vUv.y, width, height, 0.05 / width, vec4(timerRandoms[12], timerRandoms[13], timerRandoms[14], timerRandoms[15])));

          float yDisps[5] = float[](randDispl(vUv.y, vUv.x, height, width, 0.05 / height, vec4(22.0, 13.0, 37.0, 89.0)), randDispl(vUv.y, vUv.x, height, width, 0.05 / height, vec4(timerRandoms[16], timerRandoms[17], timerRandoms[18], timerRandoms[19])), randDispl(vUv.y, vUv.x, height, width, 0.05 / height, vec4(timerRandoms[20], timerRandoms[21], timerRandoms[22], timerRandoms[23])), randDispl(vUv.y, vUv.x, height, width, 0.05 / height, vec4(timerRandoms[24], timerRandoms[25], timerRandoms[26], timerRandoms[7])), randDispl(vUv.y, vUv.x, height, width, 0.05 / height, vec4(timerRandoms[28], timerRandoms[29], timerRandoms[30], timerRandoms[31])));


          // Convert RGB to HSB
          vec3 hsb = rgbToHsb(coverImageColor.rgb);
          // Adjust the HSB values
          hsb.x = clamp(hsb.x + u_hueAdjust, 0.0, 1.0);
          hsb.y = clamp(hsb.y + u_saturationAdjust, 0.0, 1.0);
          hsb.z = clamp(hsb.z + u_brightnessAdjust, 0.0, 1.0);
          vec3 adjustedRgb = hsbToRgb(hsb);
          float pixelLuma = luma(vec4(adjustedRgb, coverImageColor.w));
          gl_FragColor =  vec4(czm_saturation(adjustedRgb.xyz, 1.0), coverImageColor.w);
          if (coverImageColor.w < 0.8){
            return;
          }
          if (pixelLuma <= 0.1){
            float stripe = mod((vUv.y * height * 100.0 + vUv.x * width * 100.0) / 23.0, 4.0);
            if (stripe <= 1.0){
              vec2 vUvStripe = vUv + vec2(xDisps[1], yDisps[1]);
              if (mod(vUvStripe.x * width * 100.0, 23.0) <= 1.8){
                gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
              }
            }else if (stripe <= 2.0){
              vec2 vUvStripe = vUv + vec2(xDisps[2], yDisps[2]);
              if (mod(vUvStripe.x * width * 100.0, 23.0) <= 1.3){
                  gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
              }
            }
            else if (stripe <= 3.0){
              vec2 vUvStripe = vUv + vec2(xDisps[2], yDisps[2]);
              if (mod(vUvStripe.x * width * 100.0, 23.0) <= 1.4){
                  gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
              }
            }
            else if (stripe <= 4.0){
              vec2 vUvStripe = vUv + vec2(xDisps[3], yDisps[3]);
              if (mod(vUvStripe.x * width * 100.0, 23.0) <= 1.6){
                  gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
              }
            }
          }
          if (pixelLuma <= 0.2){
              float stripe = mod((vUv.y * height + vUv.x * width) / 23.0, 4.0);
              if (stripe <= 1.0){
                  vec2 vUvStripe = vUv + vec2(xDisps[1], yDisps[1]);
                  if (mod(vUvStripe.y * height * 100.0, 23.0) <=1.5){
                      gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
                  }
              }else if (stripe <= 2.0){
                  vec2 vUvStripe = vUv + vec2(xDisps[2], yDisps[2]);
                  if (mod(vUvStripe.y * height * 100.0, 23.0) <=1.5){
                      gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
                  }
              }
              else if (stripe <= 3.0){
                  vec2 vUvStripe = vUv + vec2(xDisps[2], yDisps[2]);
                  if (mod(vUvStripe.y * height * 100.0, 23.0) <=1.5){
                      gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
                  }
              }
              else if (stripe <= 4.0){
                  vec2 vUvStripe = vUv + vec2(xDisps[3], yDisps[3]);
                  if (mod(vUvStripe.y * height * 100.0, 23.0) <=1.5){
                      gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
                  }
              }
          }
          if (pixelLuma <= 0.3){
              float stripe = mod((-vUv.y * height * 100.0+ vUv.x * width * 100.0) / (23.0 + 5.0 * sin(-vUv.y * height + vUv.x * width)), 4.0);
              if (stripe <= 1.0){
                  vec2 vUvStripe = vUv + vec2(xDisps[1], yDisps[1]);
                  if (mod(-vUvStripe.y * height * 100.0 + vUvStripe.x * width * 100.0, 23.0) <=1.5){
                      gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
                  }
              }else if (stripe <= 2.0){
                  vec2 vUvStripe = vUv + vec2(xDisps[2], yDisps[2]);
                  if (mod(-vUvStripe.y * height * 100.0 + vUvStripe.x * width * 100.0, 23.0) <=1.5){
                      gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
                  }
              }
              else if (stripe <= 3.0){
                  vec2 vUvStripe = vUv + vec2(xDisps[2], yDisps[2]);
                  if (mod(-vUvStripe.y * height * 100.0 + vUvStripe.x * width * 100.0, 23.0) <=1.5){
                      gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
                  }
              }
              else if (stripe <= 4.0){
                  vec2 vUvStripe = vUv + vec2(xDisps[3], yDisps[3]);
                  if (mod(-vUvStripe.y * height * 100.0 + vUvStripe.x * width * 100.0, 23.0) <=1.5){
                      gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
                  }
              }
          }
          if (pixelLuma <= 0.35){
              float stripe = mod((vUv.y * height + vUv.x * width) / (23.0 + 5.0 * sin(vUv.y * height + vUv.x * width)), 4.0);
              if (stripe <= 1.0){
                  vec2 vUvStripe = vUv + vec2(xDisps[1], yDisps[1]);
                  if (mod(vUvStripe.y * height * 100.0 + vUvStripe.x * width * 100.0, 23.0) <=1.5){
                      gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
                  }
              }else if (stripe <= 2.0){
                  vec2 vUvStripe = vUv + vec2(xDisps[2], yDisps[2]);
                  if (mod(vUvStripe.y * height * 100.0 + vUvStripe.x * width * 100.0, 23.0) <=1.5){
                      gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
                  }
              }
              else if (stripe <= 3.0){
                  vec2 vUvStripe = vUv + vec2(xDisps[2], yDisps[2]);
                  if (mod(vUvStripe.y * height * 100.0 + vUvStripe.x * width * 100.0, 23.0) <=1.5){
                      gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
                  }
              }
              else if (stripe <= 4.0){
                  vec2 vUvStripe = vUv + vec2(xDisps[3], yDisps[3]);
                  if (mod(vUvStripe.y * height * 100.0 + vUvStripe.x * width * 100.0, 23.0) <=1.){
                      gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
                  }
              }
          }
        }
      }
    `;
  }
}

export default moebiusShader;
