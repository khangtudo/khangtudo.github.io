import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const CARD_W = 0.091; // 91mm
const CARD_H = 0.055; // 55mm
const CARD_D = 0.0008; // 0.8mm
const W = CARD_W / 2;
const H = CARD_H / 2;
const D = CARD_D / 2;

function p(n) { return n.toFixed(6); }

// CRC32 implementation
const CRC_TABLE = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  CRC_TABLE[i] = c >>> 0;
}
export function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

export function generateUsdaDoubleSided() {
  const frontPts = `[(${p(-W)}, ${p(-H)}, ${p(D)}), (${p(W)}, ${p(-H)}, ${p(D)}), (${p(W)}, ${p(H)}, ${p(D)}), (${p(-W)}, ${p(H)}, ${p(D)})]`;
  const backPts = `[(${p(W)}, ${p(-H)}, ${p(-D)}), (${p(-W)}, ${p(-H)}, ${p(-D)}), (${p(-W)}, ${p(H)}, ${p(-D)}), (${p(W)}, ${p(H)}, ${p(-D)})]`;

  return `#usda 1.0
(
    defaultPrim = "Card"
    metersPerUnit = 1
    upAxis = "Y"
)

def Xform "Card"
{
    def Mesh "FrontFace"
    {
        uniform bool doubleSided = 0
        int[] faceVertexCounts = [3, 3]
        int[] faceVertexIndices = [0, 1, 2, 0, 2, 3]
        point3f[] points = ${frontPts}
        texCoord2f[] primvars:st = [(0, 0.5), (1, 0.5), (1, 1), (0, 1)] (
            interpolation = "vertex"
        )
        uniform token subdivisionScheme = "none"
        rel material:binding = </Card/Materials/Mat>
    }

    def Mesh "BackFace"
    {
        uniform bool doubleSided = 0
        int[] faceVertexCounts = [3, 3]
        int[] faceVertexIndices = [0, 1, 2, 0, 2, 3]
        point3f[] points = ${backPts}
        texCoord2f[] primvars:st = [(0, 0), (1, 0), (1, 0.5), (0, 0.5)] (
            interpolation = "vertex"
        )
        uniform token subdivisionScheme = "none"
        rel material:binding = </Card/Materials/Mat>
    }

    def Scope "Materials"
    {
        def Material "Mat"
        {
            token outputs:surface.connect = </Card/Materials/Mat/Surface.outputs:surface>

            def Shader "Surface"
            {
                uniform token info:id = "UsdPreviewSurface"
                color3f inputs:diffuseColor.connect = </Card/Materials/Mat/Tex.outputs:rgb>
                float inputs:metallic = 0.1
                float inputs:opacity = 1
                float inputs:roughness = 0.4
                token outputs:surface
            }

            def Shader "Tex"
            {
                uniform token info:id = "UsdUVTexture"
                asset inputs:file = @card.png@
                float2 inputs:st.connect = </Card/Materials/Mat/UvReader.outputs:result>
                token inputs:wrapS = "clamp"
                token inputs:wrapT = "clamp"
                float3 outputs:rgb
            }

            def Shader "UvReader"
            {
                uniform token info:id = "UsdPrimvarReader_float2"
                uniform token inputs:varname = "st"
                float2 outputs:result
            }
        }
    }
}
`;
}

const ALIGN = 64;
const EXTRA_ID = 0x1986;

export function buildDoubleSidedUsdz(png) {
  const usdaText = generateUsdaDoubleSided();
  const files = [
    { name: 'card.usda', data: new TextEncoder().encode(usdaText) },
    { name: 'card.png', data: png },
  ];

  const chunks = [];
  const central = [];
  let offset = 0;
  const push = (b) => { chunks.push(b); offset += b.length; };

  for (const f of files) {
    const name = new TextEncoder().encode(f.name);
    const headerStart = offset;
    let extraLen = (ALIGN - ((headerStart + 30 + name.length) % ALIGN)) % ALIGN;
    if (extraLen > 0 && extraLen < 4) extraLen += ALIGN;

    const lh = new Uint8Array(30 + name.length + extraLen);
    const dv = new DataView(lh.buffer);
    dv.setUint32(0, 0x04034b50, true);
    dv.setUint16(4, 10, true);
    dv.setUint16(6, 0, true);
    dv.setUint16(8, 0, true); // STORED
    dv.setUint16(10, 0, true);
    dv.setUint16(12, 0x21, true);
    dv.setUint32(14, crc32(f.data), true);
    dv.setUint32(18, f.data.length, true);
    dv.setUint32(22, f.data.length, true);
    dv.setUint16(26, name.length, true);
    dv.setUint16(28, extraLen, true);
    lh.set(name, 30);
    if (extraLen) {
      dv.setUint16(30 + name.length, EXTRA_ID, true);
      dv.setUint16(32 + name.length, extraLen - 4, true);
    }
    push(lh);
    push(f.data);
    central.push({ name, data: f.data, headerStart });
  }

  const cdStart = offset;
  for (const e of central) {
    const cd = new Uint8Array(46 + e.name.length);
    const dv = new DataView(cd.buffer);
    dv.setUint32(0, 0x02014b50, true);
    dv.setUint16(4, 20, true);
    dv.setUint16(6, 10, true);
    dv.setUint16(8, 0, true);
    dv.setUint16(10, 0, true);
    dv.setUint16(12, 0x21, true);
    dv.setUint32(16, crc32(e.data), true);
    dv.setUint32(20, e.data.length, true);
    dv.setUint32(24, e.data.length, true);
    dv.setUint16(28, e.name.length, true);
    dv.setUint16(30, 0, true);
    dv.setUint16(32, 0, true);
    dv.setUint16(34, 0, true);
    dv.setUint16(36, 0, true);
    dv.setUint32(38, 0, true);
    dv.setUint32(42, e.headerStart, true);
    cd.set(e.name, 46);
    push(cd);
  }

  const cdLen = offset - cdStart;
  const eocd = new Uint8Array(22);
  const dv = new DataView(eocd.buffer);
  dv.setUint32(0, 0x06054b50, true);
  dv.setUint16(4, 0, true);
  dv.setUint16(6, 0, true);
  dv.setUint16(8, central.length, true);
  dv.setUint16(10, central.length, true);
  dv.setUint32(12, cdLen, true);
  dv.setUint32(16, cdStart, true);
  dv.setUint16(20, 0, true);
  push(eocd);

  const total = new Uint8Array(offset);
  let pos = 0;
  for (const c of chunks) { total.set(c, pos); pos += c.length; }
  return total;
}

export function buildDoubleSidedGlb(png) {
  // 8 vertices: 0..3 Front (+Z), 4..7 Back (-Z)
  const POSITIONS = [
    // Front Face (+Z)
    -W, -H, D,   W, -H, D,   W, H, D,   -W, H, D,
    // Back Face (-Z)
     W, -H, -D, -W, -H, -D, -W, H, -D,   W, H, -D
  ];
  // glTF UV origin top-left (V grows down):
  // Top half for Front (V 0..0.5):
  // Bottom half for Back (V 0.5..1.0):
  const UVS = [
    // Front:
    0, 0.5,   1, 0.5,   1, 0,   0, 0,
    // Back:
    0, 1.0,   1, 1.0,   1, 0.5, 0, 0.5
  ];
  const INDICES = [
    0, 1, 2,  0, 2, 3, // Front Face
    4, 5, 6,  4, 6, 7  // Back Face
  ];

  const idx = new Uint8Array(new Uint16Array(INDICES).buffer);
  const pos = new Uint8Array(new Float32Array(POSITIONS).buffer);
  const uv = new Uint8Array(new Float32Array(UVS).buffer);

  const pad4 = (n) => (4 - (n % 4)) % 4;
  const oIdx = 0;
  const oPos = idx.length + pad4(idx.length);
  const oUv = oPos + pos.length + pad4(pos.length);
  const oImg = oUv + uv.length + pad4(uv.length);
  const binLen = oImg + png.length + pad4(png.length);
  const bin = new Uint8Array(binLen);
  bin.set(idx, oIdx);
  bin.set(pos, oPos);
  bin.set(uv, oUv);
  bin.set(png, oImg);

  const json = {
    asset: { version: '2.0', generator: 'inid.me/double-sided-card' },
    extensionsUsed: ['KHR_materials_unlit'],
    scene: 0,
    scenes: [{ nodes: [0] }],
    nodes: [{ mesh: 0, name: 'Card' }],
    meshes: [{ name: 'Card', primitives: [{ attributes: { POSITION: 1, TEXCOORD_0: 2 }, indices: 0, material: 0 }] }],
    materials: [
      {
        name: 'CardDoubleSided',
        doubleSided: true,
        pbrMetallicRoughness: { baseColorTexture: { index: 0 }, metallicFactor: 0.1, roughnessFactor: 0.5 },
        extensions: { KHR_materials_unlit: {} }
      }
    ],
    textures: [{ sampler: 0, source: 0 }],
    samplers: [{ magFilter: 9729, minFilter: 9987, wrapS: 33071, wrapT: 33071 }],
    images: [{ bufferView: 3, mimeType: 'image/png' }],
    accessors: [
      { bufferView: 0, componentType: 5123, count: 12, type: 'SCALAR', max: [7], min: [0] },
      { bufferView: 1, componentType: 5126, count: 8, type: 'VEC3', max: [W, H, D], min: [-W, -H, -D] },
      { bufferView: 2, componentType: 5126, count: 8, type: 'VEC2', max: [1, 1], min: [0, 0] }
    ],
    bufferViews: [
      { buffer: 0, byteOffset: oIdx, byteLength: idx.length },
      { buffer: 0, byteOffset: oPos, byteLength: pos.length },
      { buffer: 0, byteOffset: oUv, byteLength: uv.length },
      { buffer: 0, byteOffset: oImg, byteLength: png.length }
    ],
    buffers: [{ byteLength: bin.length }]
  };

  const rawJson = new TextEncoder().encode(JSON.stringify(json));
  const jsonChunk = new Uint8Array(rawJson.length + pad4(rawJson.length)).fill(0x20);
  jsonChunk.set(rawJson);

  const total = 12 + 8 + jsonChunk.length + 8 + bin.length;
  const out = new Uint8Array(total);
  const dv = new DataView(out.buffer);
  dv.setUint32(0, 0x46546c67, true);
  dv.setUint32(4, 2, true);
  dv.setUint32(8, total, true);
  dv.setUint32(12, jsonChunk.length, true);
  dv.setUint32(16, 0x4e4f534a, true);
  out.set(jsonChunk, 20);
  const binHdr = 20 + jsonChunk.length;
  dv.setUint32(binHdr, bin.length, true);
  dv.setUint32(binHdr + 4, 0x004e4942, true);
  out.set(bin, binHdr + 8);
  return out;
}
