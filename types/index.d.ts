export type Nivel = 'haiku' | 'sonnet' | 'opus'

/** Un "trabajador" que está usando un modelo ahora mismo. */
export type Activo = {
  id: string
  quien: string
  modelo: string
  desde: number
}

/** Lo que decidió el mod para la conversación principal. */
export type Decision = {
  nivel: Nivel
  razon: string
  cuando: number
}

export type Animo = 'espera' | 'trabaja' | 'feliz' | 'triste'
export type EstadoMascota = { animo: Animo; cuando: number }

export type Config = {
  mascota?: 'pelusin' | 'gatito' | 'fantasma'
  activo: boolean
  fijo?: Nivel
  usarIA: boolean
  pasosSonnet: number
  pasosOpus: number
}

declare module 'claude-code' {
  interface PluginState {
    'auto-modelo': {
      activos: Shaped<Activo[]>
      decision: Shaped<Decision | null>
      uso: Shaped<Record<string, number>>
      config: Shaped<Config>
      animo: Shaped<EstadoMascota>
    }
  }
}
