# digi

A small TV-headed mascot for Claude from [digi.directory](https://digi.directory). Think tamagotchi: it floats on your screen next to Claude, talks on its face, casts its moves, and fights back if you click it too much.

## Get it: the desktop app

**[Open Digi companion](https://claude.ai/artifact/EwEJPtBhnkQ76raMpPDSjb)** in the Claude desktop app and press **Install as app**.

Generate digis one at a time, keep the one you like, and it floats on your screen. Drag it wherever it works for you. It runs on your own computer and your own Claude account.

## Status of the plugin

I first built this as a Claude Code plugin, and that code is still in this repo. Right now I can't make it work the way I want as a plugin or extension: the Code tab of the Claude desktop app doesn't yet give a plugin a place to float a draggable digi. I've asked the Anthropic team for help. Until that changes, the app above is the way to get a digi.

The plugin does still install, and floating should work in Claude Code's fullscreen terminal. In the desktop app it only shows in its own pane.

    /plugin marketplace add wavesnshapes/digi
    /plugin install digi@digi-directory

More on the plugin: [plugins/digi/README.md](plugins/digi/README.md).

## Source

The plugin's two code files in `plugins/digi/hooks` are generated. Edit the files in `src`, then run `node build.mjs`.

## License

MIT. See `LICENSE`.
