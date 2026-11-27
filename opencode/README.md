# digi for OpenCode

A digi is a small TV-headed creature. This plugin floats one inside your OpenCode terminal. It is the same generator as the [digi.directory](https://digi.directory) demo, so a seed gives the same digi everywhere.

## Install

    opencode plugin add git+https://github.com/wavesnshapes/digi.git

Start `opencode` and a digi hatches in the bottom right corner.

## What it does

- **Floats over the whole interface.** Drag it by its body to wherever it is out of your way. It stays there, and the text around it stays readable.
- **Swings when you drag it.** The body leans and the head lags behind, then it settles. Shake it hard and it gets dizzy.
- **Click it.** It mostly says something, and sometimes casts one of its moves, skills or combos. What it says scrolls across its screen where the mouth is.
- **Click it too much and it fights you.** It yells, casts at you every few seconds, then calls a truce when you leave it alone.
- **Nothing cuts itself off.** A move or a line that is playing always finishes before the next one starts.
- **Rare effects come and go.** Rare, Epic and Glitched digis show their effects in short spells with long quiet gaps between, where they only float.
- **Hover for settings.** Hover it for three seconds and a gear shows by its head for three seconds. Click the gear.

## The generator

Run `/digi`. Generate digis one at a time: each one arrives on screen line by line and is kept in your history. The floating digi is the stage, so whatever you pick is what floats. From there you can make it yours, read its full sheet (stats, moves, skills, combos, looks and rarity), play its moves, or restore a digi from its code.

| Command | What it does |
| :- | :- |
| `/digi` | Open the generator |
| `/digi settings` | Size, lines, session comments, show or hide |
| `/digi talk` | Make it say something |
| `/digi move` | Make it cast a move |
| `/digi new` | Swap to a new random digi |
| `/digi small` or `/digi large` | Change its size |
| `/digi hide` or `/digi show` | Put it away or bring it back |

The same actions are in the command palette under **digi**.

## What it reads and sends

Everything runs inside your OpenCode. With "Your model writes its lines" on, a short request goes to the model OpenCode is set to, through OpenCode itself, each time the digi speaks in its own words. That costs whatever that model costs you, so turn it off in settings to keep it to stock phrases. With session comments on, that request also holds counts from your session: turns, tool calls, failures and which tools were used most. It never holds your prompts or file contents. The plugin makes no network requests of its own and saves only your digi, history and settings.

## Where it works

OpenCode 2.4 or newer, in the terminal. Dragging and hovering need a terminal with mouse support. OpenCode Desktop does not show it yet.

## License

MIT. See `LICENSE` in the repository root.
