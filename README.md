# Bredina's Tool for Character Creation [TTRPG Character Manager (D&D 2024 SRD)]

This project is a web application for creating and managing tabletop RPG characters, built around the Dungeons & Dragons 2024 SRD ruleset.
The goal is to provide a flexible and rule-aware system that helps players build characters, track abilities and features, and manage gameplay effects during a session.

The application is designed not only as a character sheet generator, but also as an interactive tool that can be used during play, automatically applying rule effects, conditions, and temporary modifiers while keeping the character state consistent.

The project is implemented with a strong focus on modular rule handling, allowing character features, events, and counters to dynamically modify the character without hardcoding specific mechanics.

## Features
### Character Creation

- Create characters based on the D&D 2024 SRD rules.
- Automatic management of:
  - class features
  - spells
  - skills
  - proficiencies
  - modifiers
- Support for dynamic rule interactions through a modular modification system.
- Interactive Gameplay Support

The application can be used during the game session to track and visualize changes in real time:

- apply conditions
- trigger events
- update counters and resources
- automatically update attacks, abilities, and modifiers

All changes are immediately reflected in the character sheet so players can see the active effects and rule interactions at a glance.

### Character Sheet Export

The app will support exporting:

- Character Sheet PDF
- Turn Economy / Action Summary PDF

These exports aim to provide players with a clear and printable reference for their characters and available actions.

### Custom Rules Support

Users will be able to:

- add custom features
- define homebrew rules
- extend the ruleset without modifying the core system

This makes the application adaptable for house rules, homebrew campaigns, or custom classes.

### Local Data Storage

Characters and custom rules are stored locally using IndexedDB, allowing:

- persistent character storage
- offline usage
- multiple saved characters and rulesets

### Localization

The application supports:

- English
- Italian

Both the interface and the rule content are designed to work in either language.

## Project Goals

The main goals of this project are:

- Create a flexible rule engine for tabletop RPG mechanics
- Provide a dynamic character sheet that updates automatically based on rule effects
- Support interactive gameplay tracking
- Allow custom rule extensions
- Provide clean PDF exports for in-game reference
- Showcase complex state management and modular game rule handling

## Source Material

This project uses the Dungeons & Dragons 2024 System Reference Document (SRD) as the primary rules reference.
