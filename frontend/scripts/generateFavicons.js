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

// Render Brand Favicon Artwork (Branded dark background + vector code brackets)
function renderFaviconPixel(x, y, width, height) {
  // Normalize to 0..1 coordinates
  const nx = (x + 0.5) / width;
  const ny = (y + 0.5) / height;

  const dx = nx - 0.5;
  const dy = ny - 0.5;
  const dist = Math.sqrt(dx * dx + dy * dy);

  // Background: Solid circular dark badge (#090d16) to prevent Google Search white background
  if (dist > 0.48) {
    return [0, 0, 0, 0]; // Transparent padding outside circle
  }

  // Base Dark Background (#090d16)
  let r = 9;
  let g = 13;
  let b = 22;
  let a = 255;

  // Outer gradient accent ring (dist between 0.43 and 0.46)
  if (dist >= 0.43 && dist <= 0.46) {
    const ringAlpha = 0.8;
    // Blue to purple gradient accent
    const t = (nx + ny) / 2;
    r = Math.round(r * (1 - ringAlpha) + (59 + t * (168 - 59)) * ringAlpha);
    g = Math.round(g * (1 - ringAlpha) + (130 + t * (85 - 130)) * ringAlpha);
    b = Math.round(b * (1 - ringAlpha) + (246 + t * (247 - 246)) * ringAlpha);
  }

  // Helper for drawing thick anti-aliased line segments
  function distToSegment(px, py, x1, y1, x2, y2) {
    const l2 = (x2 - x1) ** 2 + (y2 - y1) ** 2;
    if (l2 === 0) return Math.hypot(px - x1, py - y1);
    let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2;
    t = Math.max(0, Math.min(1, t));
    return Math.hypot(px - (x1 + t * (x2 - x1)), py - (y1 + t * (y2 - y1)));
  }

  // Left Angle Bracket < (stroke color #3b82f6)
  const leftDist1 = distToSegment(nx, ny, 0.38, 0.32, 0.24, 0.5);
  const leftDist2 = distToSegment(nx, ny, 0.24, 0.5, 0.38, 0.68);
  const leftDist = Math.min(leftDist1, leftDist2);

  const strokeWidth = 0.055;
  if (leftDist < strokeWidth) {
    const cover = Math.min(1, (strokeWidth - leftDist) / 0.015);
    r = Math.round(r * (1 - cover) + 59 * cover);
    g = Math.round(g * (1 - cover) + 130 * cover);
    b = Math.round(b * (1 - cover) + 246 * cover);
  }

  // Right Angle Bracket > (stroke color #a855f7)
  const rightDist1 = distToSegment(nx, ny, 0.62, 0.32, 0.76, 0.5);
  const rightDist2 = distToSegment(nx, ny, 0.76, 0.5, 0.62, 0.68);
  const rightDist = Math.min(rightDist1, rightDist2);

  if (rightDist < strokeWidth) {
    const cover = Math.min(1, (strokeWidth - rightDist) / 0.015);
    r = Math.round(r * (1 - cover) + 168 * cover);
    g = Math.round(g * (1 - cover) + 85 * cover);
    b = Math.round(b * (1 - cover) + 247 * cover);
  }

  // Center dots (y = 0.38, 0.5, 0.62 at x = 0.5)
  const dots = [0.37, 0.5, 0.63];
  dots.forEach((dotY) => {
    const dotDist = Math.hypot(nx - 0.5, ny - dotY);
    const dotRadius = 0.045;
    if (dotDist < dotRadius) {
      const cover = Math.min(1, (dotRadius - dotDist) / 0.012);
      r = Math.round(r * (1 - cover) + 114 * cover);
      g = Math.round(g * (1 - cover) + 107 * cover);
      b = Math.round(b * (1 - cover) + 246 * cover);
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

console.log("Generating PNG favicons for Googlebot-Image...");
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
