---
title: Creating Custom Color Themes
---

1. Take a look at how the [built-in themes](https://github.com/Ulauncher/Ulauncher/tree/HEAD/data/themes) are written
2. Ensure that you have the user theme directory `mkdir -p ~/.config/ulauncher/user-themes`
3. Copy an existing theme to this directory and give it a unique name.
4. Open Ulauncher Preferences and select your theme
5. Edit the colors in the CSS files
6. Press `Ctrl+Space` (or your hotkey) to check the result
7. Repeat 5 - 6 until you get your desired result

## GTK CSS documentation

- <https://docs.gtk.org/gtk3/css-overview.html>
- <https://docs.gtk.org/gtk3/css-properties.html>

## New simplified CSS theme format

Ulauncher themes were originally implemented as a directory with a manifest json file with theme metadata to complement the css file,
but as of Ulauncher version 6.0.0, we support and recommend just using plain CSS files.

We still support the legacy theme format. You install either kind by putting the themes in your user theme directory.
