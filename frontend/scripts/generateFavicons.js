import fs from "fs";
import path from "path";
import zlib from "zlib";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, "../public");

// Pure Node PNG Encoder using built-in zlib
function createPngBuffer(width, height, getPixelRgba) {
  // Line size = 1 filter byte + width * 4 bytes RGBA
  const rowSize = 1 + width * 4;
  const rawData = Buffer.alloc(height * rowSize);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter type 0 (None)
    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const [r, g, b, a] = getPixelRgba(x, y, width, height);
      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  const compressedData = zlib.deflateSync(rawData);

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // Helper to create PNG chunks
  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, "ascii");
    const body = Buffer.concat([typeBuf, data]);

    const crc = Buffer.alloc(4);
    crc.writeInt32BE(calcCrc(body), 0);

    return Buffer.concat([len, body, crc]);
  }

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // Bit depth: 8
  ihdr[9] = 6; // Color type: 6 (RGBA)
  ihdr[10] = 0; // Compression
  ihdr[11] = 0; // Filter
  ihdr[12] = 0; // Interlace

  const ihdrChunk = makeChunk("IHDR", ihdr);
  const idatChunk = makeChunk("IDAT", compressedData);
  const iendChunk = makeChunk("IEND", Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// CRC32 table calculator
const crcTable = new Int32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[n] = c;
}

function calcCrc(buf) {
  let crc = -1;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return crc ^ -1;
}

// Render Brand Favicon Artwork (100% Transparent background with crisp vector brackets and nodes)
function renderFaviconPixel(x, y, width, height) {
  // Normalize to 0..1 coordinates
  const nx = (x + 0.5) / width;
  const ny = (y + 0.5) / height;

  const dx = nx - 0.5;
  const dy = ny - 0.5;
  const dist = Math.sqrt(dx * dx + dy * dy);

  let r = 0, g = 0, b = 0, a = 0;

  // Helper for drawing thick anti-aliased line segments
  function distToSegment(px, py, x1, y1, x2, y2) {
    const l2 = (x2 - x1) ** 2 + (y2 - y1) ** 2;
    if (l2 === 0) return Math.hypot(px - x1, py - y1);
    let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2;
    t = Math.max(0, Math.min(1, t));
    return Math.hypot(px - (x1 + t * (x2 - x1)), py - (y1 + t * (y2 - y1)));
  }

  // Alpha blending helper
  function blendColor(newR, newG, newB, newA) {
    if (newA <= 0) return;
    const normA = newA / 255;
    const currentNormA = a / 255;
    const outA = normA + currentNormA * (1 - normA);
    if (outA > 0) {
      r = Math.round((newR * normA + r * currentNormA * (1 - normA)) / outA);
      g = Math.round((newG * normA + g * currentNormA * (1 - normA)) / outA);
      b = Math.round((newB * normA + b * currentNormA * (1 - normA)) / outA);
      a = Math.round(outA * 255);
    }
  }

  // Outer gradient accent ring (thin orbit, crisp in both dark and light modes)
  const ringDist = Math.abs(dist - 0.44);
  const ringWidth = 0.025;
  if (ringDist < ringWidth) {
    const ringCover = Math.max(0, 1 - ringDist / ringWidth);
    const t = (nx + ny) / 2;
    const ringR = Math.round(59 + t * (168 - 59));
    const ringG = Math.round(130 + t * (85 - 130));
    const ringB = Math.round(246 + t * (247 - 246));
    blendColor(ringR, ringG, ringB, Math.round(ringCover * 180));
  }

  // Left Angle Bracket < (stroke color #2563eb / #3b82f6)
  const leftDist1 = distToSegment(nx, ny, 0.38, 0.28, 0.20, 0.5);
  const leftDist2 = distToSegment(nx, ny, 0.20, 0.5, 0.38, 0.72);
  const leftDist = Math.min(leftDist1, leftDist2);
  const strokeWidth = 0.065;
  if (leftDist < strokeWidth) {
    const cover = Math.max(0, Math.min(1, (strokeWidth - leftDist) / 0.015));
    blendColor(37, 99, 235, Math.round(cover * 255));
  }

  // Right Angle Bracket > (stroke color #9333ea / #a855f7)
  const rightDist1 = distToSegment(nx, ny, 0.62, 0.28, 0.80, 0.5);
  const rightDist2 = distToSegment(nx, ny, 0.80, 0.5, 0.62, 0.72);
  const rightDist = Math.min(rightDist1, rightDist2);
  if (rightDist < strokeWidth) {
    const cover = Math.max(0, Math.min(1, (strokeWidth - rightDist) / 0.015));
    blendColor(147, 51, 234, Math.round(cover * 255));
  }

  // Center connection line between brackets
  const lineDist = distToSegment(nx, ny, 0.28, 0.5, 0.72, 0.5);
  if (lineDist < 0.02) {
    const cover = Math.max(0, Math.min(1, (0.02 - lineDist) / 0.008));
    const t = (nx - 0.28) / (0.72 - 0.28);
    const lineR = Math.round(37 + t * (147 - 37));
    const lineG = Math.round(99 + t * (51 - 99));
    const lineB = Math.round(235 + t * (234 - 235));
    blendColor(lineR, lineG, lineB, Math.round(cover * 160));
  }

  // Center dots (y = 0.36, 0.5, 0.64 at x = 0.5)
  const dots = [0.36, 0.5, 0.64];
  dots.forEach((dotY) => {
    const dotDist = Math.hypot(nx - 0.5, ny - dotY);
    const dotRadius = 0.05;
    if (dotDist < dotRadius) {
      const cover = Math.max(0, Math.min(1, (dotRadius - dotDist) / 0.012));
      blendColor(114, 107, 246, Math.round(cover * 255));
    }
  });

  return [r, g, b, a];
}

const sizes = [
  { name: "favicon-48x48.png", size: 48 },
  { name: "favicon-96x96.png", size: 96 },
  { name: "icon-192.png", size: 192 },
  { name: "icon-512.png", size: 512 },
  { name: "apple-touch-icon.png", size: 180 },
];

console.log("Generating transparent PNG favicons for Googlebot-Image & all platforms...");
sizes.forEach(({ name, size }) => {
  const buf = createPngBuffer(size, size, renderFaviconPixel);
  fs.writeFileSync(path.join(publicDir, name), buf);
  console.log(`✓ Generated ${name} (${size}x${size})`);
});

// Create favicon.ico using 48x48 PNG data
const png48 = fs.readFileSync(path.join(publicDir, "favicon-48x48.png"));
const icoHeader = Buffer.alloc(6);
icoHeader.writeUInt16LE(0, 0); // Reserved
icoHeader.writeUInt16LE(1, 2); // Type 1 = ICO
icoHeader.writeUInt16LE(1, 4); // 1 image

const icoEntry = Buffer.alloc(16);
icoEntry.writeUInt8(48, 0); // Width
icoEntry.writeUInt8(48, 1); // Height
icoEntry.writeUInt8(0, 2); // Colors
icoEntry.writeUInt8(0, 3); // Reserved
icoEntry.writeUInt16LE(1, 4); // Color planes
icoEntry.writeUInt16LE(32, 6); // Bits per pixel
icoEntry.writeUInt32BE(png48.length, 8); // Image size
icoEntry.writeUInt32LE(22, 12); // Offset (6 + 16 = 22)

const icoBuf = Buffer.concat([icoHeader, icoEntry, png48]);
fs.writeFileSync(path.join(publicDir, "favicon.ico"), icoBuf);
console.log("✓ Generated favicon.ico");
