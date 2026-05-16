# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

「破壁：暗影博弈」is a moderator-operated Mao Theory quiz board game. 3 players (expert + leader vs hacker) + 1 moderator. Pure frontend — open `index.html` in a browser. No build tools, no dependencies.

**Core design principle:** All numerical game state is hidden from players. Only the moderator sees exact values. Players operate on incomplete information — they don't know their teammates' allocations, the current attribute values, or what the opponent did. They can only communicate verbally during the negotiation phase.

## File structure

```
├── index.html   # 11 screens, all DOM elements referenced by JS
├── style.css    # Dark theme, CSS variables in :root, screen-based layout
├── game.js      # All game logic, 120-question bank, state machine
├── CLAUDE.md
├── mao_theory.md    # Reference Mao theory content
└── game_design.md   # Original design document (historical)
```

## Architecture

### Screen system
All screens exist in the DOM simultaneously. `showScreen(name)` hides all `.screen` divs and activates `#screen-{name}`. Screens: `title → rules, setup-A, setup-B, buzzer, negotiation, play-A, play-B, play-V, resolution, gameover` (11 total).

### Game flow (one round)
```
startBuzzer() → 3 quiz questions (moderator clicks winner)
  → startNegotiation() → 30s timer
  → startHeroPlay('A') → startHeroPlay('B')
  → startVillainPlay() (peek + damage on one screen)
  → resolve() → check win/loss → next round or gameover
```

### Win/loss (checked in resolve(), strict comparison)
1. **Villain wins:** Any attribute `< 0` (checked first)
2. **Heroes win:** Any attribute `> 10` (checked second)
3. Attributes are NOT clamped — they can exceed 0-10 range during play. Only final values matter for win/loss.

### Information hiding (critical)
- `updatePublicBars(suffix)` — Status labels only (危机/正常/临门), used on negotiation screen
- `updateExactBars(suffix)` — Exact numeric values, used only on resolution screen
- Villain sees NO bars or numbers on play screen (only peek reveals one attribute's value)
- Heroes see only their allocation UI, not current attribute values
- During negotiation, moderator only reveals count of each status category, not which attribute has which status

### State object (`game.js`)
Single mutable global `state`. Key fields:

| Field | Type | Purpose |
|-------|------|---------|
| `energy` | `{truth, mass, indep}` | Current attribute values (unbounded) |
| `roundStartEnergy` | `{truth, mass, indep}` | Snapshot at round start, used by `getRoundEffects()` |
| `charA/charB` | `'expert' \| 'leader'` | Randomly assigned hero characters |
| `heroABonus/heroBBonus` | number | Per-hero quiz bonuses (split, not shared) |
| `villainBonus` | number | Villain quiz bonus |
| `defenseAttr` | `string \| null` | Expert's defended attribute this round |
| `heroAPush/heroBPush/villainDamage` | `{truth, mass, indep} \| null` | Point allocations for current round |
| `quizIdx` | 0-2 | Which quiz sub-question (单选→填空→多选) |
| `usedSingle/usedFill/usedMulti` | number[] | Indices of used questions (prevents repeats) |

### Point system
- **Expert**: 0 base push + `heroABonus` (or `heroBBonus`). Selects one defense attribute (villain damage to it = 0) every round. Player determined by `getPlayerByChar('expert')`.
- **Leader**: 2 base push + `heroABonus` (or `heroBBonus`). Player determined by `getPlayerByChar('leader')`.
- **Villain (hacker)**: 3 base damage + `villainBonus`. Single attribute cap: 3. Can peek at exact value of one attribute every round (after hero pushes are applied).

### Bonus system (per-round, from quiz)
Bonuses are player-specific: `state.heroABonus`, `state.heroBBonus`, `state.villainBonus`. Each correct quiz answer awards +1 to the specific player who answered correctly. Reset each round in `startBuzzer()`.

### Quiz bank (120 questions)
Three arrays: `Q_SINGLE` (40, `{q, opts[], ans}`), `Q_FILL` (40, `{q, ans}`), `Q_MULTI` (40, `{q, opts[], ans[]}`). Moderator sees correct answer highlighted in green, clicks who answered correctly. Questions picked without replacement via `pickFrom(arr, used)`.

### Energy effects
`applyEnergyDelta(delta)` adds delta to energy attributes. `getRoundEffects()` computes net change since round start. Hero pushes are applied immediately on confirm (not deferred to resolution). Villain damage is applied in `resolve()`.

### DOM patterns
- `$(id)` = `document.getElementById(id)`. Dynamic IDs use template literals: `` $(`push-${player}-${attr}`) ``.
- Buttons on re-rendered screens (buzzer, play) use `cloneNode(true)` + `replaceChild` to strip old listeners before adding new ones — prevents duplicate handler stacking.
- Defense buttons and peek buttons are rebuilt from scratch each time their screen is shown (no cloning issues).
