# digi

A digi is a small neural network creature with a TV for a head. This plugin gives you one as a companion in Claude Code. It floats above your prompt, you drag it wherever there is room, and it stays there. This is the free companion from digi.directory: no wallet, no NFT.

## What it does

- **Lives in your session, in one of two views.** Floating: it sits above the prompt and you drag it anywhere there is room. Widget: a sharper drawing with the glow and colour split, in a corner widget of the Claude desktop app, which stays where the app puts it.
- **Hover and click it.** Its eyes follow the pointer. A click mostly makes it say something, and sometimes makes it cast one of its moves, skills or combos.
- **Click it too much and it fights you.** It yells, casts at you and dodges the pointer for a while, then calls a truce.
- **Talks on its face.** What it says scrolls across its screen where the mouth is. There is no speech bubble.
- **Claude writes its lines.** Each digi has its own tendencies and a seed prompt, and a small Claude model speaks in that voice. Turn this off and it only uses its stock phrases.
- **Watches the session.** It counts turns, tool calls and failures, and after a rough turn it has a comment.

## Install it

In Claude Code (the terminal, or the Code tab of the Claude desktop app), run:

    /plugin marketplace add wavesnshapes/digi
    /plugin install digi@digi-directory

On recent versions of Claude Code, one line does both:

    /plugin install digi --marketplace wavesnshapes/digi

To get a newer version later, run `/plugin marketplace update digi-directory`.

## Settings

Change them in the `/digi` pane, under **Settings**. The same settings are also on the plugin's own page in the terminal: run `/plugin`, open **Installed**, pick **digi**, then **Configure options**. A choice made in the pane wins.

| Setting | What it does |
| :- | :- |
| View | `float` or `widget`. The desktop app starts on `widget`; run `/digi float` to try floating there |
| Size when floating | `small` or `large` |
| Claude writes its lines | Off: stock phrases only |
| Comments on your session | Off: its lines never mention your session |

## Commands

| Command | What it does |
| :- | :- |
| `/digi` | Open the pane: flip through eight random digis and keep one |
| `/digi talk` | Make it say something |
| `/digi move` | Make it cast a move |
| `/digi new` | Swap to a new random digi |
| `/digi float` or `/digi widget` | Switch views without opening the settings |
| `/digi hide` or `/digi show` | Put it away or bring it back |

## What it reads and sends

The plugin runs on your computer inside Claude Code. When Claude writes a line for it, the request goes to Claude on your own plan and counts toward your usage. That request holds the digi's own description and, if session comments are on, a few facts about your session: how many turns and tool calls there were, how many failed, which tools were used most, and the last message you typed, cut to 160 characters with long key-like strings removed. It saves your digi and settings in the plugin's own store. It reads no files and makes no network requests of its own.

## Where it works

It draws in the Code tab of the Claude desktop app and in the terminal's fullscreen layout. The widget view exists only in the desktop app: anywhere else it floats. It does not draw in regular chat, where plugins cannot draw. In a terminal without the fullscreen layout, use `/digi` to see it in the pane.

## License

MIT. See `LICENSE`.
