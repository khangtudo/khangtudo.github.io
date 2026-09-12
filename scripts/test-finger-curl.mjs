import fs from 'node:fs';

// Let's test the 4-finger curl detection algorithm
function dist(p1, p2) {
  return Math.hypot(p1.x - p2.x, p1.y - p2.y, (p1.z || 0) - (p2.z || 0));
}

// Generate an open hand
const openHand = [];
for (let i = 0; i <= 20; i++) openHand.push({ x: 0.5, y: 0.5, z: 0 });
openHand[0] = { x: 0.5, y: 0.8, z: 0 }; // wrist at bottom

// Extended fingers: tips further from wrist than PIPs
// Index
openHand[5] = { x: 0.45, y: 0.55, z: 0 };
openHand[6] = { x: 0.44, y: 0.45, z: 0 };
openHand[8] = { x: 0.43, y: 0.25, z: 0 }; // tip 8 far
// Middle
openHand[9] = { x: 0.5, y: 0.53, z: 0 };
openHand[10] = { x: 0.5, y: 0.43, z: 0 };
openHand[12] = { x: 0.5, y: 0.22, z: 0 }; // tip 12 far
// Ring
openHand[13] = { x: 0.55, y: 0.55, z: 0 };
openHand[14] = { x: 0.56, y: 0.45, z: 0 };
openHand[16] = { x: 0.57, y: 0.26, z: 0 }; // tip 16 far
// Pinky
openHand[17] = { x: 0.6, y: 0.58, z: 0 };
openHand[18] = { x: 0.61, y: 0.5, z: 0 };
openHand[20] = { x: 0.62, y: 0.35, z: 0 }; // tip 20 far

// Generate a curled hand (fist / 4 fingers curled)
const curledHand = JSON.parse(JSON.stringify(openHand));
// Curled tips are curled in towards palm / closer to wrist than PIPs
curledHand[8] = { x: 0.45, y: 0.58, z: 0 }; // closer to wrist than pip (0.45)
curledHand[12] = { x: 0.5, y: 0.57, z: 0 }; // closer
curledHand[16] = { x: 0.55, y: 0.58, z: 0 }; // closer
curledHand[20] = { x: 0.6, y: 0.6, z: 0 }; // closer

function checkFingers(lm) {
  const fingers = [
    { name: 'Index', tip: 8, pip: 6 },
    { name: 'Middle', tip: 12, pip: 10 },
    { name: 'Ring', tip: 16, pip: 14 },
    { name: 'Pinky', tip: 20, pip: 18 }
  ];

  let extCount = 0;
  let curlCount = 0;

  fingers.forEach(f => {
    const dTip = dist(lm[0], lm[f.tip]);
    const dPip = dist(lm[0], lm[f.pip]);
    if (dTip > dPip * 1.12) extCount++;
    else if (dTip < dPip * 0.98) curlCount++;
  });

  return { extCount, curlCount, isAllOpen: extCount >= 3, isAllCurled: curlCount >= 3 };
}

console.log('Open hand result:', checkFingers(openHand));
console.log('Curled hand result:', checkFingers(curledHand));
