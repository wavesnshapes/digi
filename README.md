# digi

A companion for Claude Code from [digi.directory](https://digi.directory): a small TV-headed creature that floats in your session, talks on its face, reacts to how your work is going, and fights back if you click it too much.

This repository is a plugin marketplace with one plugin, `digi`. Its README has the full details: [plugins/digi/README.md](plugins/digi/README.md).

## Install

In Claude Code (the terminal, or the Code tab of the Claude desktop app), run:

    /plugin marketplace add wavesnshapes/digi
    /plugin install digi@digi-directory

On recent versions of Claude Code, one line does both:

    /plugin install digi --marketplace wavesnshapes/digi

To get a newer version later, run `/plugin marketplace update digi-directory`.

## Source

The two code files in `plugins/digi/hooks` are generated. Edit the files in `src`, then run `node build.mjs`.

## License

MIT. See `LICENSE`.
