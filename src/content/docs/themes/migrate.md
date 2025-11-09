---
title: Migrating Themes
---

1. If your theme manifest.json defines a `css_file_gtk_3.20` property, this is the theme css file. Otherwise `css_file` is the theme css file.
2. Start by flattening imports. For example if the theme contains `@import url("theme.css");`, then replace this by the actual content of "theme.css".
3. Copy the color defined in manifest.json `matched_text_hl_colors.when_not_selected` to your css file as `.item-highlight`. Ex: `.item-highlight { color: #ff7b57 }`.
4. If your color for `matched_text_hl_colors.when_selected` differs from `when_not_selected`, then also add that to your css file as `.selected.item-box .item-highlight { color: #ffcbbd }`.
5. If manifest.json defines `extend_theme` and it's not null, then locate that theme and copy the css selectors and properties from it to the top of your theme. Then go through and filter out the duplicated selectors, that your css file already had before (this is likely most of them).
6. Copy/move the css file directly to the user theme directory. If you want to keep it compatible with your old theme name, it should have the `name` property from manifest.json as it's file name and `.css` as the extension.