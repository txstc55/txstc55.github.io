class helloShader {
  constructor() {
    this.vertexShader = `
      varying vec2 vUv;
      void main() {
      // Transform the vertex position to clip space
          vUv = uv;
          // Set the final position
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;
    this.fragmentShader = `
      uniform float scrollTopPercent;
      uniform sampler2D cutoutImage;
      uniform sampler2D coverImage;
      uniform float width;
      uniform float height;
      uniform float time;
      varying vec2 vUv;
      uniform float mouse_x_percent;
      uniform float mouse_y_percent;
      uniform float maxZ;
      uniform float minZ;
      uniform float maxY;
      uniform float maxHeightOrWidth;
      uniform float scaleUp;


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
      float rand(vec2 co){
        return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
      }

      float wave0(float x){
        return sin(x * 13.0 + time * 2.0) + sin(x * 17.0 + time) + sin(x * 19.0 + time * 0.28) + sin(x * 23.0 + time * 0.5) + sin(x * 29.0 + time * 4.0);
      }

      float wave1(float x){
        return sin(x * 7.0 + time * 3.40) + sin(x * 11.0 + time * 1.3) + sin(x * 31.0 + time * 0.18) + sin(x * 17.0 + time * 0.67) + sin(x * 14.0 + time * 2.0);
      }

      float wave2(float x){
        return sin(x * 13.0 + time * 4.10) + sin(x * 17.0 + time * 2.3) + sin(x * 29.0 + time * 1.18) + sin(x * 4.0 + time * 0.37) + sin(x * 23.0 + time * 0.2);
      }

      void main(){
        // add transition to the boat and everything
        float floatFactor = (sin(time / 2.0) + sin (time * 0.71) + sin(time * 3.0) + sin(time * 1.31) + sin(time * 0.13)) / 28.0 + mouse_x_percent / 3.5;
        // floatFactor = 0.0;
        float x_middle = 0.5 + floatFactor * (1.0 - scrollTopPercent);
        float x_left = 0.49 + floatFactor * (1.0 - scrollTopPercent);
        float x_right = 0.52 + floatFactor * (1.0 - scrollTopPercent);
        float alpha = 1.0;
        float beta = 0.0;
        vec2 vUvNew = vUv;
        float sideScale = floor(scaleUp / 2.0);
        vUvNew.x = (vUv.x - (1.0 / scaleUp) * sideScale) * scaleUp;
        vUvNew.y = (vUv.y - (1.0 / scaleUp) * sideScale) * scaleUp;

        // for computing the waves
        float sinWave0 = wave0(vUvNew.x);
        float sinWave1 = wave1(vUvNew.x);
        float sinWave2 = wave2(vUvNew.x);
        float sinWaveBoundary0 = sinWave0 / 90.0 + scrollTopPercent * 0.3 + 0.42;
        float sinWaveBoundary1 = sinWave1 / 95.0 + scrollTopPercent * 0.34 + 0.42;
        float sinWaveBoundary2 = sinWave2 / 93.0 + scrollTopPercent * 0.38 + 0.42;

        float middleHeight = ((wave1(x_middle) + wave0(x_middle) + wave2(x_middle)) / 270.0 + scrollTopPercent * 0.3 + 0.42) * height;
        float leftHeight = (wave1(x_left) / 90.0 + scrollTopPercent * 0.3 + 0.42) * height;
        float rightHeight = (wave1(x_right) / 90.0 + scrollTopPercent * 0.3 + 0.42) * height;

        // compute the line
        alpha = (rightHeight - leftHeight) / (x_right * width - x_left * width);
        alpha = alpha / 1.9;
        if (alpha > 0.0){
          if (alpha < 1.0){
            alpha = pow(alpha, 2.);
          }else{
            alpha = pow(alpha, 0.5);
          }
        }else{
          if (alpha > -1.0){
            alpha = -pow(alpha, 2.);
          } else {
            alpha = -pow(-alpha, 0.5);
          }
        }
        beta = middleHeight - alpha * x_middle * width;

        if (texture2D(cutoutImage, vUvNew).a > 0.0){
          // we first draw a sun
          const vec2 sunPos = vec2(0.3, 0.8);
          float sunRadius = 50.0;
          float sunDist = distance(vec2(vUvNew.x * width, vUvNew.y * height), vec2(sunPos.x * width, sunPos.y * height));
          // draw the sky color
          vec4 sunColor = vec4(245.0 / 255.0, 231.0 / 255.0, 202.0 / 255.0, 1.0);
          vec4 skyColor = vec4(250.0/255.0, 152.0/255.0, 200.0/255.0, 1.0);
          gl_FragColor = mix(sunColor, skyColor, min(1.0, sunDist / 100.0));

          // draw the sun
          if (sunDist < sunRadius){
            if (rand(vec2(fract(vUvNew.x) * 13.9 + floor(time * 4.0), vUvNew.y)) > 0.1){
              gl_FragColor = sunColor;
            }
          }

          // draw sun rays
          float angle = atan(vUvNew.y - sunPos.y, vUvNew.x - sunPos.x) + floor(time * 1.3);
          if (mod(angle, 0.3) < 0.03 && sunDist < sunRadius * 5.0 && sunDist > sunRadius){
            if (rand(vec2(fract(vUvNew.x) * 13.9 + floor(time * 3.0), vUvNew.y)) > 0.1){
              gl_FragColor = mix(sunColor, skyColor, sunDist /((sunRadius) * 5.0));
            }
          }





          // we now draw a boat

          float bottomOffset = 20.0;
          vec3 pDistance = perpendicularDistance(vUvNew.x * width, vUvNew.y * height + bottomOffset, alpha, beta);
          float lengthOnLine = length(pDistance.xy - vec2(x_middle * width, middleHeight));
          float bottomLength = 0.12 * width;
          float topLength = 0.18 * width;
          // gl_FragColor = vec4(lengthOnLine * 10.0, lengthOnLine * 10.0, lengthOnLine * 10.0, 1.0);

          // the boat body
          if (pDistance.z > 0.0 && pDistance.z < 130.0 + rand(vec2(vUvNew.y, vUvNew.x)) * 6.0 && (vUvNew.y * height + 10.0) > pDistance.y && lengthOnLine < mix(bottomLength, topLength, pDistance.z / (130.0)) + rand(vUvNew + floor(time * 10.0)) * 6.0){
            if (rand(vec2(vUvNew.x * height, vUvNew.y * width+  floor(time * 17.0))) > 0.05){
              gl_FragColor = vec4(255.0 / 255.0, 159.0 / 255.0, 28.0 / 255.0, 1.0);
            }
            if (pDistance.z - 8.0 < rand(vec2(vUvNew.y + time, vUvNew.x)) * 6.0 || pDistance.z > 130.0 || (lengthOnLine + 4.0) > mix(bottomLength, topLength, pDistance.z / (130.0)) + rand(vUvNew + floor(time * 10.0)) * 4.0){
              gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
            }
          }

          // draw the pillar
          if (pDistance.z >= 128.0 + rand(vec2(vUvNew.y, vUvNew.x)) * 10.0 && pDistance.z <= 360.0 && (vUvNew.y * height + 10.0) > pDistance.y && lengthOnLine <= 16.0 + rand(vUvNew + floor(time * 10.0)) * 6.0){
            if (rand(vec2(vUvNew.x * height + floor(time * 13.0), vUvNew.y * width)) > 0.05){
              gl_FragColor = vec4(255.0 / 255.0, 193.0 / 255.0, 104.0 / 255.0, 1.0);
            }
            if (lengthOnLine >= 16.0){
              gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
            }
          }

          // draw the sea
          if (vUvNew.y < sinWaveBoundary0){
            gl_FragColor = mix(vec4(100.0 / 255.0, 185.0 / 255.0, 225.0 / 255.0, 1.0), vec4(0.0, 0.0, 0.0, 1.0), scrollTopPercent * 1.4);
          }
          if (vUvNew.y < sinWaveBoundary1){
            gl_FragColor = mix(vec4(30.0 / 255.0, 215.0 / 255.0, 195.0 / 255.0, 1.0), vec4(0.0, 0.0, 0.0, 1.0), scrollTopPercent * 1.4);
          }
          if (vUvNew.y < sinWaveBoundary2){
            gl_FragColor = mix(vec4(80.0 / 255.0, 235.0 / 255.0, 225.0 / 255.0, 1.0), vec4(0.0, 0.0, 0.0, 1.0), scrollTopPercent * 1.4);
          }

        }


        if (texture2D(cutoutImage, vUvNew).a > 0.0 || texture2D(cutoutImage, vUvNew).a < 1.0 || vUvNew.y <= 0.0 || vUvNew.y >= 1.0 || vUvNew.x <= 0.0 || vUvNew.x >= 1.0){
          // add glitch effect for out of bound content
          if (texture2D(cutoutImage, vUvNew).a == 0.0){
            if (mod(time, 1.5) < 0.3){
              float originalX = vUvNew.x;
              float modX = mod(originalX, 0.04 * (sin(floor(time * 7.0)) + 1.0) / 2.0);
              if (modX < (0.04 / 2.0)){
                vUvNew.x = originalX + (0.04) - modX;
              }else{
                vUvNew.x = originalX - modX;
              }


              float originalY = vUvNew.y;
              float modYFactor = 0.03 * (sin(floor(time * 13.0)) + 1.0) / 2.0;
              float modY = mod(originalY, modYFactor);
              if (modY < (modYFactor / 2.0)){
                vUvNew.y = originalY + (modYFactor / 2.0) - modY;
              }else{
                vUvNew.y = originalY - (modYFactor / 2.0);
              }
            }
          }

          // draw the sign
          vec2 centerPoint = pointAboveLine(x_middle * width, alpha, beta, 350.0);
          float toCenterDistance = length(vec2(vUvNew.x * width, vUvNew.y * height) - centerPoint);


          vec2 pupilCenter = centerPoint;
          // we now need to compute y displacement
          float cameraZ = maxZ - (maxZ - minZ) * scrollTopPercent;
          float cameraY = maxY * scrollTopPercent;
          float plane_intersection_height = cameraZ / maxZ * maxHeightOrWidth;

          // the absolute y position in the world first
          float centerY = -maxHeightOrWidth / 2.0 + maxHeightOrWidth * centerPoint.y / height;
          // the i guess uv coordinate of our center point
          float planePositionY = (centerY - cameraY) / (plane_intersection_height / 2.0);


          float[22] displacementX;
          float[22] displacementY;
          for (int i = 0; i < 22; i++){
            displacementX[i] = 24.0 * (2.0 * rand(vec2(10.0, float(i) + floor(time * 1.7))) - 1.0) + mouse_x_percent * 80.0;
            displacementY[i] = 18.0 * (2.0 * rand(vec2(9.0 + floor(time * 13.0), float(i + 12))) - 1.0) + (mouse_y_percent - planePositionY) * 40.0 - 10.0;
          }
          float radius = texture2D(cutoutImage, vUvNew).a > 0.0 ? 140.0 : 130.0;
          if (toCenterDistance < radius){
            gl_FragColor = vec4(255.0 / 255.0, 24.0 / 255.0, 78.0 / 255.0, 1.0);

            // here we will determine two ellipse
            // for the eye
            float timeFactor = sqrt(sin(time * 2.0) * 0.5 + 0.5);
            float closeFactor = 0.2; // where at sin wave (0 to 1 output) do we close eyes
            float closeStops = 3.0; // how many frames for eye to close
            timeFactor = timeFactor > closeFactor ? 1.0 : max(floor(closeStops * pow(timeFactor / closeFactor, 0.5)) / closeStops, 0.02);
            float a0 = radius - 2.0;
            float b0 = (radius / 1.5 + 5.0) * timeFactor;
            float a1 = radius - 2.0;
            float b1 = (radius / 2.5) * timeFactor;
            // float b0 = ((cos(time) + 1.0) / 2.0) * (radius / 2.0 + 5.0);
            float val0 = pow(vUvNew.x * width - centerPoint.x, 2.) / pow(a0, 2.) + pow(vUvNew.y * height - centerPoint.y + 20.0 * timeFactor, 2.) / pow(b0, 2.);
            float val1 = pow(vUvNew.x * width - centerPoint.x, 2.) / pow(a1, 2.) + pow(vUvNew.y * height - centerPoint.y - 11.0 * timeFactor, 2.) / pow(b1, 2.);
            if ((vUvNew.y * height >= centerPoint.y && val0 < 1.0) || (vUvNew.y * height < centerPoint.y && val1 < 1.0)){
              gl_FragColor = vec4(255.0 / 255.0, 255.0 / 255.0, 255.0 / 255.0, 1.0);

              // draw the pupil
              for (int i = 0; i < 22; i++){
                pupilCenter = centerPoint + vec2(displacementX[i], displacementY[i] + 15.0);
                float pupilRadius = 55.0 + rand(vUvNew) * 5.0;
                float distanceToPupil = length(vec2(vUvNew.x * width, vUvNew.y * height) - pupilCenter);
                if (distanceToPupil < pupilRadius && distanceToPupil > 52.0 + rand(vec2(vUvNew.y, vUvNew.x) * 4.0)){
                  gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
                }
              }

              // draw the eye lines
              if (vUvNew.y * height >= centerPoint.y && val0 > 0.85 + rand(vUvNew) * 0.15){
                gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
              }
              if (vUvNew.y * height < centerPoint.y && val1 > 0.85 + rand(vUvNew) * 0.15){
                gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
              }
            }
          }

          if (toCenterDistance > radius - rand(vec2(vUvNew.x * width, vUvNew.y * height)) * 5.0 && toCenterDistance < radius + 2.0 * rand(vec2(vUvNew.x + time, vUvNew.y * vUvNew.x))){
            gl_FragColor = vec4(.0, .0, .0, 1.0);
          }
        }
      }
    `;
  }
}

export default helloShader;
