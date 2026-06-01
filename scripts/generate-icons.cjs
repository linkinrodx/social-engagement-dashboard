const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

const outDir = path.resolve(__dirname, '..', 'public');

function createPNG(width, height, color) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 2;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const rowBytes = 1 + width * 3;
  const rawData = Buffer.alloc(height * rowBytes);
  for (let y = 0; y < height; y++) {
    rawData[y * rowBytes] = 0;
    for (let x = 0; x < width; x++) {
      const off = y * rowBytes + 1 + x * 3;
      rawData[off] = color[0];
      rawData[off + 1] = color[1];
      rawData[off + 2] = color[2];
    }
  }

  const compressed = zlib.deflateSync(rawData);

  function crc32(buf) {
    let crc = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      crc ^= buf[i];
      for (let j = 0; j < 8; j++) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
    return (crc ^ 0xffffffff) >>> 0;
  }

  function chunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length);
    const t = Buffer.from(type, 'ascii');
    const crcVal = Buffer.alloc(4);
    crcVal.writeUInt32BE(crc32(Buffer.concat([t, data])));
    return Buffer.concat([len, t, data, crcVal]);
  }

  return Buffer.concat([
    signature,
    chunk('IHDR', ihdr),
    chunk('IDAT', compressed),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

const primary = [103, 58, 183]; // #673AB7 (Mat deep purple)
const white = [255, 255, 255];  // white background for maskable

// Regular icons
fs.writeFileSync(path.join(outDir, 'icon-192x192.png'), createPNG(192, 192, primary));
fs.writeFileSync(path.join(outDir, 'icon-512x512.png'), createPNG(512, 512, primary));
// Maskable icon (white bg so it adapts well to android shapes)
fs.writeFileSync(path.join(outDir, 'icon-maskable-512x512.png'), createPNG(512, 512, white));

console.log('Icons generated in public/');
