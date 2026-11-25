---
title: Card Creator Guide
description: A complete reference for the Identity and E.G.O creators, covering every input, each entry type, keywords, status effect popups, copying effect text, the color picker, custom keywords, and how saving works.
published: 2026-09-30
---

This guide covers both the [Identity Creator](/creator/identity) and the [E.G.O Creator](/creator/ego). They share the same editor, so almost everything below applies to both. Where the two differ, the section says so.

## Editor layout

The editor has three parts:

- **Input tabs (left).** The narrow column of icons switches between tabs. The first tab is always the stats tab, and each tab after it is one entry on the card (a skill, passive or effect). Drag an entry's tab onto another tab to reorder the entries. The panel can be collapsed, and you can drag its edge to resize it.
- **Card preview (right).** A live preview of the card. You can drag skills on the preview to reorder them, and right-click a skill (or press and hold it on a phone) to open its actions menu.
- **Footer (bottom).** **Download** exports the card as an image, and **Setting/Saves** opens the save menu and custom keywords.

Tab controls:

| Control | What it does |
| --- | --- |
| `+` | Adds a new entry: offense skill, defense skill, passive, custom effect or mental effect. A card can hold up to 40 entries. |
| Reset | Resets the whole card to the default, after a confirmation. |
| Skill actions | The `⋮` button at the top of every entry. It opens a menu to change the entry's type, move it up or down, or delete it (see [Managing entries](#managing-entries)). |

### Managing entries

Every entry has the same actions, and you can reach them in three ways:

- **Skill actions menu.** Open an entry's tab and click the `⋮` button at the top.
- **Right-click on the card preview.** Right-click a skill on the preview. On a phone or tablet, press and hold the skill until the menu opens. Right-clicking does not switch the open tab.
- **Dragging.** Drag a tab in the left column, or a skill on the preview, onto another one to move it there. On a phone or tablet, hold the tab or skill for a moment before dragging so the column can still scroll.

| Action | What it does |
| --- | --- |
| Change type | Converts the entry to another type. The current type is checked and can't be picked. |
| Move up / Move down | Swaps the entry with the one before or after it. Unavailable on the first or last entry. |
| Delete | Removes the entry after a confirmation. |

When you move or delete an entry, the open tab stays on the entry you were editing.

## Stats tab

### Identity stats

| Input | Notes |
| --- | --- |
| Sinner icon | Pick one of the 12 Sinner icons, or upload your own (max 100kb). |
| Sinner color | The accent color for the card frame. Opens the [color picker](#color-picker), which has presets for every Sinner and sin. |
| Splash art | Upload up to 4mb. Drag and zoom on the circle to position the art, or delete it. |
| Rarity | 0, 00 or 000. |
| Title / Name | The title is shown above the name, like "LCB Sinner" above "Yi Sang". |
| Traits | Up to 10 short keywords. Type one and press `+` (or Enter) to add it. |
| Speed | A minimum and a maximum, shown as a range on the card. |
| HP | The health value. |
| Defense level | Shown next to the defense icon. |
| Stagger threshold | Free text, so you can write one value or several, like `60% 30%`. |
| Slash / Pierce / Blunt resist | A multiplier. The label updates as you type: **Ineff** at 0.5 or below, **Endure** below 1, **Weak** at 1.5 or above, **Normal** otherwise. |

### E.G.O stats

| Input | Notes |
| --- | --- |
| Sinner icon / color / splash art | Same as for Identities, but with an 80kb icon limit and a 1.2mb splash art limit. |
| Title / Name | The E.G.O's title and name. |
| E.G.O level | ZAYIN, TETH, HE, WAW or ALEPH. Changes the level icon on the card. |
| Sanity cost | The Sanity spent to use the E.G.O. |
| Sin cost | One value per sin. Sins left at 0 are not shown. |
| Sin resistance | One multiplier per sin. |

A new E.G.O starts with three entries: **Awakening**, **Corrosion** and a **Passive**.

## Entry types

Every entry after the stats tab is one of five types. Switch between them with **Change type** in the [skill actions menu](#managing-entries). Changing the type replaces the entry with a blank entry of the new type, so pick the type before filling it in. The same menu deletes the entry from the card.

### Offense skill

| Input | Notes |
| --- | --- |
| Damage type | Slash, Pierce or Blunt. |
| Sin affinity | One of the seven sins. Colors the skill and sets its sin icon. |
| Skill frame | Frame style 1, 2 or 3, matching the game's skill tiers. |
| Base power | The starting power of the skill. |
| Coin power | Negative values are allowed. |
| Coin number | Each coin is drawn on the card. Coin keywords go up to coin 9. |
| Offense level | Shown next to the attack icon. |
| Atk weight | A whole number, shown on the card. |
| Amt | How many copies of the skill are in the deck, shown as `x3` and so on. |
| Skill image | Upload a skill icon (max 100kb). |
| Skill label | The small tag above the skill name, like `SKILL 1`. |
| Skill name / description | The name, and the effect text in the [rich text editor](#writing-effect-text). |

Coin icons follow the description text. Put `[coin_2_unbreakable]` in the description and the second coin on the card becomes an Unbreakable coin. See [Special coins](#special-coins).

### Defense skill

A defense skill has every input an offense skill has, plus:

| Input | Notes |
| --- | --- |
| Defense type | Block (Guard), Dodge (Evade), Counter, Clashable Guard or Clashable Counter. Sets the defense icon. |
| Show defense icon | Turn it off to hide the defense icon on the card. |

### Passive

| Input | Notes |
| --- | --- |
| Skill label | For example `PASSIVE` or `SUPPORT`. |
| Passive name / description | The name, and the effect text. |
| Sin Own | For each sin, how many must be **owned** to activate the passive. |
| Sin Res | For each sin, how many must be **resonating** to activate the passive. |

The card only shows the sins you set above 0, grouped under "Own" or "Res". Leave everything at 0 for a passive with no requirement.

### Custom effect

A custom effect adds a new status effect to the card, with its own description box.

| Input | Notes |
| --- | --- |
| Effect name | Also becomes a keyword. See below. |
| Custom image | An icon for the effect (max 100kb). |
| Effect color | The keyword's color. The color picker has Neutral, Buff and Debuff presets. |
| Use as custom coin type | Also creates coin versions of the effect. See [Special coins](#special-coins). |
| Effect description | Explains how the effect works. |

When you name a custom effect, it becomes a keyword you can insert in any description. The keyword is the name in lower case with spaces replaced by underscores, so **Blood Frenzy** becomes `[blood_frenzy]`.

### Mental effect

A single description box for how the Identity gains and loses Sanity, like the in-game "Mental" section.

## Writing effect text

Every description box is a rich text editor. The toolbar has **bold**, *italic*, underline, text color (with the [color picker](#color-picker)), reset color, and font size (10 to 24). 

### Keywords with square brackets

Keywords insert the game's colored, underlined terms with their icons, like **Burn**, **Bleed** or **Clash Win**.

1. Type `[` in any description box. A suggestion list opens.
2. Keep typing the keyword name. Use underscores instead of spaces: `[sinking_deluge]`, `[heads_hit]`. The list shows up to 10 keywords that start with what you've typed.
3. Pick one with the arrow keys and Enter, or click it. If you've typed the full name, typing `]` inserts it straight away.
4. Press Esc to close the list without inserting anything.

An inserted keyword is a single block. Backspace deletes the whole keyword, and you can't edit the text inside it. To change it, delete it and insert another.

The full list of built-in keywords, and advice on laying out skill text, is in [Keywords and Status Effects](/blog/keywords-and-status-effects).

### Keyword groups

| Group | Examples | What it inserts |
| --- | --- | --- |
| Status effects | `[burn]`, `[bleed]`, `[tremor]`, `[rupture]`, `[sinking]`, `[poise]`, `[charge]`, `[attack_power_up]` | The effect's icon and name in its Buff, Debuff or Neutral color. |
| Timing | `[on_use]`, `[heads_hit]`, `[clash_win]`, `[clash_lose]`, `[combat_start]`, `[turn_end]`, `[on_kill]` | The trigger label, like the game's `[On Use]`. |
| Coins | `[coin_1]` to `[coin_9]` | The numbered coin icon, for effects that apply to a single coin. |
| Special coins | `[coin_1_unbreakable]`, `[coin_3_excision]` | A special coin marker. It also changes that coin on the card. |
| Your custom effects | `[blood_frenzy]`, `[coin_2_blood_frenzy]` | Your custom effect's icon, name and color. |
| Your custom keywords | `[my_keyword]` | Colored text. See [Custom keywords](#custom-keywords). |

### Special coins

Coins on the card follow the markers in that skill's description:

- `[coin_N_unbreakable]` draws coin *N* as an **Unbreakable** coin.
- `[coin_N_excision]` draws coin *N* as an **Excision** coin.
- `[coin_N_your_effect]` draws coin *N* with your custom effect's icon and color. This works only when **Use as custom coin type** is on for that custom effect.

*N* is the coin's position, from 1 to 9. Coins without a marker are normal coins.

### Status effect popups

Click a custom effect anywhere it appears, in a description box or on the card preview, and a small popup shows its icon, name and description. Press Esc or click outside to close it. The same popup works on post pages, so readers can look up your custom effects without leaving the post.

A popup only opens for custom effects that have a description. Built-in status effects don't open one, and neither does an effect you haven't described yet. If you drag across an effect to select text, the popup stays closed so your selection isn't lost.

### Copying effect text

You can copy text that contains keywords from a description box, or from a card summary on a post page.

- **Pasting outside the site** (Discord, a document, a note) gives plain text with each status effect written as its name, for example "Inflict 3 Burn". Icons are left out.
- **Pasting into a description box** turns the effects back into keywords, with their color, underline and icon. This works for every built-in keyword, and for custom effects that exist on the card you're pasting into.
- A custom effect from a different card pastes as its plain name. Add a custom effect with the same name to this card, and typing `[` with that name inserts the styled version.
- Other formatting, like bold or colored text, is not kept when pasting into a description box.

## Custom keywords

Custom keywords are for recurring terms that don't need a full custom effect, like a faction name or a mechanic you mention often.

- Open **Setting/Saves** and choose **Custom keywords**.
- Enter the keyword, pick a color, and click **Add**. You can have up to 20.
- Click the gear icon on a keyword to edit its text and color, or the trash icon to delete it.
- Insert it with `[` like any other keyword. The name is lower case with spaces replaced by underscores.

Custom keywords are stored in **this browser only**. They aren't part of local or cloud saves, and they don't sync between devices. A card that already contains a custom keyword keeps showing it wherever it's loaded, because the keyword is stored in the text itself.

## Color picker

The same color picker is used for the sinner color, custom effect colors, custom keyword colors and the text color in descriptions.

- **Presets:** the stats tab shows every Sinner's color and every sin's color. The custom effect color shows the Neutral, Buff and Debuff keyword colors.
- **Picking:** drag in the color area, and use the hue and opacity sliders.
- **Typing a value:** type any color into the value field. The format toggle switches between HEX, RGB and HSL.
- **Saved colors:** **Save color** keeps the current color in your saved swatches (up to 12). **Remove** deletes the current color from them, and **Clear all** removes every saved swatch. Saved colors are stored in this browser.

## Saving your work

### Autosave

Every change is saved to your browser as you work, and the card is restored the next time you open the editor. Identities and E.G.Os are autosaved separately. Autosave keeps only the current card, so use a local or cloud save for anything you want to keep.

### Local saves

**Setting/Saves → Local saves** stores named copies of your card in this browser.

- Enter a name and create the save. You have 10 slots per editor, and the menu shows how many you've used.
- **Load** replaces the current card with the save.
- **Overwrite** replaces the save with the current card.
- **Delete** removes the save.
- The pencil icon next to a save's name renames it.

Local saves stay on this device and in this browser. Clearing your site data deletes them.

### Cloud saves

**Setting/Saves → Cloud saves** stores your card on the server so you can open it on any device. You need to be logged in.

- **Create a new save** uploads the card and a preview image of it. If an image on the card can't be loaded, the save fails with a "missing asset" error.
- Search your saves by name. The list shows 10 saves at a time, with page buttons underneath when you have more.
- **Load**, **Overwrite** and **Delete** work the same way as for local saves.

Images on a new or overwritten save finish uploading in the background, which takes a few seconds. Posting the save before that finishes gives a "still uploading" message, so wait a moment and try again.

Cloud saves are also how you share cards: a forum post is built from your cloud saves. See [How to Share Your Creation](/blog/how-to-post-your-creation).

#### Posted in

A cloud save that you've used in a post shows a collapsible **Posted in** list under its name, with a link to each post. Use it to find the posts you should update after changing the save.

When you delete a save that is used in posts, the confirmation says how many. The posts keep their copy of the card and still display it, but they lose the link to the save, so you can no longer update those cards from it.

### Downloading

**Download** in the footer exports the card as an image file. If you see "Missing asset detected", an image on the card (usually the splash art or a skill image) failed to load. Re-upload it and try again.

## Tips

- If you start a new card from an old one, make a local save of the old one first. Reset can't be undone.
- Keep splash art within the size limits by resizing it before upload. Oversized files are rejected.
- If your coin markers don't show on the card, check that the coin number is correct and the skill has at least that many coins.
- After overwriting a cloud save that's already posted, open the post's **Edit** page and press **Update** on that card. Posts don't change on their own.
- Custom keywords are per browser, so if you work on two devices, add them on both.
