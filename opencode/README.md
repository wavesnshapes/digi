# digi for OpenCode

A digi is a small TV-headed creature. This plugin floats one inside OpenCode, in the desktop app and in the terminal. It is the same generator as the [digi.directory](https://digi.directory) demo, so a seed gives the same digi everywhere.

## Install

    opencode plugin add git+https://github.com/wavesnshapes/digi.git

Then restart OpenCode. A digi hatches in the bottom right corner.

No `opencode` command on your computer? Add the plugin to `~/.config/opencode/opencode.json` yourself and restart the app:

    { "plugins": ["git+https://github.com/wavesnshapes/digi.git"] }

## What it does

- **Floats over the whole interface.** Drag it by its body to wherever it is out of your way. It stays there, also after a restart.
- **Swings when you drag it.** The body leans and the head lags behind, then it settles. Nothing stretches. Shake it hard and it gets dizzy.
- **Click it.** It mostly says something, and sometimes casts one of its moves, skills or combos. What it says shows on its screen, where the mouth is.
- **Click it too much and it fights you.** It yells, casts at you every few seconds, then calls a truce when you leave it alone.
- **Nothing cuts itself off.** A move or a line that is playing always finishes before the next one starts.
- **Rare effects come and go.** Rare, Epic and Glitched digis show their effects in short spells with long quiet gaps between, where they only float.
- **Hover for settings.** Hover it for three seconds and a gear shows by its head for three seconds. Click the gear.

## In OpenCode Desktop

The digi is drawn pixel for pixel, the same as in the [desktop app](../README.md), because it is the same code.

- Only its body takes the mouse. The empty corners of its box let clicks through to OpenCode, and clicking it does not take the cursor out of the prompt.
- Type `/digi` in the prompt, or click the gear, for the generator: generate digis one at a time with the arrival animation, a history, the full sheet (stats, moves, skills, combos, looks and rarity), and "Make this my digi". Settings are at the bottom: size from 50 to 400 pixels, and whether the model writes its lines.
- It sits in the bottom right corner, and stays in that corner when the window changes size, until you drag it somewhere else.
- **Let it read my open chat** in settings is off by default. Turn it on and it can talk about what you are doing, and it speaks up when a turn finishes. See "What it reads and sends".
- **Digi: hide or show** in the command palette puts it away and brings it back.
- Escape, Done or a click outside closes the generator.

The desktop part uses OpenCode's plugin interface for the desktop app, which OpenCode still marks as experimental. A later OpenCode release may change it.

## In the terminal

The digi is drawn with character cells, so it is chunkier and has no glow. Dragging and hovering need a terminal with mouse support.

| Command | What it does |
| :- | :- |
| `/digi` | Open the generator |
| `/digi settings` | Size, lines, session comments, show or hide |
| `/digi talk` | Make it say something |
| `/digi move` | Make it cast a move |
| `/digi new` | Swap to a new random digi |
| `/digi small` or `/digi large` | Change its size |
| `/digi hide` or `/digi show` | Put it away or bring it back |

The terminal and the desktop app each keep their own digi and settings.

## What it reads and sends

Everything runs inside your OpenCode. With the model writing its lines, a short request goes to the model your session is set to, through OpenCode itself, each time the digi speaks in its own words. That costs whatever that model costs you, so turn it off in settings to keep it to stock phrases. In the terminal, with session comments on, that request also holds counts from your session: turns, tool calls, failures and which tools were used most. It never holds your prompts or file contents.

In the desktop app, with "Let it read my open chat" on, that request also holds the last few messages of the chat you have open: what you typed and what the AI answered, each cut to a couple of hundred characters, with long codes such as keys blanked out, plus how many tools a reply used and how many failed. Tool output and file contents are not included. It goes to the same model your chat already goes to, and nothing is stored. With the setting off, which is the default, the digi knows nothing about your chat.

The plugin makes no network requests of its own and saves only your digi, history and settings.

## Where it works

OpenCode 2.4 or newer.

## License

MIT. See `LICENSE` in the repository root.
