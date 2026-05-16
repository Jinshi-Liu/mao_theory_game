# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

「破壁：暗影博弈」is a moderator-operated Mao Theory quiz board game for 4 players (1 moderator + 2 heroes + 1 villain). Pure frontend — open `index.html` in a browser. No build tools, no dependencies, no server.

## File structure

```
mao_theory_game/
├── index.html   # 12 screens, all DOM elements referenced by JS
├── style.css    # Dark theme, CSS variables in :root, screen-based layout
├── game.js      # All game logic, quiz bank (120 questions), state machine

## Architecture

### Screen system
The game is a single-page app where all screens exist in the DOM simultaneously. Only one `.screen.active` is visible at a time. `showScreen(name)` hides all `.screen` divs and activates `#screen-{name}`.

**Current screens (12):** `title → rules, setup-A, setup-B, buzzer, negotiation, play-A, play-B, villain-peek, play-V, resolution, gameover`

Each screen has its own self-contained div with IDs for every dynamic element. Adding a new screen requires: (1) a `<div id="screen-xxx" class="screen">` in HTML, (2) a `showScreen('xxx')` call in JS, (3) any needed CSS.

### State object (`game.js`)
A single mutable global `state` object holds everything. Key fields:

| Field | Type | Purpose |
|-------|------|---------|
| `energy` | `{truth, mass, indep}` | The 3 attribute bars, range 0-10 |
| `round` | number | Current round counter |
| `charA/charB` | `'expert' \| 'leader'` | Hero characters (randomly assigned) |
| `heroBonus/villainBonus` | number | Quiz points earned this round |
| `defenseAttr` | `string \| null` | Expert's defended attribute this round |
| `villainPeeked` | boolean | Whether villain used peek this round |
| `heroAPush/heroBPush/villainDamage` | `{truth, mass, indep} \| null` | Point allocations for current round |
| `quizIdx` | 0-2 | Which quiz question (单选→填空→多选) |
| `usedSingle/usedFill/usedMulti` | number[] | Indices of used questions (prevents repeats) |

### Game flow (one round)
```
startBuzzer() → 3 quiz questions (主持人 clicks winner)
  → startNegotiation() → 30s timer
  → startHeroPlay('A') → startHeroPlay('B')
  → startVillainPeek() → startVillainPlay()
  → resolve() → check win/loss → next round or gameover
```

### Point system
- **Expert hero**: 0 base push points + quiz bonus. Can select one attribute to defend (villain damage = 0 to it) every round.
- **Leader hero**: 2 base push points + quiz bonus.
- **Villain**: 3 base damage points + quiz bonus. Single attribute cap: 3. Can peek at exact value of one attribute every round before attacking.

### Quiz bank (120 questions)
Three arrays in game.js: `Q_SINGLE` (40, `{q, opts[], ans}`), `Q_FILL` (40, `{q, ans}`), `Q_MULTI` (40, `{q, opts[], ans[]}`). The moderator sees the correct answer highlighted in green and clicks who answered correctly. Questions are picked without replacement per game via `pickFrom(arr, used)`.

### Bar visibility
Two functions control what different players see:
- `updatePublicBars(suffix)` — Shows status labels only (危急/稳定/良好/突破), used on negotiation and villain screens
- `updateExactBars(suffix)` — Shows exact numeric values, used on resolution screen

### DOM reference pattern
`$(id)` is shorthand for `document.getElementById(id)`. Dynamic IDs use template literals: `$(`push-${player}-${attr}`)`. All HTML `id` attributes must match these patterns.

### Button event binding
Event listeners are bound once in `init()` using `addEventListener`. For screens that get re-rendered (buzzer, play screens), buttons are cloned via `cloneNode(true)` to strip old listeners before adding new ones — this prevents duplicate handler stacking.

### Win/loss
- Heroes win: any one attribute reaches 10
- Villain wins: any one attribute reaches 0
- Both conditions checked after clamping in `resolve()`, hero win takes priority if both trigger
