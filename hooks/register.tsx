import { atom, read, update } from 'claude-code'
import type { Register } from 'claude-code'

import type { Activo, Config, Decision, Nivel } from '../types'
import { FIGURAS } from './figuras'
import { EMOJI, MENSAJES, TIPOS, mascotaSvg } from './mascota'
import type { Animo, TipoMascota } from './mascota'

// ─────────────────────────────────────────────────────────────
//  AJUSTES QUE PUEDES CAMBIAR A MANO
// ─────────────────────────────────────────────────────────────

/** Qué modelo exacto se usa para cada nivel. */
const MODELOS: Record<Nivel, string> = {
  haiku: 'claude-haiku-5-5',
  sonnet: 'claude-sonnet-5-5',
  opus: 'claude-opus-5-5',
}

/** Palabras que hacen pensar que la tarea es DIFÍCIL (→ Opus). */
const PALABRAS_DIFICIL = [
  'arquitectura', 'diseña', 'diseñar', 'refactor', 'reestructura', 'migra',
  'desde cero', 'sistema completo', 'aplicación completa', 'app completa',
  'no funciona', 'no anda', 'se rompe', 'se cae', 'depura', 'debug',
  'optimiza', 'rendimiento', 'seguridad', 'investiga a fondo', 'analiza todo',
  'base de datos', 'integración', 'integra', 'automatiza', 'mod ',
  'muchos archivos', 'todo el proyecto', 'plan completo', 'complejo', 'difícil',
]

/** Palabras que hacen pensar que la tarea es MEDIA (→ Sonnet). */
const PALABRAS_MEDIO = [
  'crea', 'haz', 'hazme', 'arregla', 'corrige', 'cambia', 'modifica', 'agrega',
  'añade', 'quita', 'elimina', 'edita', 'escribe', 'programa', 'código',
  'archivo', 'función', 'script', 'error', 'falla', 'bug', 'busca', 'revisa',
  'compara', 'resume', 'excel', 'tabla', 'pasos',
]

/** Palabras que hacen pensar que la tarea es FÁCIL (→ Haiku). */
const PALABRAS_FACIL = [
  'hola', 'gracias', 'ok', 'vale', 'sí', 'si', 'no', 'qué es', 'que es',
  'qué significa', 'que significa', 'traduce', 'cuánto es', 'cuanto es',
  'explica en una frase', 'dime', 'listo', 'perfecto',
]

const CONFIG_INICIAL: Config = {
  activo: true,
  usarIA: true,
  // Si Haiku necesita más de estos pasos en una misma respuesta, pasa a Sonnet.
  pasosSonnet: 6,
  // Si sigue complicándose y pasa de estos pasos, pasa a Opus.
  pasosOpus: 16,
}

// ─────────────────────────────────────────────────────────────

const PANEL = 'auto-modelo'

const activos = atom({ plugin: 'auto-modelo', key: 'activos' } as const, [] as Activo[], { shape: 'activos-1' })
const decision = atom({ plugin: 'auto-modelo', key: 'decision' } as const, null as Decision | null, { shape: 'decision-1' })
const uso = atom({ plugin: 'auto-modelo', key: 'uso' } as const, {} as Record<string, number>, { shape: 'uso-2' })

// Precio relativo por token (estimado): Haiku 1, Sonnet 3, Opus 5.
// Son supuestos para calcular el ahorro; ajústalos si conoces los precios reales.
const PESO: Record<string, number> = { Haiku: 1, Sonnet: 3, 'Opus 5.5': 5 }

const animo = atom({ plugin: 'auto-modelo', key: 'animo' } as const, { animo: 'espera', cuando: 0 } as { animo: Animo; cuando: number }, { shape: 'animo-1' })
const config = atom({ plugin: 'auto-modelo', key: 'config' } as const, CONFIG_INICIAL, { shape: 'config-1' })

const ORDEN: Nivel[] = ['haiku', 'sonnet', 'opus']
const NOMBRE: Record<Nivel, string> = { haiku: 'Haiku', sonnet: 'Sonnet', opus: 'Opus 5.5' }
const COLOR: Record<string, string> = { Haiku: 'green', Sonnet: 'blue', 'Opus 5.5': 'magenta', Opus: 'magenta' }

function nombreDe(modelo: string): string {
  const m = modelo.toLowerCase()
  if (m.includes('haiku')) return 'Haiku'
  if (m.includes('sonnet')) return 'Sonnet'
  if (m.includes('opus')) return 'Opus 5.5'
  if (m.includes('fable')) return 'Fable'
  return modelo
}

function contiene(texto: string, lista: string[]): number {
  return lista.filter(p => texto.includes(p)).length
}

/** Clasificación rápida por reglas (sin gastar nada). */
function porReglas(texto: string): { nivel: Nivel; razon: string } {
  const t = ' ' + texto.toLowerCase() + ' '
  const dificil = contiene(t, PALABRAS_DIFICIL)
  const medio = contiene(t, PALABRAS_MEDIO)
  const facil = contiene(t, PALABRAS_FACIL)
  if (dificil >= 2 || (dificil >= 1 && texto.length > 300) || texto.length > 1500) {
    return { nivel: 'opus', razon: 'reglas: tarea larga o compleja' }
  }
  if (dificil >= 1 || medio >= 1 || texto.length > 250) {
    return { nivel: 'sonnet', razon: 'reglas: tarea de trabajo normal' }
  }
  if (facil >= 1 || texto.length < 120) {
    return { nivel: 'haiku', razon: 'reglas: pregunta corta o simple' }
  }
  return { nivel: 'sonnet', razon: 'reglas: sin señales claras' }
}

const INSTRUCCION =
  'Clasifica cuán difícil es esta petición para un asistente de programación y oficina. ' +
  'facil = saludo, pregunta corta, dato, explicación simple, cambio mínimo. ' +
  'medio = editar o crear código o archivos, varios pasos, buscar y revisar. ' +
  'dificil = diseñar algo grande, depurar errores raros, muchos archivos, investigación a fondo, decisiones delicadas.\n\nPetición:\n'

async function cargarConfig($: any): Promise<Config> {
  const guardada = (await $.store.get('config')) as Partial<Config> | undefined
  return { ...CONFIG_INICIAL, ...(guardada ?? {}) }
}

async function guardarConfig($: any, cfg: Config) {
  await $.store.set('config', cfg)
  await update($, config, () => cfg)
}

async function ponerActivo($: any, uno: Activo) {
  await update($, activos, lista => {
    const sin = lista.filter(a => a.id !== uno.id)
    const viejo = lista.find(a => a.id === uno.id)
    return [...sin, { ...uno, desde: viejo && viejo.modelo === uno.modelo ? viejo.desde : uno.desde }]
  })
}

async function quitarActivo($: any, id: string) {
  await update($, activos, lista => lista.filter(a => a.id !== id))
}

function textoEstado(cfg: Config, d: Decision | null): string {
  if (!cfg.activo) return 'Auto-modelo: apagado'
  if (cfg.fijo) return `Auto-modelo: fijo en ${NOMBRE[cfg.fijo]}`
  return `Auto-modelo: ${d ? NOMBRE[d.nivel] : 'esperando'}`
}

const AYUDA = [
  'Uso de /automodelo:',
  '  /automodelo            → abre el panel y muestra el estado',
  '  /automodelo on | off   → enciende o apaga el cambio automático',
  '  /automodelo fijo haiku|sonnet|opus → usa siempre ese modelo',
  '  /automodelo auto       → vuelve a elegir solo',
  '  /automodelo ia on|off  → usar Haiku para juzgar la dificultad (on) o solo palabras clave (off)',
  '  /automodelo mascota pelusin|gatito|fantasma → cambia la mascota',
  '  /automodelo pasos 6 16 → a los 6 pasos sube a Sonnet, a los 16 a Opus',
].join('\n')

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'automodelo',
      description: 'Auto-modelo: panel y ajustes (on, off, fijo, auto, ia, pasos)',
    })
    const cfg = await cargarConfig($)
    await update($, config, () => cfg)
    await update($, activos, () => [])
    $.ui.status(textoEstado(cfg, await read($, decision)))
    void $.ui.open({ id: PANEL, title: 'Modelos en uso' })
    return next(e)
  })

  on('command.run', { command: 'automodelo' }, async ($, e) => {
    const partes = e.args.trim().toLowerCase().split(/\s+/).filter(Boolean)
    const cfg = await cargarConfig($)
    let msg = ''
    const [a, b, c] = partes
    if (partes.length === 0) {
      await $.ui.open({ id: PANEL, title: 'Modelos en uso' })
      msg = textoEstado(cfg, await read($, decision)) + '\n\n' + AYUDA
    } else if (a === 'on' || a === 'encender') {
      cfg.activo = true
      msg = 'Auto-modelo encendido.'
    } else if (a === 'off' || a === 'apagar') {
      cfg.activo = false
      msg = 'Auto-modelo apagado: se usa el modelo que elijas en la app.'
    } else if (a === 'fijo' && b && (ORDEN as string[]).includes(b)) {
      cfg.activo = true
      cfg.fijo = b as Nivel
      msg = `Usando siempre ${NOMBRE[b as Nivel]}.`
    } else if (a === 'auto') {
      cfg.activo = true
      delete cfg.fijo
      msg = 'Vuelve a elegir el modelo solo según la tarea.'
    } else if (a === 'ia' && (b === 'on' || b === 'off')) {
      cfg.usarIA = b === 'on'
      msg = cfg.usarIA ? 'Haiku juzgará la dificultad de cada pedido.' : 'Solo se usarán las palabras clave.'
    } else if (a === 'mascota' && b && (TIPOS as string[]).includes(b)) {
      cfg.mascota = b as TipoMascota
      msg = `Mascota cambiada a ${b}.`
    } else if (a === 'pasos' && Number(b) > 0 && Number(c) > Number(b)) {
      cfg.pasosSonnet = Number(b)
      cfg.pasosOpus = Number(c)
      msg = `Subirá a Sonnet a los ${b} pasos y a Opus a los ${c}.`
    } else {
      return { text: AYUDA }
    }
    await guardarConfig($, cfg)
    $.ui.status(textoEstado(cfg, await read($, decision)))
    return { text: msg }
  })

  // Al empezar cada respuesta de la conversación principal: decidir el nivel.
  on('turn.start', async ($, e, next) => {
    if (e.agentId === undefined) await update($, animo, () => ({ animo: 'trabaja', cuando: 0 }))
    if (e.agentId !== undefined) return next(e)
    const cfg = await cargarConfig($)
    const texto = e.text.trim()
    if (cfg.activo && !cfg.fijo && texto.length > 0) {
      let elegido = porReglas(texto)
      if (cfg.usarIA) {
        try {
          const r = await $.model.classify(INSTRUCCION + texto.slice(0, 4000), ['facil', 'medio', 'dificil'], {
            model: MODELOS.haiku,
          })
          if (r === 'facil') elegido = { nivel: 'haiku', razon: 'Haiku juzgó: fácil' }
          else if (r === 'medio') elegido = { nivel: 'sonnet', razon: 'Haiku juzgó: intermedia' }
          else if (r === 'dificil') elegido = { nivel: 'opus', razon: 'Haiku juzgó: difícil' }
        } catch {
          // si falla, se queda con las reglas
        }
      }
      const d: Decision = { ...elegido, cuando: Date.now() }
      await update($, decision, () => d)
      $.ui.status(textoEstado(cfg, d))
    }
    return next(e)
  })

  // Cada vez que se envía un pedido al modelo: aplicar el modelo elegido.
  on('turn.step', async function* ($, e, next) {
    const quien = e.agentId
    if (quien !== undefined) {
      // Subagente: no lo cambiamos, solo lo mostramos en el panel.
      const lista = await read($, activos)
      const ya = lista.find(a => a.id === quien)
      await ponerActivo($, { id: quien, quien: ya?.quien ?? 'Ayudante', modelo: nombreDe(e.model), desde: Date.now() })
      return yield* next(e)
    }

    const cfg = await cargarConfig($)
    let modelo = e.model
    if (cfg.activo) {
      if (cfg.fijo) {
        modelo = MODELOS[cfg.fijo]
      } else {
        let d = await read($, decision)
        if (d) {
          // Si la tarea se está alargando, subir de nivel.
          let nivel = d.nivel
          if (nivel === 'haiku' && e.index >= cfg.pasosSonnet) nivel = 'sonnet'
          if (nivel !== 'opus' && e.index >= cfg.pasosOpus) nivel = 'opus'
          if (nivel !== d.nivel) {
            d = { nivel, razon: `se complicó (${e.index} pasos)`, cuando: Date.now() }
            await update($, decision, () => d)
            $.ui.status(textoEstado(cfg, d))
            $.ui.toast(`Auto-modelo: la tarea se complicó, paso a ${NOMBRE[nivel]}`)
          }
          modelo = MODELOS[nivel]
        }
      }
    }
    await ponerActivo($, { id: 'principal', quien: 'Conversación principal', modelo: nombreDe(modelo), desde: Date.now() })
    return yield* next(modelo === e.model ? e : { ...e, model: modelo })
  })

  // Subagentes que arrancan: anotarlos con su nombre.
  on('agent.spawn', async ($, e, next) => {
    const r = await next(e)
    if (r.deny === undefined && r.agentId) {
      await ponerActivo($, {
        id: r.agentId,
        quien: e.description || e.subagentType,
        modelo: nombreDe(r.model),
        desde: Date.now(),
      })
    }
    return r
  })

  on('turn.complete', async ($, e, next) => {
    await quitarActivo($, e.agentId ?? 'principal')
    if (e.agentId === undefined) {
      const estado: Animo = e.reason === 'answer' ? 'feliz' : 'triste'
      await update($, animo, () => ({ animo: estado, cuando: 0 }))
    }
    if (e.usage) {
      // Tokens reales que gastó cada modelo en esta respuesta.
      const nombre = nombreDe(e.usage.model)
      const tokens = (e.usage.input_tokens ?? 0) + (e.usage.output_tokens ?? 0) + (e.usage.cache_read_input_tokens ?? 0) + (e.usage.cache_creation_input_tokens ?? 0)
      await update($, uso, u => ({ ...u, [nombre]: (u[nombre] ?? 0) + tokens }))
    }
    return next(e)
  })

  on('ui.render', { component: 'Pane', requestId: PANEL }, async ($, e) => {
    const { Box, Text, ...otros } = $.ui.resolve(e)
    const Svg = (otros as { Svg?: typeof Text }).Svg as any
    const cfg = await read($, config)
    const d = await read($, decision)
    const lista = await read($, activos)
    const mood = (await read($, animo)).animo
    const u = await read($, uso)
    const total = Object.values(u).reduce((s, n) => s + n, 0)
    const costo = Object.entries(u).reduce((s, [nom, n]) => s + n * (PESO[nom] ?? 5), 0)
    const costoOpus = total * PESO['Opus 5.5']
    const ahorro = costoOpus > 0 ? Math.max(0, Math.min(100, Math.round((1 - costo / costoOpus) * 100))) : 0

    return (
      <Box flexDirection="column" gap={1}>
        <Box flexDirection="column">
          <Text bold>{textoEstado(cfg, d)}</Text>
          {cfg.activo && !cfg.fijo && d && <Text dimColor>Motivo: {d.razon}</Text>}
        </Box>

        <Box flexDirection="row" gap={1}>
          {!Svg
            ? <Text>{EMOJI[mood]}</Text>
            : <Svg source={mascotaSvg(cfg.mascota ?? 'pelusin', mood)} alt={'Mascota: ' + mood} width={84} height={84} isInteractive />}
          <Box flexDirection="column">
            <Text bold>Mascota</Text>
            <Text dimColor>{MENSAJES[mood]}</Text>
          </Box>
        </Box>

        <Box flexDirection="column">
          <Text bold>Trabajando ahora</Text>
          {lista.length === 0 && <Text dimColor>Nadie: en espera.</Text>}
          {lista.map(a => {
            const fig = FIGURAS[a.modelo]
            return (
              <Box flexDirection="row" gap={1}>
                {!Svg || !fig
                  ? <Text>{fig?.texto ?? '●'}</Text>
                  : <Svg source={fig.svg} alt={fig.alt} width={72} height={72} isInteractive />}
                <Box flexDirection="column">
                  <Text color={COLOR[a.modelo] ?? 'gray'} bold>{a.modelo}</Text>
                  <Text dimColor>{a.quien}</Text>
                </Box>
              </Box>
            )
          })}
        </Box>

        <Box flexDirection="column">
          <Text bold>Ahorro de tokens (estimado)</Text>
          {total === 0 && <Text dimColor>Todavía no hay respuestas.</Text>}
          {total > 0 && (
            <Text>
              Ahorro frente a usar solo Opus 5.5: <Text bold color="green">{ahorro}%</Text>
            </Text>
          )}
          {total > 0 && Object.entries(u).map(([nombre, n]) => (
            <Text>
              <Text color={COLOR[nombre] ?? 'gray'}>{nombre}</Text>
              <Text dimColor>: {n.toLocaleString('es')} tokens ({Math.round((n / total) * 100)}%)</Text>
            </Text>
          ))}
          {total > 0 && (
            <Text dimColor>Total {total.toLocaleString('es')} tokens. Costo relativo: {costo.toLocaleString('es')} contra {costoOpus.toLocaleString('es')} si fuera todo Opus.</Text>
          )}
        </Box>

        <Text dimColor>Escribe /automodelo para ver los ajustes.</Text>
      </Box>
    )
  })
}
