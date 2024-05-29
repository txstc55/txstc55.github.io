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
      uniform float[7] sentenceWidths;
      uniform float[7] sentenceHeights;
      uniform float width;
      uniform float height;
      uniform float time;

      vec3 perpendicularDistance(float x, float y, float alpha, float beta){
        float xc = (x + alpha * y - alpha * beta) / (alpha * alpha + 1.0);
        float yc = alpha * xc + beta;
        return vec3(xc, yc, abs(alpha * x - y + beta) / sqrt(alpha * alpha + 1.0));
      }

      vec2 pointAboveLine(float x0, float a, float b, float distance) {
        float y0 = a * x0 + b;
        float sqrtTerm = sqrt(a * a + 1.0);

        // Calculate the perpendicular offsets
        float deltaX = (distance * a) / sqrtTerm;
        float deltaY = distance / sqrtTerm;

        // Point above the line
        float x1 = x0 - deltaX;
        float y1 = y0 + deltaY;
        vec2 pointAbove = vec2(x1, y1);
        return pointAbove;
      }

      varying vec2 vUv;
      float rand(vec2 co){
        return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
      }
      void main(){
        float numSentencesSmall = 50.0 * (1.0 - scrollTopPercent + 0.1);
        float numSentencesBig = 1.0;
        if (texture2D(cutoutImage, vUv).a > 0.0){
          // we first draw a sun
          const vec2 sunPos = vec2(0.3, 0.8);
          float sunRadius = 50.0;
          float sunDist = distance(vec2(vUv.x * width, vUv.y * height), vec2(sunPos.x * width, sunPos.y * height));
          // draw the sky color
          vec4 sunColor = vec4(245.0 / 255.0, 231.0 / 255.0, 102.0 / 255.0, 1.0);
          vec4 skyColor = vec4(250.0/255.0, 152.0/255.0, 200.0/255.0, 1.0);
          gl_FragColor = mix(sunColor, skyColor, min(1.0, sunDist / 100.0));

          // draw the sun
          if (sunDist < sunRadius){
            gl_FragColor = sunColor;
          }

          // draw sun rays
          float angle = atan(vUv.y - sunPos.y, vUv.x - sunPos.x) + floor(time * 1.3);
          if (mod(angle, 0.3) < 0.03 && sunDist < sunRadius * 6.0 && sunDist > sunRadius){
            gl_FragColor = mix(sunColor, skyColor, sunDist /((sunRadius) * 6.0));
          }

          float sinWave0 = sin(vUv.x * 13.0 + time * 2.0) + sin(vUv.x * 17.0 + time) + sin(vUv.x * 19.0 + time * 0.28) + sin(vUv.x * 23.0 + time * 0.5) + sin(vUv.x * 29.0 + time * 4.0);
          float sinWave1 = sin(vUv.x * 7.0 + time * 3.40) + sin(vUv.x * 11.0 + time * 1.3) + sin(vUv.x * 31.0 + time * 0.18) + sin(vUv.x * 17.0 + time * 0.67) + sin(vUv.x * 14.0 + time * 2.0);
          float sinWave2 = sin(vUv.x * 13.0 + time * 4.10) + sin(vUv.x * 17.0 + time * 2.3) + sin(vUv.x * 29.0 + time * 1.18) + sin(vUv.x * 4.0 + time * 0.37) + sin(vUv.x * 23.0 + time * 0.2);

          float sinWaveBoundary0 = sinWave0 / 90.0 + scrollTopPercent * 0.3 + 0.42;
          float sinWaveBoundary1 = sinWave1 / 95.0 + scrollTopPercent * 0.34 + 0.42;
          float sinWaveBoundary2 = sinWave2 / 93.0 + scrollTopPercent * 0.38 + 0.42;



          // we now draw a boat
          float x_middle = 0.5;
          float x_left = 0.49;
          float x_right = 0.52;
          float middleHeight = ((sin(x_middle * 13.0 + time * 2.0) + sin(x_middle * 17.0 + time) + sin(x_middle * 19.0 + time * 0.28) + sin(x_middle * 23.0 + time * 0.5) + sin(x_middle * 29.0 + time * 4.0)) / 90.0 + scrollTopPercent * 0.3 + 0.42) * height;
          float leftHeight = ((sin(x_left * 13.0 + time * 2.0) + sin(x_left * 17.0 + time) + sin(x_left * 19.0 + time * 0.28) + sin(x_left * 23.0 + time * 0.5) + sin(x_left * 29.0 + time * 4.0)) / 90.0 + scrollTopPercent * 0.3 + 0.42) * height;
          float rightHeight = ((sin(x_right * 13.0 + time * 2.0) + sin(x_right * 17.0 + time) + sin(x_right * 19.0 + time * 0.28) + sin(x_right * 23.0 + time * 0.5) + sin(x_right * 29.0 + time * 4.0)) / 90.0 + scrollTopPercent * 0.3 + 0.42) * height;

          // compute the line
          float alpha = (rightHeight - leftHeight) / (x_right * width - x_left * width);
          alpha = alpha / 1.5;
          if (alpha > 0.0){
            if (alpha < 1.0){
              alpha = pow(alpha, 2.);
            }else{
              alpha = pow(alpha, 0.3);
            }
          }else{
            if (alpha > -1.0){
              alpha = -pow(alpha, 2.);
            } else {
              alpha = -pow(-alpha, 0.3);
            }
          }
          float beta = middleHeight - alpha * x_middle * width;


          vec3 pDistance = perpendicularDistance(vUv.x * width, vUv.y * height + 10.0, alpha, beta);
          float lengthOnLine = length(pDistance.xy - vec2(x_middle * width, middleHeight));
          float bottomLength = 0.12 * width;
          float topLength = 0.18 * width;
          // gl_FragColor = vec4(lengthOnLine * 10.0, lengthOnLine * 10.0, lengthOnLine * 10.0, 1.0);

          // the boat body
          if (pDistance.z > 0.0 && pDistance.z < 130.0 && (vUv.y * height + 10.0) > pDistance.y && lengthOnLine < mix(bottomLength, topLength, pDistance.z / (130.0))){
            gl_FragColor = vec4(255.0 / 255.0, 159.0 / 255.0, 28.0 / 255.0, 1.0);
          }

          // draw the pillar
          if (pDistance.z >= 130.0 && pDistance.z <= 360.0 && (vUv.y * height + 10.0) > pDistance.y && lengthOnLine <= 20.0){
            gl_FragColor = vec4(255.0 / 255.0, 193.0 / 255.0, 94.0 / 255.0, 1.0);
          }

          // draw the sign
          vec2 centerPoint = pointAboveLine(x_middle * width, alpha, beta, 350.0);
          float toCenterDistance = length(vec2(vUv.x * width, vUv.y * height) - centerPoint);
          float spiralTurns = 1.0;
          float b = 30.0;
          if (toCenterDistance < 150.0){
            gl_FragColor = vec4(255.0 / 255.0, 24.0 / 255.0, 78.0 / 255.0, 1.0);
            float theta = (atan(vUv.y * height - centerPoint.y, vUv.x * width - centerPoint.x) + 3.1415926) / (2.0 * 3.1415926) + time / 14.0;
            float r = toCenterDistance;

            // we will implement a Archimedean spiral
            float y_percent = mod(r - b * theta, b) / b;
            float x_percent = 1.0 - mod((theta * 2.0), 1.0);

            vec4 textureColor = texture2D(helloTexture0, vec2(x_percent, y_percent));
            gl_FragColor = mix(gl_FragColor, textureColor, textureColor.a * pow(r / 150.0, 2.0));
          }

          // draw the sea
          if (vUv.y < sinWaveBoundary0){
            gl_FragColor = mix(vec4(100.0 / 255.0, 185.0 / 255.0, 225.0 / 255.0, 1.0), vec4(0.0, 0.0, 0.0, 1.0), scrollTopPercent * 1.4);
          }
          if (vUv.y < sinWaveBoundary1){
            gl_FragColor = mix(vec4(90.0 / 255.0, 215.0 / 255.0, 195.0 / 255.0, 1.0), vec4(0.0, 0.0, 0.0, 1.0), scrollTopPercent * 1.4);
          }
          if (vUv.y < sinWaveBoundary2){
            gl_FragColor = mix(vec4(80.0 / 255.0, 235.0 / 255.0, 225.0 / 255.0, 1.0), vec4(0.0, 0.0, 0.0, 1.0), scrollTopPercent * 1.4);
          }

        }
      }
    `;
  }
}

export default helloShader;
