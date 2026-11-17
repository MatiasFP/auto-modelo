// Los monitos de cada modelo: figuras peluditas con animación (SMIL).
// Cada uno rebota suave, parpadea y tiene un detalle propio que se mueve.

type Figura = { svg: string; alt: string; texto: string }

const BOTE = (dur: string, alto: number) =>
  `<animateTransform attributeName="transform" type="translate" values="0 0;0 -${alto};0 0" dur="${dur}" repeatCount="indefinite" calcMode="spline" keySplines=".4 0 .6 1;.4 0 .6 1"/>`

const PARPADEO = (cy: number, ry: number, dur = '3.6s') =>
  `<animate attributeName="ry" values="${ry};${ry};0.6;${ry};${ry}" keyTimes="0;0.9;0.94;0.98;1" dur="${dur}" repeatCount="indefinite"/>`

// Pelusa: bordes ligeramente irregulares, como un peluche.
const DEFS = (id: string, c1: string, c2: string) => `
<defs>
  <radialGradient id="g${id}" cx="40%" cy="30%" r="80%"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></radialGradient>
  <filter id="f${id}" x="-10%" y="-10%" width="120%" height="120%">
    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="n"/>
    <feDisplacementMap in="SourceGraphic" in2="n" scale="3.5"/>
  </filter>
  <filter id="s${id}"><feGaussianBlur stdDeviation="2.5"/></filter>
</defs>`

const SOMBRA = (id: string) =>
  `<ellipse cx="60" cy="108" rx="34" ry="5" fill="#000" opacity=".22" filter="url(#s${id})">
     <animate attributeName="rx" values="34;28;34" dur="1.4s" repeatCount="indefinite"/>
   </ellipse>`

const BRILLO = `<ellipse cx="42" cy="38" rx="14" ry="8" fill="#fff" opacity=".28" transform="rotate(-25 42 38)"/>`

const RUBOR = (x1: number, x2: number, y: number, c: string) =>
  `<ellipse cx="${x1}" cy="${y}" rx="6" ry="3.5" fill="${c}" opacity=".55"/><ellipse cx="${x2}" cy="${y}" rx="6" ry="3.5" fill="${c}" opacity=".55"/>`

// 🐸 HAIKU: rana verde con moño. Rápida: rebota más y mueve los ojos.
const haiku = `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">${DEFS('h', '#b6f26b', '#4fae2e')}${SOMBRA('h')}
<g>${BOTE('0.7s', 6)}
  <ellipse cx="60" cy="72" rx="46" ry="34" fill="url(#gh)" filter="url(#fh)"/>
  <circle cx="38" cy="40" r="17" fill="url(#gh)" filter="url(#fh)"/><circle cx="82" cy="40" r="17" fill="url(#gh)" filter="url(#fh)"/>
  <circle cx="38" cy="39" r="11" fill="#fff"/><circle cx="82" cy="39" r="11" fill="#fff"/>
  <g><animateTransform attributeName="transform" type="translate" values="-2 0;2 0;-2 0" dur="1.6s" repeatCount="indefinite"/>
    <ellipse cx="39" cy="40" rx="5.5" ry="6" fill="#1d2a14">${PARPADEO(40, 6)}</ellipse>
    <ellipse cx="83" cy="40" rx="5.5" ry="6" fill="#1d2a14">${PARPADEO(40, 6)}</ellipse>
    <circle cx="37" cy="37" r="2" fill="#fff"/><circle cx="81" cy="37" r="2" fill="#fff"/>
  </g>
  ${RUBOR(26, 94, 70, '#ff8fa3')}
  <path d="M48 76 Q60 88 72 76" stroke="#1d2a14" stroke-width="3.5" fill="none" stroke-linecap="round"/>
  <path d="M46 96 L60 90 L74 96 L74 108 L60 100 L46 108Z" fill="#2b2b33"/><circle cx="60" cy="98" r="4" fill="#3a3a45"/>
  ${BRILLO}
</g></svg>`

// 🫐 SONNET: nube azul con boina. Se mece de lado y guiña un ojo.
const sonnet = `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">${DEFS('s', '#7fd6ff', '#2a86d6')}${SOMBRA('s')}
<g>${BOTE('1.2s', 5)}
  <g><animateTransform attributeName="transform" type="rotate" values="-3 60 100;3 60 100;-3 60 100" dur="2.4s" repeatCount="indefinite"/>
    <path d="M16 96 Q4 60 30 44 Q36 22 62 28 Q92 22 98 52 Q116 70 100 94 Q86 108 60 106 Q32 110 16 96Z" fill="url(#gs)" filter="url(#fs)"/>
    <ellipse cx="60" cy="26" rx="34" ry="10" fill="#2b2b33"/>
    <path d="M30 26 Q38 2 66 6 Q92 10 92 26Z" fill="#3a3a45"/><circle cx="64" cy="5" r="3.5" fill="#2b2b33"/>
    <ellipse cx="46" cy="64" rx="5" ry="6" fill="#16314a">${PARPADEO(64, 6)}</ellipse>
    <path d="M70 64 Q76 58 82 64" stroke="#16314a" stroke-width="3.5" fill="none" stroke-linecap="round">
      <animate attributeName="d" values="M70 64 Q76 58 82 64;M70 64 Q76 58 82 64;M70 62 Q76 68 82 62;M70 64 Q76 58 82 64" keyTimes="0;.7;.8;1" dur="4s" repeatCount="indefinite"/>
    </path>
    ${RUBOR(36, 90, 78, '#ff9ec4')}
    <path d="M54 82 Q62 90 70 82" stroke="#16314a" stroke-width="3" fill="none" stroke-linecap="round"/>
    ${BRILLO}
  </g>
</g></svg>`

// 🔺 OPUS 5.5: triángulo amarillo con lentes y moño. Piensa: lentes que brillan y puntitos.
const opus = `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">${DEFS('o', '#ffe770', '#e9a713')}${SOMBRA('o')}
<g>${BOTE('1.6s', 4)}
  <path d="M60 10 Q70 10 76 22 L110 90 Q118 106 98 106 L22 106 Q2 106 10 90 L44 22 Q50 10 60 10Z" fill="url(#go)" filter="url(#fo)"/>
  <g stroke="#3b2a0e" stroke-width="4.5" fill="#fff">
    <circle cx="44" cy="58" r="15"/><circle cx="76" cy="58" r="15"/><path d="M59 58 L61 58" fill="none"/>
  </g>
  <ellipse cx="45" cy="59" rx="6" ry="7" fill="#1d1406">${PARPADEO(59, 7, '4.2s')}</ellipse>
  <ellipse cx="77" cy="59" rx="6" ry="7" fill="#1d1406">${PARPADEO(59, 7, '4.2s')}</ellipse>
  <circle cx="43" cy="56" r="2.2" fill="#fff"/><circle cx="75" cy="56" r="2.2" fill="#fff"/>
  <path d="M36 52 L46 46" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity="0">
    <animate attributeName="opacity" values="0;0;.9;0;0" dur="2.8s" repeatCount="indefinite"/>
  </path>
  ${RUBOR(30, 90, 78, '#ff9a6b')}
  <path d="M54 84 Q60 89 66 84" stroke="#3b2a0e" stroke-width="3" fill="none" stroke-linecap="round"/>
  <path d="M40 92 L60 99 L80 92 L80 106 L60 99 L40 106Z" fill="#2b2b33"/><circle cx="60" cy="99" r="4.5" fill="#3a3a45"/>
  <g fill="#3b2a0e">
    <circle cx="96" cy="16" r="3"><animate attributeName="opacity" values=".15;1;.15" dur="1.2s" begin="0s" repeatCount="indefinite"/></circle>
    <circle cx="106" cy="10" r="3.6"><animate attributeName="opacity" values=".15;1;.15" dur="1.2s" begin=".25s" repeatCount="indefinite"/></circle>
    <circle cx="116" cy="4" r="4.2"><animate attributeName="opacity" values=".15;1;.15" dur="1.2s" begin=".5s" repeatCount="indefinite"/></circle>
  </g>
  ${BRILLO}
</g></svg>`

// 🌸 OTROS (Fable): conejito rosa con audífonos. Mueve la cabeza al ritmo.
const otro = `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">${DEFS('x', '#ffb3dc', '#e0549f')}${SOMBRA('x')}
<g>${BOTE('0.9s', 5)}
  <g><animateTransform attributeName="transform" type="rotate" values="-4 60 90;4 60 90;-4 60 90" dur="1.8s" repeatCount="indefinite"/>
    <ellipse cx="40" cy="22" rx="9" ry="20" fill="url(#gx)" filter="url(#fx)"/><ellipse cx="80" cy="22" rx="9" ry="20" fill="url(#gx)" filter="url(#fx)"/>
    <ellipse cx="60" cy="72" rx="44" ry="34" fill="url(#gx)" filter="url(#fx)"/>
    <path d="M22 66 Q22 22 60 22 Q98 22 98 66" stroke="#2b2b33" stroke-width="6" fill="none" stroke-linecap="round"/>
    <rect x="14" y="58" width="14" height="24" rx="7" fill="#2b2b33"/><rect x="92" y="58" width="14" height="24" rx="7" fill="#2b2b33"/>
    <path d="M38 66 Q44 60 50 66" stroke="#4a1633" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <path d="M70 66 Q76 60 82 66" stroke="#4a1633" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    ${RUBOR(34, 86, 78, '#ff6f9f')}
    <path d="M54 82 Q60 90 66 82" stroke="#4a1633" stroke-width="3" fill="none" stroke-linecap="round"/>
    <g fill="#e0549f"><text x="104" y="40" font-size="14">♪<animate attributeName="opacity" values="0;1;0" dur="1.8s" repeatCount="indefinite"/></text>
    <text x="4" y="46" font-size="12">♫<animate attributeName="opacity" values="0;1;0" dur="1.8s" begin=".9s" repeatCount="indefinite"/></text></g>
    ${BRILLO}
  </g>
</g></svg>`

export const FIGURAS: Record<string, Figura> = {
  Haiku: { svg: haiku, alt: 'Haiku: rana verde con moño', texto: '🐸' },
  Sonnet: { svg: sonnet, alt: 'Sonnet: figura azul con boina', texto: '🫐' },
  'Opus 5.5': { svg: opus, alt: 'Opus 5.5: figura amarilla con lentes y moño', texto: '🔺' },
  Fable: { svg: otro, alt: 'Figura rosa con audífonos', texto: '🌸' },
}
