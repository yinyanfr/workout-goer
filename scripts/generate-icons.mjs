import { createDeflate } from "zlib";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

// --- CRC32 for PNG ---
const crcTable = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let j = 0; j < 8; j++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[i] = c;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function createChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeB = Buffer.from(type, "ascii");
  const crcData = Buffer.concat([typeB, data]);
  const crc = crc32(crcData);
  const crcB = Buffer.alloc(4);
  crcB.writeUInt32BE(crc, 0);
  return Buffer.concat([len, typeB, data, crcB]);
}

// --- Simple 2D drawing helpers on a pixel buffer ---
function setPixel(pixels, w, h, x, y, r, g, b) {
  if (x < 0 || x >= w || y < 0 || y >= h) return;
  const i = (y * w + x) * 4;
  pixels[i] = r;
  pixels[i + 1] = g;
  pixels[i + 2] = b;
  pixels[i + 3] = 255;
}

// Anti-aliased line (Xiaolin Wu)
function drawLine(pixels, w, h, x0, y0, x1, y1, r, g, b) {
  const steep = Math.abs(y1 - y0) > Math.abs(x1 - x0);
  if (steep) {
    [x0, y0] = [y0, x0];
    [x1, y1] = [y1, x1];
  }
  if (x0 > x1) {
    [x0, x1] = [x1, x0];
    [y0, y1] = [y1, y0];
  }
  const dx = x1 - x0;
  const dy = y1 - y0;
  const gradient = dx === 0 ? 1 : dy / dx;

  let xend = Math.round(x0);
  let yend = y0 + gradient * (xend - x0);
  let xgap = 1 - (x0 + 0.5 - Math.floor(x0 + 0.5));
  const xpxl1 = xend;
  const ypxl1 = Math.floor(yend);
  if (steep) {
    setPixel(pixels, w, h, ypxl1, xpxl1, r, g, b);
    setPixel(pixels, w, h, ypxl1 + 1, xpxl1, r, g, b);
  } else {
    setPixel(pixels, w, h, xpxl1, ypxl1, r, g, b);
    setPixel(pixels, w, h, xpxl1, ypxl1 + 1, r, g, b);
  }
  let intery = yend + gradient;

  xend = Math.round(x1);
  yend = y1 + gradient * (xend - x1);
  xgap = x1 + 0.5 - Math.floor(x1 + 0.5);
  const xpxl2 = xend;
  const ypxl2 = Math.floor(yend);
  if (steep) {
    setPixel(pixels, w, h, ypxl2, xpxl2, r, g, b);
    setPixel(pixels, w, h, ypxl2 + 1, xpxl2, r, g, b);
  } else {
    setPixel(pixels, w, h, xpxl2, ypxl2, r, g, b);
    setPixel(pixels, w, h, xpxl2, ypxl2 + 1, r, g, b);
  }

  if (steep) {
    for (let x = xpxl1 + 1; x <= xpxl2 - 1; x++) {
      setPixel(pixels, w, h, Math.floor(intery), x, r, g, b);
      setPixel(pixels, w, h, Math.floor(intery) + 1, x, r, g, b);
      intery += gradient;
    }
  } else {
    for (let x = xpxl1 + 1; x <= xpxl2 - 1; x++) {
      setPixel(pixels, w, h, x, Math.floor(intery), r, g, b);
      setPixel(pixels, w, h, x, Math.floor(intery) + 1, r, g, b);
      intery += gradient;
    }
  }
}

function drawThickLine(pixels, w, h, x0, y0, x1, y1, thickness, r, g, b) {
  const dx = x1 - x0;
  const dy = y1 - y0;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len === 0) return;
  const nx = -dy / len;
  const ny = dx / len;
  const half = thickness / 2;
  for (let t = -half; t <= half; t += 0.5) {
    drawLine(
      pixels,
      w,
      h,
      x0 + nx * t,
      y0 + ny * t,
      x1 + nx * t,
      y1 + ny * t,
      r,
      g,
      b,
    );
  }
}

async function createPNG(size) {
  // RGBA pixel buffer
  const pixels = new Uint8Array(size * size * 4);

  const bgR = 20,
    bgG = 20,
    bgB = 24;
  const fgR = 82,
    fgG = 196,
    fgB = 26; // green accent
  const fgR2 = 255,
    fgG2 = 255,
    fgB2 = 255; // white

  // Fill background
  for (let i = 0; i < size * size; i++) {
    const off = i * 4;
    pixels[off] = bgR;
    pixels[off + 1] = bgG;
    pixels[off + 2] = bgB;
    pixels[off + 3] = 255;
  }

  // Draw a styled "W" shape
  const m = size * 0.22; // margin
  const top = size * 0.28;
  const bot = size * 0.72;
  const mid = size * 0.5;
  const w = size - m * 2;

  // W points: left-top, left-mid-dip, center-peak, right-mid-dip, right-top
  const pts = [
    [m, top], // left top
    [m + w * 0.25, bot], // left dip
    [mid, size * 0.5], // center peak
    [m + w * 0.75, bot], // right dip
    [size - m, top], // right top
  ];

  const thick = size * 0.06;

  // Draw the W strokes
  for (let i = 0; i < pts.length - 1; i++) {
    drawThickLine(
      pixels,
      size,
      size,
      pts[i][0],
      pts[i][1],
      pts[i + 1][0],
      pts[i + 1][1],
      thick,
      fgR,
      fgG,
      fgB,
    );
  }

  // Bottom underline accent
  const ulY = size * 0.82;
  drawThickLine(
    pixels,
    size,
    size,
    m + size * 0.1,
    ulY,
    size - m - size * 0.1,
    ulY,
    thick * 0.5,
    fgR,
    fgG,
    fgB,
  );

  // Convert RGBA to raw RGB rows (filter byte 0 per row)
  const raw = Buffer.alloc((size * 3 + 1) * size);
  for (let y = 0; y < size; y++) {
    const rowOff = y * (size * 3 + 1);
    raw[rowOff] = 0; // filter: none
    for (let x = 0; x < size; x++) {
      const px = (y * size + x) * 4;
      const dst = rowOff + 1 + x * 3;
      raw[dst] = pixels[px];
      raw[dst + 1] = pixels[px + 1];
      raw[dst + 2] = pixels[px + 2];
    }
  }

  // Deflate
  const deflate = createDeflate();
  const chunks = [];
  deflate.on("data", (c) => chunks.push(c));
  deflate.end(raw);

  return new Promise((resolve) => {
    deflate.on("end", () => {
      const compressed = Buffer.concat(chunks);

      const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
      const ihdrData = Buffer.alloc(13);
      ihdrData.writeUInt32BE(size, 0);
      ihdrData.writeUInt32BE(size, 4);
      ihdrData[8] = 8; // bit depth
      ihdrData[9] = 2; // color type: RGB
      ihdrData[10] = 0;
      ihdrData[11] = 0;
      ihdrData[12] = 0;

      resolve(
        Buffer.concat([
          sig,
          createChunk("IHDR", ihdrData),
          createChunk("IDAT", compressed),
          createChunk("IEND", Buffer.alloc(0)),
        ]),
      );
    });
  });
}

async function main() {
  mkdirSync("public", { recursive: true });

  const icon192 = await createPNG(192);
  writeFileSync("public/icon-192.png", icon192);
  console.log("Created public/icon-192.png");

  const icon512 = await createPNG(512);
  writeFileSync("public/icon-512.png", icon512);
  console.log("Created public/icon-512.png");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
