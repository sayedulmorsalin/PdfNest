import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, '..', 'public');

// CRC32 implementation
function makeCrcTable() {
  const table = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) {
        c = 0xedb88320 ^ (c >>> 1);
      } else {
        c = c >>> 1;
      }
    }
    table[n] = c >>> 0;
  }
  return table;
}

const crcTable = makeCrcTable();
function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function createPng(width, height, rgbaBuffer) {
  const header = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8;
  ihdrData[9] = 6; // RGBA
  ihdrData[10] = 0;
  ihdrData[11] = 0;
  ihdrData[12] = 0;

  const ihdrChunk = Buffer.alloc(12 + 13);
  ihdrChunk.writeUInt32BE(13, 0);
  ihdrChunk.write('IHDR', 4);
  ihdrData.copy(ihdrChunk, 8);
  ihdrChunk.writeUInt32BE(crc32(ihdrChunk.subarray(4, 21)), 21);

  // Scanlines with filter byte 0 (None)
  const scanlines = Buffer.alloc(height * (1 + width * 4));
  for (let y = 0; y < height; y++) {
    scanlines[y * (1 + width * 4)] = 0;
    rgbaBuffer.copy(
      scanlines,
      y * (1 + width * 4) + 1,
      y * width * 4,
      (y + 1) * width * 4
    );
  }

  const compressed = zlib.deflateSync(scanlines, { level: 9 });

  // IDAT
  const idatChunk = Buffer.alloc(12 + compressed.length);
  idatChunk.writeUInt32BE(compressed.length, 0);
  idatChunk.write('IDAT', 4);
  compressed.copy(idatChunk, 8);
  idatChunk.writeUInt32BE(crc32(idatChunk.subarray(4, 8 + compressed.length)), 8 + compressed.length);

  // IEND
  const iendChunk = Buffer.alloc(12);
  iendChunk.writeUInt32BE(0, 0);
  iendChunk.write('IEND', 4);
  iendChunk.writeUInt32BE(crc32(iendChunk.subarray(4, 8)), 8);

  return Buffer.concat([header, ihdrChunk, idatChunk, iendChunk]);
}

function createIco(pngBuffer32) {
  const dir = Buffer.alloc(6);
  dir.writeUInt16LE(0, 0);
  dir.writeUInt16LE(1, 2);
  dir.writeUInt16LE(1, 4);

  const entry = Buffer.alloc(16);
  entry[0] = 32;
  entry[1] = 32;
  entry[2] = 0;
  entry[3] = 0;
  entry.writeUInt16LE(1, 4);
  entry.writeUInt16LE(32, 6);
  entry.writeUInt32LE(pngBuffer32.length, 8);
  entry.writeUInt32LE(6 + 16, 12);

  return Buffer.concat([dir, entry, pngBuffer32]);
}

/**
 * Ultra-high precision procedural rendering of PowerPoint / Brand Icon on a 64x64 grid
 */
function renderPptIcon(size) {
  const buffer = Buffer.alloc(size * size * 4);

  const SAMPLES = size <= 64 ? 6 : 4;

  for (let py = 0; py < size; py++) {
    for (let px = 0; px < size; px++) {
      let rSum = 0, gSum = 0, bSum = 0, aSum = 0;

      for (let sy = 0; sy < SAMPLES; sy++) {
        for (let sx = 0; sx < SAMPLES; sx++) {
          const x = ((px + (sx + 0.5) / SAMPLES) / size) * 64;
          const y = ((py + (sy + 0.5) / SAMPLES) / size) * 64;

          let sr = 0, sg = 0, sb = 0, sa = 0;

          // 1. Back slide canvas [x: 18..58, y: 7..57, rx: 8]
          if (x >= 18 && x <= 58 && y >= 7 && y <= 57) {
            const rx = 8;
            const inCorner =
              (x < 18 + rx && y < 7 + rx && (x - (18 + rx)) ** 2 + (y - (7 + rx)) ** 2 > rx ** 2) ||
              (x > 58 - rx && y < 7 + rx && (x - (58 - rx)) ** 2 + (y - (7 + rx)) ** 2 > rx ** 2) ||
              (x > 58 - rx && y > 57 - rx && (x - (58 - rx)) ** 2 + (y - (57 - rx)) ** 2 > rx ** 2) ||
              (x < 18 + rx && y > 57 - rx && (x - (18 + rx)) ** 2 + (y - (57 - rx)) ** 2 > rx ** 2);

            if (!inCorner) {
              const t = (y - 7) / 50;
              // Coral orange to dark crimson gradient
              sr = Math.round(255 * (1 - t) + 186 * t);
              sg = Math.round(107 * (1 - t) + 40 * t);
              sb = Math.round(66 * (1 - t) + 14 * t);
              sa = 1.0;

              // Slide inner screen
              if (x >= 24 && x <= 52 && y >= 12 && y <= 52) {
                sr = Math.round(sr * 0.65 + 130 * 0.35);
                sg = Math.round(sg * 0.65 + 23 * 0.35);
                sb = Math.round(sb * 0.65 + 5 * 0.35);
              }

              // Slide header line
              if (x >= 28 && x <= 48 && y >= 17 && y <= 20.5) {
                sr = 255; sg = 255; sb = 255; sa = 0.92;
              }

              // Pie chart on slide [center (39, 34), radius 9]
              const cx = 39, cy = 34;
              const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
              if (dist <= 9) {
                if (x >= cx && y <= cy) {
                  sr = 255; sg = 255; sb = 255; sa = 0.95;
                } else {
                  sr = 255; sg = 174; sb = 156; sa = 1.0;
                }
              }
            }
          }

          // 2. Front 'P' Badge [x: 6..38, y: 13..51, rx: 6]
          const bx1 = 6, bx2 = 38, by1 = 13, by2 = 51, brx = 6;
          let inBadge = false;
          if (x >= bx1 && x <= bx2 && y >= by1 && y <= by2) {
            const inCorner =
              (x < bx1 + brx && y < by1 + brx && (x - (bx1 + brx)) ** 2 + (y - (by1 + brx)) ** 2 > brx ** 2) ||
              (x > bx2 - brx && y < by1 + brx && (x - (bx2 - brx)) ** 2 + (y - (by1 + brx)) ** 2 > brx ** 2) ||
              (x > bx2 - brx && y > by2 - brx && (x - (bx2 - brx)) ** 2 + (y - (by2 - brx)) ** 2 > brx ** 2) ||
              (x < bx1 + brx && y > by2 - brx && (x - (bx1 + brx)) ** 2 + (y - (by2 - brx)) ** 2 > brx ** 2);

            if (!inCorner) {
              inBadge = true;
              const bt = (y - by1) / 38;
              sr = Math.round(230 * (1 - bt) + 156 * bt);
              sg = Math.round(59 * (1 - bt) + 30 * bt);
              sb = Math.round(28 * (1 - bt) + 9 * bt);
              sa = 1.0;

              // Letter "P"
              // Stem: x in [15..19.2], y in [20.5..43]
              // Loop: x in [15..28.8], y in [20.5..30.7]
              // Counter (hole): x in [19.2..24.7], y in [24.2..27.0]
              const inStem = (x >= 15 && x <= 19.2 && y >= 20.5 && y <= 43.0);
              const inLoopOuter = (x >= 18.5 && x <= 28.8 && y >= 20.5 && y <= 30.7);
              const inLoopInner = (x >= 19.2 && x <= 24.7 && y >= 24.2 && y <= 27.0);

              if (inStem || (inLoopOuter && !inLoopInner)) {
                sr = 255; sg = 255; sb = 255; sa = 1.0;
              }
            }
          }

          // Soft 3D drop shadow around badge
          if (!inBadge) {
            const sdx1 = 8, sdx2 = 40, sdy1 = 16, sdy2 = 54;
            if (x >= sdx1 && x <= sdx2 && y >= sdy1 && y <= sdy2) {
              const shadowAlpha = 0.3;
              sr = Math.round(sr * (1 - shadowAlpha));
              sg = Math.round(sg * (1 - shadowAlpha));
              sb = Math.round(sb * (1 - shadowAlpha));
              sa = Math.max(sa, shadowAlpha);
            }
          }

          rSum += sr * sa;
          gSum += sg * sa;
          bSum += sb * sa;
          aSum += sa;
        }
      }

      const total = SAMPLES * SAMPLES;
      const finalA = aSum / total;
      if (finalA > 0) {
        const idx = (py * size + px) * 4;
        buffer[idx] = Math.round(rSum / aSum);
        buffer[idx + 1] = Math.round(gSum / aSum);
        buffer[idx + 2] = Math.round(bSum / aSum);
        buffer[idx + 3] = Math.round(finalA * 255);
      }
    }
  }

  return buffer;
}

console.log('Rendering ultra-high quality PowerPoint PNG & ICO favicons...');

const buf16 = renderPptIcon(16);
fs.writeFileSync(path.join(publicDir, 'favicon-16x16.png'), createPng(16, 16, buf16));

const buf32 = renderPptIcon(32);
const png32 = createPng(32, 32, buf32);
fs.writeFileSync(path.join(publicDir, 'favicon-32x32.png'), png32);
fs.writeFileSync(path.join(publicDir, 'powerpoint.png'), png32);

const buf64 = renderPptIcon(64);
fs.writeFileSync(path.join(publicDir, 'powerpoint-64.png'), createPng(64, 64, buf64));

const buf192 = renderPptIcon(192);
const png192 = createPng(192, 192, buf192);
fs.writeFileSync(path.join(publicDir, 'powerpoint-192.png'), png192);
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), png192);

const buf512 = renderPptIcon(512);
const png512 = createPng(512, 512, buf512);
fs.writeFileSync(path.join(publicDir, 'image.png'), png512);
fs.writeFileSync(path.join(publicDir, 'powerpoint-512.png'), png512);

// ICO containing 32x32 PNG
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), createIco(png32));

console.log('Successfully generated high-resolution assets:');
console.log(' - public/image.png (512x512)');
console.log(' - public/powerpoint-512.png (512x512)');
console.log(' - public/powerpoint-192.png (192x192)');
console.log(' - public/apple-touch-icon.png (192x192)');
console.log(' - public/powerpoint-64.png (64x64)');
console.log(' - public/powerpoint.png (32x32)');
console.log(' - public/favicon-32x32.png (32x32)');
console.log(' - public/favicon-16x16.png (16x16)');
console.log(' - public/favicon.ico (32x32 ICO)');
