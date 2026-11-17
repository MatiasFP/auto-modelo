// La mascota del chat: un personaje que cambia de cara según lo que pasa.
// Estados: espera (duerme), trabaja (piensa), feliz (todo salió bien), triste (algo falló).

export type Animo = 'espera' | 'trabaja' | 'feliz' | 'triste'
export type TipoMascota = 'pelusin' | 'gatito' | 'fantasma'

export const TIPOS: TipoMascota[] = ['pelusin', 'gatito', 'fantasma']

export const MENSAJES: Record<Animo, string> = {
  espera: 'Zzz… avísame cuando me necesites',
  trabaja: 'Pensando…',
  feliz: '¡Listo! Salió bien',
  triste: 'Algo salió mal, mira el chat',
}

const COLORES: Record<TipoMascota, [string, string]> = {
  pelusin: ['#ffe9b8', '#f0b95a'],
  gatito: ['#ffc78a', '#ee8a2b'],
  fantasma: ['#ffffff', '#b9c4e6'],
}

function cuerpo(t: TipoMascota): string {
  if (t === 'gatito') {
    return `<path d="M22 40 L30 8 L52 30Z" fill="url(#gm)"/><path d="M98 40 L90 8 L68 30Z" fill="url(#gm)"/>
      <path d="M28 30 L32 18 L42 28Z" fill="#ff9aa8"/><path d="M92 30 L88 18 L78 28Z" fill="#ff9aa8"/>
      <ellipse cx="60" cy="70" rx="46" ry="38" fill="url(#gm)" filter="url(#fm)"/>
      <path d="M12 74 L28 72 M12 82 L28 78 M108 74 L92 72 M108 82 L92 78" stroke="#8a4a14" stroke-width="2" stroke-linecap="round"/>`
  }
  if (t === 'fantasma') {
    return `<path d="M16 100 L16 56 Q16 14 60 14 Q104 14 104 56 L104 100 Q95 90 86 100 Q77 110 68 100 Q59 90 50 100 Q41 110 32 100 Q24 92 16 100Z" fill="url(#gm)" filter="url(#fm)"/>`
  }
  // pelusín: bolita con antenita
  return `<path d="M60 22 L60 8" stroke="#8a5a14" stroke-width="3" stroke-linecap="round"/>
    <circle cx="60" cy="7" r="5" fill="#ff7a9a"><animate attributeName="r" values="5;6.5;5" dur="1.4s" repeatCount="indefinite"/></circle>
    <ellipse cx="60" cy="70" rx="46" ry="42" fill="url(#gm)" filter="url(#fm)"/>`
}

function cara(a: Animo): string {
  const ojoAbierto = (x: number) =>
    `<ellipse cx="${x}" cy="66" rx="6" ry="7" fill="#2a1d0a"><animate attributeName="ry" values="7;7;0.6;7;7" keyTimes="0;.9;.94;.98;1" dur="3.4s" repeatCount="indefinite"/></ellipse><circle cx="${x - 2}" cy="63" r="2.2" fill="#fff"/>`
  const rubor = `<ellipse cx="34" cy="80" rx="7" ry="4" fill="#ff7f9f" opacity=".55"/><ellipse cx="86" cy="80" rx="7" ry="4" fill="#ff7f9f" opacity=".55"/>`
  if (a === 'espera') {
    return `<path d="M36 68 Q44 74 52 68" stroke="#2a1d0a" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      <path d="M68 68 Q76 74 84 68" stroke="#2a1d0a" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      ${rubor}<ellipse cx="60" cy="86" rx="4" ry="2.5" fill="#2a1d0a"/>
      <g fill="#6b7bb8" font-family="sans-serif" font-weight="bold">
        <text x="92" y="38" font-size="14">z<animate attributeName="y" values="38;18" dur="2.4s" repeatCount="indefinite"/><animate attributeName="opacity" values="0;1;0" dur="2.4s" repeatCount="indefinite"/></text>
        <text x="100" y="44" font-size="10">z<animate attributeName="y" values="44;24" dur="2.4s" begin="1.2s" repeatCount="indefinite"/><animate attributeName="opacity" values="0;1;0" dur="2.4s" begin="1.2s" repeatCount="indefinite"/></text>
      </g>`
  }
  if (a === 'trabaja') {
    return `<g><animateTransform attributeName="transform" type="translate" values="-3 0;3 0;-3 0" dur="1.6s" repeatCount="indefinite"/>${ojoAbierto(44)}${ojoAbierto(76)}</g>
      ${rubor}<path d="M52 86 Q60 90 68 86" stroke="#2a1d0a" stroke-width="3" fill="none" stroke-linecap="round"/>
      <g fill="#2a1d0a">
        <circle cx="96" cy="26" r="3"><animate attributeName="opacity" values=".15;1;.15" dur="1.2s" repeatCount="indefinite"/></circle>
        <circle cx="106" cy="18" r="3.6"><animate attributeName="opacity" values=".15;1;.15" dur="1.2s" begin=".25s" repeatCount="indefinite"/></circle>
        <circle cx="116" cy="10" r="4.2"><animate attributeName="opacity" values=".15;1;.15" dur="1.2s" begin=".5s" repeatCount="indefinite"/></circle>
      </g>`
  }
  if (a === 'feliz') {
    return `<path d="M34 68 Q44 56 54 68" stroke="#2a1d0a" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M66 68 Q76 56 86 68" stroke="#2a1d0a" stroke-width="4" fill="none" stroke-linecap="round"/>
      ${rubor}<path d="M46 80 Q60 98 74 80Z" fill="#7a1f2e"/><path d="M52 88 Q60 94 68 88" fill="#ff7a8a"/>
      <g fill="#ffd23f">
        <path d="M16 24 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3z"><animate attributeName="opacity" values="0;1;0" dur="1.1s" repeatCount="indefinite"/></path>
        <path d="M100 20 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3z"><animate attributeName="opacity" values="0;1;0" dur="1.1s" begin=".5s" repeatCount="indefinite"/></path>
      </g>`
  }
  // triste
  return `<ellipse cx="44" cy="68" rx="5.5" ry="7" fill="#2a1d0a"/><circle cx="42" cy="65" r="2" fill="#fff"/>
    <ellipse cx="76" cy="68" rx="5.5" ry="7" fill="#2a1d0a"/><circle cx="74" cy="65" r="2" fill="#fff"/>
    <path d="M34 54 L50 58 M86 54 L70 58" stroke="#2a1d0a" stroke-width="3" stroke-linecap="round"/>
    <path d="M50 90 Q60 82 70 90" stroke="#2a1d0a" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <path d="M40 76 Q37 84 40 88 Q43 84 40 76Z" fill="#6cc4ff"><animate attributeName="opacity" values="0;1;0" dur="1.8s" repeatCount="indefinite"/></path>
    <g><ellipse cx="100" cy="22" rx="14" ry="8" fill="#8b97b3"/><ellipse cx="90" cy="26" rx="9" ry="6" fill="#8b97b3"/>
      <path d="M96 32 L94 40 M104 32 L102 40" stroke="#6cc4ff" stroke-width="2.5" stroke-linecap="round"><animate attributeName="opacity" values="1;.2;1" dur=".8s" repeatCount="indefinite"/></path></g>`
}

export function mascotaSvg(tipo: TipoMascota, animo: Animo): string {
  const [c1, c2] = COLORES[tipo]
  const bote =
    animo === 'feliz' ? ['0.5s', 10] : animo === 'trabaja' ? ['1.1s', 3] : animo === 'triste' ? ['3s', 1] : ['3.2s', 2]
  return `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><defs>
  <radialGradient id="gm" cx="40%" cy="30%" r="80%"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></radialGradient>
  <filter id="fm" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="3.5"/></filter>
  <filter id="sm"><feGaussianBlur stdDeviation="2.5"/></filter></defs>
  <ellipse cx="60" cy="112" rx="34" ry="5" fill="#000" opacity=".22" filter="url(#sm)"/>
  <g><animateTransform attributeName="transform" type="translate" values="0 0;0 -${bote[1]};0 0" dur="${bote[0]}" repeatCount="indefinite" calcMode="spline" keySplines=".4 0 .6 1;.4 0 .6 1"/>
  ${cuerpo(tipo)}${cara(animo)}
  <ellipse cx="42" cy="46" rx="14" ry="8" fill="#fff" opacity=".28" transform="rotate(-25 42 46)"/>
  </g></svg>`
}

export const EMOJI: Record<Animo, string> = { espera: '😴', trabaja: '🤔', feliz: '😄', triste: '😟' }
