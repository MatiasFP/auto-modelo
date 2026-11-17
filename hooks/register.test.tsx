import { expect, mock, test } from 'claude-code/testing'

const PANEL = {
  plugin: 'auto-modelo',
  component: 'Pane',
  requestId: 'auto-modelo',
  props: {
    title: 'Modelos en uso',
    isFocused: false,
    bodyColumns: 40,
    placement: 'dock',
    scroll: { offset: 0, bodyRows: 20 },
    view: {},
  },
} as const

test('el panel muestra el estado en cada superficie', async ($, on) => {
  mock.store(on)
  on('command.register', () => ({ value: { command: 'automodelo' } }))
  on('ui.open', () => ({ value: { isPlaced: true } }))
  on('session.start', (_, e) => ({ cwd: e.cwd }))

  await $.session.start({ cwd: '/', surface: 'desktop', isInteractive: true })

  for (const surface of ['terminal', 'desktop', 'vscode', 'mobile'] as const) {
    const ui = await $.ui.mount({ ...PANEL, surface })
    expect((await ui.find({ type: 'Text', text: /Auto-modelo/ }))?.text).toBe('Auto-modelo: esperando')
    expect((await ui.find({ type: 'Text', text: /en espera/ }))?.text).toBe('Nadie: en espera.')
    await ui.unmount()
  }
})

test('/automodelo fijo opus se refleja en el panel', async ($, on) => {
  mock.store(on)
  on('command.register', () => ({ value: { command: 'automodelo' } }))
  on('ui.open', () => ({ value: { isPlaced: true } }))
  on('session.start', (_, e) => ({ cwd: e.cwd }))

  await $.session.start({ cwd: '/', surface: 'desktop', isInteractive: true })
  const r = await $.command.run({ command: 'automodelo', args: 'fijo opus' })
  expect(r.text).toBe('Usando siempre Opus 5.5.')

  const ui = await $.ui.mount({ ...PANEL, surface: 'desktop' })
  expect((await ui.find({ type: 'Text', text: /Auto-modelo/ }))?.text).toBe('Auto-modelo: fijo en Opus 5.5')
  await ui.unmount()
})
