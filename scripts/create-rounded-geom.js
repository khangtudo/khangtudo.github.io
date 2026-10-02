// Native Rounded Card Mesh Creator for Three.js (ISO/IEC 7810 ID-1 standard with r=0.024)
function createRoundedCardGeometry(width, height, radius, depth) {
  const shape = new THREE.Shape();
  const x = -width / 2;
  const y = -height / 2;
  const w = width;
  const h = height;
  const r = Math.min(radius, Math.min(w, h) / 2);

  shape.moveTo(x + r, y);
  shape.lineTo(x + w - r, y);
  shape.quadraticCurveTo(x + w, y, x + w, y + r);
  shape.lineTo(x + w, y + h - r);
  shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  shape.lineTo(x + r, y + h);
  shape.quadraticCurveTo(x, y + h, x, y + h - r);
  shape.lineTo(x, y + r);
  shape.quadraticCurveTo(x, y, x + r, y);

  const geom = new THREE.ExtrudeGeometry(shape, {
    depth: depth,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 0.0008,
    bevelThickness: 0.0006,
    curveSegments: 16
  });

  geom.center();
  return geom;
}
