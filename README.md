# Idle Clicker Game

This project is a simple idle clicker game built using HTML, Tailwind CSS, and vanilla JavaScript, based on the specifications outlined in the `PRD.md` document. It was developed collaboratively with the assistance of an AI programming partner.

## Overview

The game allows players to generate points by clicking a button. These points can then be spent on upgrades that either increase the points earned per click or automatically generate points over time (idle progression). The game features persistence using `localStorage`, allowing progress to be saved and automatically loaded when the game is revisited. A prestige system allows players to reset their progress for potential future bonuses after reaching a certain point threshold.

## Core Features (from PRD.md)

*   **Technologies**: HTML, Tailwind CSS, JavaScript
*   **Layout**: A responsive three-column layout:
    *   Left: Clicker interface (button, points display, prestige points, save button).
    *   Middle: Display for currently active/purchased upgrades.
    *   Right: Store for purchasing new upgrades and the prestige button.
*   **Clicking Mechanics**: 
    *   Generate points by clicking the main button.
    *   Visual feedback on click.
    *   Points per click increase with relevant upgrades.
*   **Idle Progression**:
    *   Automatically generates points over time based on purchased upgrades.
    *   Calculates and applies points earned while the game was inactive (offline progress).
*   **Upgrade System**:
    *   Purchase upgrades from the store using points.
    *   Upgrades increase either click power or points per second.
    *   Upgrade costs increase after each purchase.
    *   Active upgrades are displayed separately.
*   **Prestige System**:
    *   Option to reset progress (points, upgrades) after reaching 1 million points.
    *   Earns prestige points upon reset (currently tracked, bonus implementation pending).
*   **Persistence**:
    *   Game state (points, upgrades, prestige points, last active time) is saved to `localStorage`.
    *   **Auto-Save**: Automatically saves progress every 5 minutes.
    *   **Manual Save**: Option to save manually via a button.
    *   **Auto-Load**: Automatically loads saved data when the game starts or the page is refreshed.

## How to Play

1.  Open the `index.html` file in a web browser.
2.  Click the "Click Me!" button to earn points.
3.  Use points to buy upgrades from the Store section on the right.
4.  Upgrades will either increase points per click or generate points automatically.
5.  Your progress is saved automatically every 5 minutes and when you manually click "Save Game".
6.  If you close and reopen the game, your progress will be loaded automatically.
7.  Reach 1 million points to unlock the Prestige option.

## Development Notes

This game was developed iteratively based on the `PRD.md` document:

1.  **Foundation**: Set up `index.html` structure, basic CSS (`style.css` with Tailwind directives), and `script.js`.
2.  **Core Logic**: Implemented JavaScript functions for:
    *   Click handling and point updates.
    *   Idle point calculation and game loop (`setInterval`).
    *   Upgrade definition, purchasing, cost scaling, and UI rendering (`renderStore`, `renderActiveUpgrades`).
    *   Persistence using `localStorage` (`saveGame`, `loadGame`, auto-save, auto-load on `window.load`).
    *   Prestige mechanism (`performPrestige`).
3.  **Refinement & Debugging**:
    *   Addressed JavaScript errors (e.g., `ReferenceError` by reordering constant definition).
    *   Adjusted auto-save interval.
    *   Modified the UI based on user feedback (removed unnecessary Load button, relocated Save button). 