# Auto-modelo

Elige solo el modelo de Claude según lo difícil que sea lo que pides:

- **Haiku**: cosas fáciles (saludos, preguntas cortas, datos simples).
- **Sonnet**: trabajo normal (crear o arreglar archivos, varios pasos).
- **Opus 5.5**: cosas difíciles (diseñar algo grande, errores raros, muchos archivos).

Si una tarea empieza fácil pero se alarga, sube sola: a los 6 pasos pasa a Sonnet y a los 16 a Opus.

El panel **"Modelos en uso"** (junto al chat) muestra qué modelo está trabajando ahora,
incluidos los ayudantes (subagentes) que trabajan a la vez, y cuánto se usó cada uno.

## Comandos (escríbelos en el chat)

| Comando | Qué hace |
| --- | --- |
| `/automodelo` | Abre el panel y muestra el estado y la ayuda |
| `/automodelo off` | Lo apaga: se usa el modelo que elijas en la app |
| `/automodelo on` | Lo vuelve a encender |
| `/automodelo fijo opus` | Usa siempre Opus (también `fijo haiku` o `fijo sonnet`) |
| `/automodelo auto` | Vuelve a elegir solo |
| `/automodelo ia off` | Decide solo con palabras clave (más rápido, sin gastar) |
| `/automodelo ia on` | Haiku lee tu pedido y juzga la dificultad (recomendado) |
| `/automodelo pasos 6 16` | Cambia cuándo sube a Sonnet (6) y a Opus (16) |

Los ajustes se guardan y siguen en las próximas sesiones.

## Cambiar las palabras clave

En `hooks/register.tsx`, arriba del todo, están las listas `PALABRAS_DIFICIL`,
`PALABRAS_MEDIO` y `PALABRAS_FACIL`. Puedes agregar o quitar palabras (o pedírselo a Claude).
