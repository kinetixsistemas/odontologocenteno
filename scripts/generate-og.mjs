import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';

const OUT_DIR = 'public/og';
const LOGO = 'public/images/logo-principal.png';
const WIDTH = 1200;
const HEIGHT = 630;

const images = [
  { file: 'home.png', title: 'Od. Albany Centeno', subtitle: 'Odontóloga en Punto Fijo, Estado Falcón' },
  { file: 'servicios.png', title: 'Servicios odontológicos', subtitle: 'Punto Fijo, Estado Falcón' },
  { file: 'servicios-limpieza-dental.png', title: 'Limpieza dental', subtitle: 'Punto Fijo, Estado Falcón' },
  { file: 'servicios-extraccion-dental.png', title: 'Extracción dental', subtitle: 'Punto Fijo, Estado Falcón' },
  { file: 'servicios-ortodoncia.png', title: 'Ortodoncia', subtitle: 'Punto Fijo, Estado Falcón' },
  { file: 'sobre-mi.png', title: 'Sobre la Od. Albany Centeno', subtitle: 'Formación y atención en Punto Fijo' },
  { file: 'agendar-cita.png', title: 'Agenda tu cita', subtitle: 'Centro Medico Luna Design · Punto Fijo' },
  { file: 'blog.png', title: 'Blog odontológico', subtitle: 'Consejos de salud bucal' },
  { file: 'blog-cada-cuanto-limpieza-dental.png', title: '¿Cada cuánto una limpieza dental?', subtitle: 'Prevención y salud bucal' },
  { file: 'blog-como-elegir-odontologa-punto-fijo.png', title: '¿Cómo elegir odontóloga en Punto Fijo?', subtitle: 'Criterios para una buena elección' },
  { file: 'blog-cuando-llevar-nino-odontologo.png', title: '¿Cuándo llevar a mi hijo al odontólogo?', subtitle: 'Primera visita dental infantil' },
  { file: 'blog-cuanto-dura-ortodoncia.png', title: '¿Cuánto dura la ortodoncia?', subtitle: 'Factores que influyen en el tratamiento' },
  { file: 'blog-que-es-diseno-de-sonrisa.png', title: '¿Qué es el diseño de sonrisa?', subtitle: 'Planificación estética personalizada' },
];

const escapeXml = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');

const wrap = (text, maxChars) => {
  const words = String(text).split(/\s+/);
  const lines = [];
  let line = '';
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
};

const backgroundSvg = ({ title, subtitle }) => {
  const titleSize = title.length > 48 ? 40 : title.length > 34 ? 44 : 50;
  const maxChars = titleSize >= 50 ? 25 : titleSize >= 44 ? 28 : 32;
  const lines = wrap(title, maxChars);
  const lineHeight = titleSize + 10;
  const blockHeight = lines.length * lineHeight;
  const startY = 300 - Math.max(0, blockHeight - 120) / 2;

  return `
  <svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#F8E7FD"/>
        <stop offset="55%" stop-color="#f3e4f7"/>
        <stop offset="100%" stop-color="#e9dced"/>
      </linearGradient>
    </defs>
    <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>
    <circle cx="1090" cy="80" r="210" fill="#BFB2C3" opacity="0.28"/>
    <circle cx="1140" cy="560" r="150" fill="#BFB2C3" opacity="0.18"/>
    <rect x="0" y="0" width="28" height="${HEIGHT}" fill="#736B75"/>
    <rect x="70" y="70" width="250" height="490" rx="26" fill="#ffffff" opacity="0.55"/>
    <line x1="360" y1="100" x2="360" y2="530" stroke="#736B75" stroke-opacity="0.28" stroke-width="2"/>
    <text x="410" y="170" font-family="DejaVu Sans, Arial, sans-serif" font-size="20" letter-spacing="5" fill="#736B75">ODONTOLOGÍA · PUNTO FIJO</text>
    ${lines
      .map(
        (line, index) =>
          `<text x="410" y="${startY + index * lineHeight}" font-family="DejaVu Serif, Georgia, serif" font-weight="700" font-size="${titleSize}" fill="#4b434e">${escapeXml(line)}</text>`
      )
      .join('\n')}
    <text x="410" y="${Math.max(520, startY + blockHeight + 34)}" font-family="DejaVu Sans, Arial, sans-serif" font-size="26" fill="#736B75">${escapeXml(subtitle)}</text>
    <rect x="0" y="${HEIGHT - 68}" width="${WIDTH}" height="68" fill="#736B75"/>
    <text x="410" y="${HEIGHT - 26}" font-family="DejaVu Sans, Arial, sans-serif" font-size="22" fill="#F8E7FD">odalbanycenteno.com</text>
  </svg>`;
};

await mkdir(OUT_DIR, { recursive: true });
const logo = await sharp(LOGO).resize({ height: 280, fit: 'inside' }).png().toBuffer();
const logoMeta = await sharp(logo).metadata();
const logoLeft = Math.round(70 + (250 - logoMeta.width) / 2);
const logoTop = Math.round((HEIGHT - 68 - logoMeta.height) / 2);

for (const image of images) {
  const svg = Buffer.from(backgroundSvg(image));
  const png = await sharp(svg)
    .composite([{ input: logo, left: logoLeft, top: logoTop }])
    .png()
    .toBuffer();
  await writeFile(join(OUT_DIR, image.file), png);
  console.log(`generated ${join(OUT_DIR, image.file)}`);
}

await writeFile('public/og-default.png', await sharp(join(OUT_DIR, 'home.png')).toBuffer());
console.log('generated public/og-default.png');
