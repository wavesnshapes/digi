import { describe, expect, mock, test } from 'claude-code/testing'

const CELL = { maxColumns: 20, floatRows: 30, floatColumns: 100, isWorking: false, view: {} }
const PANE = { title: 'Digi', isFocused: true, bodyColumns: 60, placement: 'dock', scroll: {}, view: {} }
const SEED = 123456789

// The world a session gives the mod: a clock, a store holding a saved digi, and quiet answers for the rest
function world(on: any, saved: Record<string, unknown> = {}, surfaces: string[] = ['terminal']) {
  const clock = mock.clock(on, { now: 1_000_000 })
  const kept: Record<string, any> = { cfg: { seed: SEED, ...saved } }
  const opened: any[] = []
  on('store.get', (_$: unknown, e: any) => ({ value: kept[e.key] }))
  on('store.set', (_$: unknown, e: any) => { kept[e.key] = JSON.parse(JSON.stringify(e.value)); return { value: undefined } })
  on('session.start', (_$: unknown, e: any) => ({ cwd: e.cwd }))
  on('session.surfaces', () => ({ value: surfaces }))
  on('ui.toast', () => ({ value: undefined }))
  on('ui.invalidate', () => ({ value: undefined }))
  on('ui.open', (_$: unknown, e: any) => { opened.push(e); return { value: { isPlaced: true } } })
  on('ui.close', () => ({ value: undefined }))
  on('command.register', () => ({ value: undefined }))
  on('model.complete', () => ({ value: { isAnswered: true, text: 'nice try. i saw that', usage: {} } }))
  return { clock, kept, opened }
}

describe('digi', () => {
  test('floats beside the prompt in the terminal', async ($, on) => {
    world(on)
    await $.session.start({ cwd: '/work' } as never)
    const ui = await $.ui.mount({ plugin: 'digi', surface: 'terminal', component: 'BesidePrompt', props: CELL as never })
    await ui.resize({ columns: 100, rows: 30, in: 'digi' })
    await ui.advance(300)
    const drawn = JSON.stringify(await ui.drawn({ in: 'digi' }))
    expect(drawn).toContain('absolute')
    expect(drawn.length).toBeGreaterThan(2000)
    await ui.unmount()
  })

  test('a drag moves it and the place is saved', async ($, on) => {
    const { kept } = world(on)
    await $.session.start({ cwd: '/work' } as never)
    const ui = await $.ui.mount({ plugin: 'digi', surface: 'terminal', component: 'BesidePrompt', props: CELL as never })
    await ui.resize({ columns: 100, rows: 30, in: 'digi' })
    await ui.advance(100)
    // the block is 36 by 13 cells and starts two cells in from the right, on the bottom
    await ui.pointer({ type: 'down', x: 80, y: 22, button: 'left' })
    await ui.pointer({ type: 'move', x: 60, y: 12, button: 'left' })
    await ui.advance(100)
    await ui.pointer({ type: 'up', x: 60, y: 12, button: 'left' })
    await ui.advance(100)
    expect(kept.cfg.rx).toBe(22)
    expect(kept.cfg.by).toBe(10)
    await ui.unmount()
  })

  test('too many clicks and it fights, then calls a truce', async ($, on) => {
    const { clock } = world(on)
    await $.session.start({ cwd: '/work' } as never)
    const ui = await $.ui.mount({ plugin: 'digi', surface: 'terminal', component: 'BesidePrompt', props: CELL as never })
    await ui.resize({ columns: 100, rows: 30, in: 'digi' })
    for (let i = 0; i < 6; i++) { await ui.post({ t: 'poke' }); await clock.advance(300) }
    await ui.advance(200)
    const face = async () => JSON.stringify(await ui.findAll({ type: 'Text', in: 'digi' }))
    expect(await face()).toContain('"text":">"')
    // the kit runs a timer once per advance, so walk the drawing's clock forward a frame at a time
    for (let i = 0; i < 420; i++) await ui.advance(50)
    expect(await face()).not.toContain('"text":">"')
    await ui.unmount()
  })

  test('the pane shows a candidate and keeps it', async ($, on) => {
    world(on)
    await $.session.start({ cwd: '/work' } as never)
    await $.command.run({ command: 'digi', args: '' } as never)
    const ui = await $.ui.mount({ plugin: 'digi', surface: 'desktop', component: 'Pane', requestId: 'digi', props: PANE as never })
    expect(await ui.find({ key: 'keep' })).toBeDefined()
    await ui.press({ key: 'next' })
    await ui.press({ key: 'keep' })
    await ui.unmount()
  })

  test('the pane draws the preview as a vector drawing in the desktop app', async ($, on) => {
    world(on, {}, ['desktop'])
    await $.session.start({ cwd: '/work' } as never)
    await $.command.run({ command: 'digi', args: '' } as never)
    const ui = await $.ui.mount({ plugin: 'digi', surface: 'desktop', component: 'Pane', requestId: 'digi', props: PANE as never })
    expect(JSON.stringify(await ui.drawn())).toContain('<svg')
    await ui.press({ key: 'poke' })
    await ui.press({ key: 'cast' })
    await ui.press({ key: 'size' })
    expect(await ui.find({ key: 'speak' })).toBeDefined()
    await ui.press({ key: 'close' })
    await ui.unmount()
  })

  test('debug reports what the app did with the floating view', async ($, on) => {
    world(on, {}, ['desktop'])
    on('session.version', () => ({ value: '2.1.332' }))
    await $.session.start({ cwd: '/work' } as never)
    const ui = await $.ui.mount({ plugin: 'digi', surface: 'desktop', component: 'BesidePrompt', props: CELL as never })
    const out: any = await $.command.run({ command: 'digi', args: 'debug' } as never)
    expect(out.text).toContain('floating digi drawn 1 times')
    await ui.unmount()
  })

  test('the widget draws a vector digi on the desktop app', async ($, on) => {
    const { opened } = world(on, { mode: 'widget' }, ['desktop'])
    await $.session.start({ cwd: '/work' } as never)
    expect(JSON.stringify(opened)).toContain('widget')
    const ui = await $.ui.mount({ plugin: 'digi', surface: 'desktop', component: 'Pane', requestId: 'digi-widget', props: { ...PANE, placement: 'widget' } as never })
    const drawn = JSON.stringify(await ui.drawn())
    expect(drawn).toContain('<svg')
    await ui.press({ key: 'poke' })
    await ui.unmount()
  })
})
