import { Text } from "troika-three-text";
import curve_points from "@/assets/points.json";
// let's just define the curve here
const points = curve_points.xyz.map(
  (point) => new THREE.Vector3(point[0], point[1], point[2]),
);
var curve = new THREE.CatmullRomCurve3(points);
// curve.curveType = "chordal";
curve.closed = true;

const greetings = [
  "HELLO", // English
  "HOLA", // Spanish
  "BONJOUR", // French
  "HALLO", // German
  "CIAO", // Italian
  "ПРИВЕТ", // Russian (PRIVET)
  "你好", // Chinese (Mandarin) (NǏ HǍO)
  "こんにちは", // Japanese (KONNICHIWA)
  "안녕하세요", // Korean (ANNYEONGHASEYO)
];
// shuffle and join the greetings
// let text_sentence = (
//   greetings.sort(() => Math.random() - 0.5).join("----") + "----"
// ).repeat(5);

let text_sentence = "-".repeat(1200);
var curve_texts = [];
for (let i = 0; i < text_sentence.length; i++) {
  const curve_text = new Text();
  curve_text.text = text_sentence[i];
  // curve_text.text = "-";
  curve_text.fontSize = 0.22;
  curve_text.color = 0xffffff;
  curve_text.anchorX = "center";
  curve_text.anchorY = "middle";
  curve_text.font = "asap.ttf";
  if (i == 0){
    curve_text.color = 0x000000;
  }
  if (i > 28 * 12){
    curve_text.strokeWidth = 0.001;
    curve_text.strokeOpacity = 1.0;
    curve_text.strokeColor = 0x000000;
  }
  // curve_text.strokeWidth = 0.001;
  // curve_text.strokeOpacity = 1.0;
  // curve_text.strokeColor = 0x000000;
  curve_text.fillOpacity = 1.0;
  curve_texts.push(curve_text);
  // diable double side rendering
  // curve_texts[i].material.side = THREE.FrontSide;
}

<!-- // add spherical text
for (let i = 0; i < curve_texts.length; i++) {
  scene.add(curve_texts[i]);
} -->


// move curve text
// Update progress
me.curve_progress += me.curve_speed;
if (me.curve_progress > 1) {
  me.curve_progress = 0; // Loop the animation
}

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
    -(
      60000 *
      (crossProduct123.length() +
        crossProduct241.length() +
        crossProduct315.length())
    ) /
      3.0 +
    1.0;
  area = Math.sqrt(Math.max(area, 0.16));
  const scaling = 1 - me.scrollTopPercent;
  let p2Copy = P2.clone();
  p2Copy.x *= 1.2 * scaling;
  p2Copy.y *= 1.2 * scaling;
  p2Copy.y += 1 + me.scrollTopPercent * 1.66666; // y final is 2.25
  p2Copy.z *= 1.2 * scaling;
  p2Copy.z += 10.0 - me.scrollTopPercent * 12.633333; // camera ending positon is 1.25

  // Set the rotation of the square based on the matrix
  curve_texts[i].setRotationFromMatrix(matrix);
  curve_texts[i].position.copy(p2Copy);
  curve_texts[i].scale.set(
    area * scaling * (P2.z * 0.25 + 0.75),
    area * scaling * (P2.z * 0.25 + 0.75),
    area * scaling * (P2.z * 0.25 + 0.75),
  );
}
// console.log(me.camera.position.z, me.scrollTopPercent);


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
  const rotatedPoints = points.map((point) =>
    point.clone().applyMatrix4(rotation_matrix),
  );

  // Create a new curve with the rotated points
  curve = new THREE.CatmullRomCurve3(rotatedPoints);
  curve.closed = true;
},
