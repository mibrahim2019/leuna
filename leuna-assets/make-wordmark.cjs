// Generate transparent-background navbar lockups from the white-bg brand asset.
// - wordmark.png       : black "leuna" + yellow mark, white keyed out (for light surfaces)
// - wordmark-dark.png  : white "leuna" + yellow mark (for dark surfaces)
const sharp = require('sharp');
const path = require('path');

const SRC = path.join(__dirname, 'email-header-logo-600x200.png');
const OUT_DIR = path.join(__dirname, '..', 'packages', 'assets');

const isYellow = (r, g, b) => r > 180 && g > 120 && b < 130 && r - b > 90;

async function run() {
  const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const light = Buffer.alloc(data.length);
  const dark = Buffer.alloc(data.length);

  for (let i = 0; i < data.length; i += channels) {
    const r = data[i],
      g = data[i + 1],
      b = data[i + 2];
    // Alpha = ink coverage over white background.
    const a = 255 - Math.min(r, g, b);
    const af = a / 255;

    // Un-premultiply against white to remove halos on coloured/dark surfaces.
    let fr = r,
      fg = g,
      fb = b;
    if (af > 0) {
      fr = Math.max(0, Math.min(255, Math.round((r - 255 * (1 - af)) / af)));
      fg = Math.max(0, Math.min(255, Math.round((g - 255 * (1 - af)) / af)));
      fb = Math.max(0, Math.min(255, Math.round((b - 255 * (1 - af)) / af)));
    }

    // Light variant: keep true colour.
    light[i] = fr;
    light[i + 1] = fg;
    light[i + 2] = fb;
    light[i + 3] = a;

    // Dark variant: keep yellow mark, recolour everything else (text + outline) to white.
    if (isYellow(fr, fg, fb)) {
      dark[i] = fr;
      dark[i + 1] = fg;
      dark[i + 2] = fb;
      dark[i + 3] = a;
    } else {
      dark[i] = 255;
      dark[i + 1] = 255;
      dark[i + 2] = 255;
      dark[i + 3] = a;
    }
  }

  const raw = { raw: { width, height, channels } };
  await sharp(light, raw).trim().png().toFile(path.join(OUT_DIR, 'wordmark.png'));
  await sharp(dark, raw).trim().png().toFile(path.join(OUT_DIR, 'wordmark-dark.png'));
  console.log('wrote wordmark.png + wordmark-dark.png to packages/assets');
}

run();
